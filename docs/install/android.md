---
title: Install on Android
description: Download the Android app, keep it up to date, and check its signing certificate.
reviewed: true
---

# Install on Android

Requires Android 8.0 or later.

## Download

| | Updates | |
|---|---|---|
| **[Download the APK](https://github.com/pocket-nutrition/android/releases/latest)** | manual | download `pocket-nutrition-android-<version>.apk` from the latest release and open it on your phone |
| **[Obtainium](https://github.com/ImranR98/Obtainium/releases)** | automatic | install Obtainium, then open `obtainium://add/https://github.com/pocket-nutrition/android` on your phone |

The first time, Android asks you to allow installs from your browser or from Obtainium.

## App details

| | |
|---|---|
| Source code | [github.com/pocket-nutrition/android](https://github.com/pocket-nutrition/android) |
| License | [MPL-2.0](https://github.com/pocket-nutrition/android/blob/main/LICENSE) |
| Package name | `org.pocketnutrition` |
| Certificate SHA-256 | `75:DA:30:2D:B5:4B:9B:AF:BF:B4:B2:B8:41:95:0E:A5:E2:B0:6A:A8:A5:0F:E5:F1:29:80:1B:AB:E1:81:63:E3` |
| Certificate SHA-1 | `15:0B:9C:DB:22:F2:19:48:73:3E:49:AA:14:12:4E:11:79:10:3C:F0` |

Every channel ships the same signed APK, so you can switch from one to another without reinstalling.

## Check the APK (optional)

- On the phone: [AppVerifier](https://github.com/soupslurpr/AppVerifier) compares the installed app with the
  SHA-256 above.
- On a computer: `apksigner verify --print-certs <apk>` must print
  `75da302db54b9bafbfb4b2b841950ea5e2b06aa8a50fe5f129801babe18163e3`. Each release also has a `.sha256`
  file for the download itself.
