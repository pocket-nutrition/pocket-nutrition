---
title: Set up a training bench
description: Load the public food tables, train the cooking model and build the search index, without running the API or anything else.
---

# Set up a training bench

A training bench is what you need to work on the model or the data: the Food Dataset, the public
food tables, and the job that trains the model and builds the search index. No API, vault or
recognition server. It takes about an hour.
[Training the cooking model](../architecture/cooking-model.md) explains what each step does.

## 1. Set your secrets

Start from the folder you [set up](./docker-compose.md). Open `.env` and fill in
`POSTGRES_PASSWORD`. To train on your own Food Dataset, fill in `RELOAD_TOKEN` as well: it lets
you reload the catalogue (see [below](#work-on-your-own-food-dataset)).

## 2. Start the bench

```bash
docker compose up -d postgres redis elasticsearch community
```

This starts the three stores and `community`, which downloads the Food Dataset into Redis. It
only turns healthy once the catalogue is loaded, about 24,000 small files: follow it with
`docker compose logs -f community`.

## 3. Load the food tables

Each loader downloads one public table and stores it in PostgreSQL. Load every table except Open
Food Facts, which takes a few minutes in all:

```bash
for loader in ciqual mccance usda usda_foundation usda_sr usda_cooking_yields; do
  docker compose run --rm data --loader "$loader"
done
```

| Loader | Source | Download |
| --- | --- | --- |
| `ciqual` | Ciqual, the French food composition table, by ANSES | ~4 MB |
| `mccance` | McCance and Widdowson, the UK table | 5–50 MB |
| `usda`, `usda_foundation`, `usda_sr` | USDA FoodData Central: survey foods, Foundation Foods, SR Legacy | 5–50 MB each |
| `usda_cooking_yields` | USDA Cooking Yields for Meat and Poultry | ~35 KB |
| `off` | Open Food Facts, packaged products, optional | ~1.2 GB, 1 to 3 hours |

To include packaged products in the search index, load `off` as well: see
[Add packaged foods](./packaged-foods.md).

## 4. Train and build the search index

```bash
docker compose run --rm ingest
```

The job reads the Food Dataset from Redis and the tables from PostgreSQL. It builds the training
pairs, trains the cooking model, saves it as `model.joblib` in the `models` volume, then builds a
new search index in Elasticsearch.

Count about 30 minutes on 4 cores. In a hurry? Set `OPTUNA_TRIALS=5` in `.env` for a faster,
slightly less precise model.

## 5. Look at the results

- **The training pairs** are in PostgreSQL, in `training_pairs`. The Food Dataset site, at
  `http://localhost:8003`, shows them for each ingredient.
- **The model** is in the `models` volume. To copy it into the current folder:

  ```bash
  docker compose run --rm -v "$PWD:/out" models-init cp /models/model.joblib /out/
  ```

- **To try it**, start the cooking model and the API next to the bench, then query them as in
  [Run the Nutrition API, step 7](./run-the-api.md#7-check-that-it-works):

  ```bash
  docker compose up -d ml api
  ```

## Work on your own Food Dataset

`community` downloads the Food Dataset from GitHub: the repository named by `DATASET_REPO` in
`.env`, `pocket-nutrition/knowledge` by default. To train on your own changes, fork it, set
`DATASET_REPO` to your fork, then restart `community` and train again:

```bash
docker compose up -d community
docker compose run --rm ingest
```

`GITHUB_TOKEN` is optional: a token only raises GitHub's download rate limit. After each new
commit to your fork, reload the catalogue before training:

```bash
curl -X POST -H "X-Reload-Token: your-reload-token" http://localhost:8003/admin/reload
```

## When to train again

- **The Food Dataset changed.** Reload it first, as above.
- **You loaded a newer table**, or Open Food Facts.
- **You pulled a new `ingest` image** and want its improvements.

If the API runs next to the bench, restart the cooking model after each training:
`docker compose restart ml`.

## Troubleshooting

- **`community` never turns healthy.** It cannot download the catalogue. Read
  `docker compose logs community` and check the machine's internet access.
- **Packaged products are missing after loading Open Food Facts.** The products reach the search
  index only when it is built: run `docker compose run --rm ingest` again.
- **Elasticsearch stops right after starting, on Linux.** Raise the memory map limit:
  `sudo sysctl -w vm.max_map_count=262144`.
