---
title: Self-hosting
sidebar_label: Introduction
description: Run the Pocket Nutrition services on your own server, one guide per use case, and what you need.
reviewed: true
---

# Self-hosting

Every service the apps talk to can run on your own machine. Today they run with Docker Compose:
[set it up](./docker-compose.md) once, then follow the guide for your case. Each guide starts only
what its case needs.

## Pick your case

| You want to… | Guide | What it starts |
| --- | --- | --- |
| Use the apps with your own nutrition server | [Run the Nutrition API](./run-the-api.md) | The API and the cooking model, with the published model and search index |
| Work on the model or the data | [Set up a training bench](./training-bench.md) | The Food Dataset, the food tables and the training job, no API |
| Keep your encrypted journal on your server | [Host your vault](./host-the-vault.md) | The vault and its database |
| Keep voice and photo on your machines | [Host voice and photo](./voice-and-photo.md) | The recognition server, plus a worker |

The guides combine: the same Compose file runs any mix of them. Then come two shared steps:
[put it behind HTTPS](./https.md) and [connect the apps](./connect-the-apps.md).

Packaged products from Open Food Facts are an option you add yourself. The published search index
leaves them out, because their licence asks that a database built from them be shared under the
same terms. See [Add packaged foods](./packaged-foods.md).

## What you can run

| Service | What it does | Status |
| --- | --- | --- |
| **Nutrition API** | Finds foods and computes their nutrition, raw or cooked. | Ready |
| **Vault** | Keeps an end-to-end encrypted copy of the journal. | Ready |
| **Voice and photo** | Turns a recording or a photo into a list of foods. | Needs a worker |

Voice and photo need a worker, a computer that does the recognition and fetches its jobs from your
server. The one published today runs on a Mac with local models.

:::info[Web viewer]
The web viewer, which opens a vault in a browser, cannot be pointed at another vault yet, so it is
not part of self-hosting for now.
:::

How these services work and connect is explained in the
[System overview](../architecture/overview.md).

## Licences

- **The software.** The Nutrition API, the Food Dataset and the jobs that feed them are free
  software under the AGPL-3.0: you can run them, study them and change them. If you offer a
  modified version to others over a network, the licence asks you to publish your changes.
- **The data.** Each source keeps its own terms. Open Food Facts is under the Open Database
  Licence (ODbL), and its product photos under CC BY-SA. The public food tables come with their
  publishers' terms of use: Ciqual by ANSES, McCance and Widdowson by the UK government, FoodData
  Central by the USDA, the reference values by EFSA.

:::note[Kubernetes]
The official servers run on Kubernetes. A generic Helm chart is not public yet: when it is, it will
be a second way to deploy, next to Docker Compose.
:::
