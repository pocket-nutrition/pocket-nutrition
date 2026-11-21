---
title: Host your vault
description: Run your own vault, the end-to-end encrypted copy of the journal, with Docker Compose, on its own.
---

# Host your vault

The vault keeps an end-to-end encrypted copy of your journal: the apps encrypt it before sending
it, and the server never holds the keys. It stands on its own: you need neither the Nutrition API
nor anything else to run it.

## 1. Set your secrets

Start from the folder you [set up](./docker-compose.md). Open `.env` and fill in:

- `VAULT_DB_PASSWORD`, the password of the vault's database;
- `VAULT_PRELOGIN_SECRET`, which keeps login challenges stable across restarts.

## 2. Start the vault

```bash
docker compose --profile vault up -d vault
```

The vault answers on `http://localhost:8010`, with a health check at `/healthz`.

## 3. Create your account, then close sign-ups

Anyone who can reach the vault can create an account. Create yours from the app (see below), then
set `VAULT_REGISTRATION=closed` in `.env` and apply it:

```bash
docker compose --profile vault up -d vault
```

To create accounts later without opening sign-ups, set `VAULT_ADMIN_TOKEN`: it enables the admin
endpoint that creates them.

## 4. Make it reachable from the apps

The apps only talk to HTTPS servers. Put the vault [behind HTTPS](./https.md) with the domain you
set as `VAULT_DOMAIN`, then [connect the apps](./connect-the-apps.md#vault).

:::warning[Back up the vault]
The vault stores the encrypted journals of its users. It cannot read them, but losing its database
loses them: back up the `vault-db-data` volume.
:::

## Good to know

- **Voice and photo** deliver their results through the vault. To host them too, see
  [Host voice and photo](./voice-and-photo.md).
- [The vault repository](https://github.com/pocket-nutrition/vault) documents its protocol and
  threat model.
