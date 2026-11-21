---
title: Put it behind HTTPS
sidebar_label: HTTPS
description: Give your self-hosted services HTTPS addresses with Caddy, so the apps can reach them.
---

# Put it behind HTTPS

The apps only talk to HTTPS servers. The `https` profile of the Compose file adds Caddy, which
gets certificates from Let's Encrypt on its own.

1. Point a domain name at your server for each service you run:

   | Service | Setting in `.env` | Example |
   | --- | --- | --- |
   | Nutrition API | `API_DOMAIN` | `api.example.org` |
   | Food Dataset site | `DATASET_DOMAIN` | `dataset.example.org` |
   | Vault | `VAULT_DOMAIN` | `vault.example.org` |
   | Recognition server | `RECOGNITION_DOMAIN` | `recognition.example.org` |

2. Write them in `.env`. Leave the ones you do not run as they are.
3. Open ports 80 and 443, then start Caddy:

   ```bash
   docker compose --profile https up -d caddy
   ```

If you leave a domain at its default (`*.localhost`), it gets a local certificate instead. That is
handy to test in a browser on the same machine.

Next: [connect the apps](./connect-the-apps.md).
