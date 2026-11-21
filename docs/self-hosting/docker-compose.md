---
title: Set up Docker Compose
sidebar_label: Set up
description: Prepare the Docker Compose base shared by every self-hosting guide, the machine it needs, the two files and the secrets.
---

# Set up Docker Compose

Every service runs from one Compose file and its settings. Set them up once here, then follow the
guide for each service you want: they all use the same folder.

## What you need

- A Linux server or computer with Docker Engine 24 or later and Docker Compose 2.23.1 or later.
- 4 CPU cores, 8 GB of memory and 20 GB of disk. Open Food Facts, which is optional, adds about
  10 GB.
- To use the apps with your server: a domain name pointing at it, with ports 80 and 443 open. The
  apps only talk to HTTPS servers.

## Get the files

Create a folder and download the Compose file and its settings:

```bash
mkdir pocket-nutrition && cd pocket-nutrition
curl -fsSL -o docker-compose.yml https://pocketnutrition.org/self-hosting/docker-compose.yml
curl -fsSL -o .env https://pocketnutrition.org/self-hosting/env.example
```

You can also download [docker-compose.yml](pathname:///self-hosting/docker-compose.yml) and
[env.example](pathname:///self-hosting/env.example) from your browser.

## Fill in your settings

`.env` lists every setting, grouped by service, with a comment for each. Each guide says which
ones to fill in. Generate every secret with:

```bash
openssl rand -hex 32
```

Keep to hexadecimal values like these. Some end up inside database addresses, where other symbols
would break the connection.

## How the file is organised

- **Without a profile:** the Nutrition API, the cooking model, the Food Dataset site and their
  databases.
- **Profiles**, started on demand: `vault`, `voice` for voice and photo, `https` for Caddy, and
  `setup` for the one-shot jobs that load the data and train the model. Each guide gives the
  command that starts its profile.
- **Ports** listen on `127.0.0.1` only, so nothing is reachable from outside until you put it
  [behind HTTPS](./https.md).

To update, run `docker compose pull`, then start your services again with the command from their
guide.
