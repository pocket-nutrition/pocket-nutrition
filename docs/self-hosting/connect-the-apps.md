---
title: Connect the apps
description: Point the iPhone and Android apps at your own Nutrition API, vault and recognition server.
reviewed: true
---

# Connect the apps

Once your services answer over HTTPS (see [Put it behind HTTPS](./https.md)), the app lets you
replace the official servers with yours, one service at a time. The iPhone and Android apps have
the same settings, and both refuse plain `http://` addresses.

## Nutrition API

Open **Settings › Server**:

1. Enter your API's address, for example `https://api.example.org`.
2. Tap **Use this address**.

Searches, barcode scans and nutrition values now come from your server. **Back to official
server** undoes it.

## Vault

1. Open **Settings › Cloud vault**, then **Advanced**.
2. Enter your vault's address, for example `https://vault.example.org`, and tap **Check server**.
3. Create your account or log in as usual.

Your journal is encrypted on your phone before it leaves, with keys that never reach the server.
Your vault stores it without being able to read it, like the official one.

## Voice and photo

Open **Settings › Voice recognition server**:

1. Enter your recognition server's address, for example `https://recognition.example.org`.
2. In **API key**, enter the key you set as `RECOGNITION_API_KEY`. Leave it empty if your server
   trusts your vault (see [Host voice and photo](./voice-and-photo.md#1-choose-how-the-apps-get-in)).

Voice and photo also need a vault account: the result comes back sealed into your
vault, never through the recognition server.

Your recognition server only receives the recordings and photos: a worker turns them into foods.
See [Host voice and photo](./voice-and-photo.md).
