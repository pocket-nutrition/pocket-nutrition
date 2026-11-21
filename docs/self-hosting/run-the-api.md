---
title: Run the Nutrition API
description: Start your own Nutrition API with Docker Compose, using the published cooking model and search index, so the apps can use your server.
---

# Run the Nutrition API

This guide starts the Nutrition API and the cooking model, then installs the published model and
search index. Nothing is trained: it takes about fifteen minutes. To build the model yourself,
see [Set up a training bench](./training-bench.md) instead.

Start from the folder you [set up](./docker-compose.md).

## 1. Set your secret

Open `.env` and fill in `POSTGRES_PASSWORD`.

## 2. Start the services

```bash
docker compose up -d postgres elasticsearch ml api
docker compose ps
```

This starts PostgreSQL, Elasticsearch, the cooking model (`ml`) and the Nutrition API (`api`).
The API is up at this point, but it cannot answer yet: it still needs the model, the search index
and the reference intakes.

## 3. Download the model and the search index

:::info[First release on its way]
The first release with these files is being prepared. Until it is out, the links below answer
"not found". In the meantime, [set up a training bench](./training-bench.md): it builds the same
files from the public data.
:::

Each release of the training pipeline publishes four files:

| File | What it is |
| --- | --- |
| `model.joblib` | The cooking model |
| `product_search.mapping.json` | The settings of the search index |
| `product_search.ndjson.gz` | The documents of the search index, in Elasticsearch's bulk format: ingredients with their reference values, and recipes |
| `SHA256SUMS` | The checksums of the three files above |

```bash
mkdir -p artifacts && cd artifacts
base=https://github.com/pocket-nutrition/ingest/releases/latest/download
for f in model.joblib product_search.mapping.json product_search.ndjson.gz SHA256SUMS; do
  curl -fsSLO "$base/$f"
done
sha256sum -c SHA256SUMS   # on macOS: shasum -a 256 -c SHA256SUMS
cd ..
```

A model and a search index from the same release belong together. Always install both.

## 4. Install the model

The model goes into the `models` volume, which the cooking model reads when it starts:

```bash
docker compose run --rm -v "$PWD/artifacts:/in:ro" models-init cp /in/model.joblib /models/model.joblib
docker compose restart ml
```

## 5. Load the search index

Elasticsearch only listens inside Docker, so each command runs through it. Create an empty index,
load the documents into it, then give it the name the API looks for, `product_search`:

```bash
index="product_search_$(date +%s)"

docker compose exec -T elasticsearch curl -fsS -X PUT "localhost:9200/$index" \
  -H 'Content-Type: application/json' --data-binary @- < artifacts/product_search.mapping.json

gunzip -c artifacts/product_search.ndjson.gz | docker compose exec -T elasticsearch \
  curl -fsS -X POST "localhost:9200/$index/_bulk?refresh=true" \
  -H 'Content-Type: application/x-ndjson' --data-binary @- | grep -o '"errors":[a-z]*'

docker compose exec -T elasticsearch curl -fsS -X POST localhost:9200/_aliases \
  -H 'Content-Type: application/json' \
  -d "{\"actions\": [{\"add\": {\"index\": \"$index\", \"alias\": \"product_search\"}}]}"
```

The second command prints `"errors":false` when every document went in.

## 6. Load the reference intakes

The [daily targets](../architecture/daily-targets.md) start from EFSA's reference intakes. Load
them into PostgreSQL, which takes a few seconds:

```bash
docker compose run --rm data --loader efsa_drv
```

## 7. Check that it works

Search for a food:

```bash
curl -s "http://localhost:8080/ingredients/search?q=chicken&lang=en&limit=3"
```

Compute a meal:

```bash
curl -s http://localhost:8080/nutrition \
  -H 'Content-Type: application/json' \
  -d '[{"name": "chicken breast", "quantity": 150, "unit": "g", "cookingMethod": "grilled", "measuredState": "raw"}]'
```

The answer lists energy, macronutrients, vitamins and minerals, with a `confidence` score and the
`source` of the values. Your server's API reference is at
`http://localhost:8080/swagger-ui/index.html`.

Every port listens on `127.0.0.1` only. To use your server from the apps, put it
[behind HTTPS](./https.md), then [connect the apps](./connect-the-apps.md).

## Add-ons

- **Packaged foods.** Barcodes and branded products come from Open Food Facts, which the download
  leaves out: see [Add packaged foods](./packaged-foods.md).
- **The Food Dataset site.** To browse the catalogue on your server, run
  `docker compose up -d community`. It downloads the catalogue, about 24,000 small files, and
  turns healthy once it is loaded, at `http://localhost:8003`.

## Keep it up to date

The images are rebuilt from the main branch of each repository. To update yours:

```bash
docker compose pull
docker compose up -d postgres elasticsearch ml api
```

To install a newer release of the model and the search index, repeat steps 3 and 4. Then load
the new index as in step 5, but move the name `product_search` over to it in one step, and delete
the old index:

```bash
old=$(docker compose exec -T elasticsearch curl -fsS "localhost:9200/_cat/aliases/product_search?h=index")
index="product_search_$(date +%s)"
# Create and fill "$index": the first two commands of step 5.

docker compose exec -T elasticsearch curl -fsS -X POST localhost:9200/_aliases \
  -H 'Content-Type: application/json' \
  -d "{\"actions\": [{\"remove\": {\"index\": \"$old\", \"alias\": \"product_search\"}}, {\"add\": {\"index\": \"$index\", \"alias\": \"product_search\"}}]}"
docker compose exec -T elasticsearch curl -fsS -X DELETE "localhost:9200/$old"
```

The API keeps answering from the old index until the name moves.

## Troubleshooting

- **Elasticsearch stops right after starting, on Linux.** It needs a higher memory map limit:
  `sudo sysctl -w vm.max_map_count=262144`. Add `vm.max_map_count=262144` to `/etc/sysctl.conf`
  to keep it after a reboot.
- **Searches return nothing.** The search index is missing. Load it (step 5), or build it on a
  [training bench](./training-bench.md).
- **Nutrition values come back empty.** The cooking model reads its file only when it starts:
  restart it after installing a model (`docker compose restart ml`).
- **Everything is slow on a Mac with Apple silicon.** The images run through amd64 emulation
  there, so expect a slower start.
