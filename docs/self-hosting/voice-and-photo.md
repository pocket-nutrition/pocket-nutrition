---
title: Host voice and photo
description: Run your own recognition server and a worker, so that recordings and plate photos never leave your machines.
---

# Host voice and photo

Logging by voice or photo takes two parts:

- **The recognition server** receives the recordings and photos from the apps and keeps them in
  memory until a worker takes them. It processes nothing itself.
- **A worker** fetches each job, turns it into a list of foods, and seals the result into the
  user's vault, so that only their phone can open it. It only makes outbound calls: the machine it
  runs on needs no open port.

You also need a vault, since the results arrive through it: the official one, or
[your own](./host-the-vault.md).

## 1. Choose how the apps get in

Start from the folder you [set up](./docker-compose.md), the same one as your vault if you host
it. Your server needs at least one of these two ways to let the apps in, and accepts both:

- **Trusted vaults.** List in `RECOGNITION_TRUSTED_VAULTS` the host names of the vaults you trust,
  for example your own `vault.example.org`, or `vault.pocketnutrition.org`. With each recording,
  the app sends a single-use token from the user's vault, and your server asks that vault whether
  it is valid before accepting the job. The users of these vaults have no key to type. Anyone with
  an account on a listed vault can use your server: list a vault whose sign-ups you control
  ([close sign-ups](./host-the-vault.md#3-create-your-account-then-close-sign-ups) on your own).
- **A shared key.** Set `RECOGNITION_API_KEY`, and give it to each user, who types it in the app.
  Use it for people whose vault is not on your list.

## 2. Set the worker's key

Fill in `RECOGNITION_WORKER_KEY` in `.env`: the worker's own key, at least 16 characters and
different from `RECOGNITION_API_KEY`. The server does not start without it.

## 3. Start the recognition server

```bash
docker compose --profile voice up -d recognition
```

It answers on `http://localhost:8020`. Until a worker connects, jobs wait in the queue, then
expire after 48 hours.

## 4. Run a worker

A worker must be authorised: it authenticates with `RECOGNITION_WORKER_KEY`, so only the workers
you give that key to can fetch jobs from your server. It can run on a computer or as an online
service. The one published today,
[recognition-worker-osx](https://github.com/pocket-nutrition/recognition-worker-osx), runs on a
Mac with local speech and vision models. Install it from its repository, and give it your
recognition server's address and `RECOGNITION_WORKER_KEY`.

## 5. Make it reachable from the apps

Put the recognition server [behind HTTPS](./https.md) with the domain you set as
`RECOGNITION_DOMAIN`, then [connect the apps](./connect-the-apps.md#voice-and-photo).
