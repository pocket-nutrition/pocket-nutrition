---
title: Add packaged foods
description: Load Open Food Facts so that your server finds packaged products by name and by barcode.
reviewed: true
---

# Add packaged foods

Packaged products come from [Open Food Facts](https://world.openfoodfacts.org), the open database
of food products. With them, your server finds branded products by name and by barcode. They are
optional: ingredients and recipes work without them.

A product carries the values printed on its label: energy, protein, fat, carbohydrates, sugars,
fibre and sodium. Other nutrients stay empty, and the cooking method does not apply. See
[Life of a nutrition request](../architecture/nutrition-request.md#2-computing-the-nutrition).

## Why the download leaves them out

Open Food Facts is published under the Open Database Licence (ODbL), which asks that a database
built from it be shared under the same licence. The published search index therefore contains
only the Food Dataset, and you load Open Food Facts yourself, straight from its source.

## 1. Load Open Food Facts

```bash
docker compose run --rm data --loader off
```

The loader downloads the full export, about 1.2 GB compressed and 9 GB once unpacked, and keeps
the products that have at least one nutrition value. It takes 1 to 3 hours and about 10 GB of
disk.

## 2. Add the products to the search index

The products reach search the next time the [training job](./training-bench.md) runs: it
rebuilds the search index and adds every product it finds in PostgreSQL. Until then, nothing else
changes.

## What changes

- **Search** shows packaged products below the ingredients. When no ingredient matches, you only
  see products.
- **Barcode scans** find the products that were in the export. The API never calls Open Food Facts
  while you scan. To pick up newer products, run the loader again, then rebuild the index.

## What the licence asks of you

The ODbL lets you use the data freely, on two conditions:

- **Credit** Open Food Facts wherever you show its data.
- **Share alike.** Any database you publish that is built from it goes out under the ODbL too.

The search index stores the addresses of product photos, not the photos themselves, which stay on
Open Food Facts' servers under CC BY-SA. This page is a summary, not legal advice: the
[licence text](https://opendatacommons.org/licenses/odbl/1-0/) is what counts.
