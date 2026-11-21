---
title: Edit the Food Dataset with the Knowledge Editor
sidebar_label: Knowledge Editor
description: Install the Knowledge Editor, the desktop app that edits the Pocket Nutrition ingredient catalogue, then propose your changes.
reviewed: true
---

# Knowledge Editor

The Food Dataset is a folder of small YAML files: one per ingredient, one per link to a scientific
source, one per cooking factor. The Knowledge Editor is a desktop app that edits those files for
you, through forms: no YAML to write by hand. You then propose your changes as a pull request.

It runs on macOS, Linux and Windows.

## 1. Install the editor

Download the file for your system from the
[latest release](https://github.com/pocket-nutrition/knowledge-editor/releases/latest):

| System | File |
| --- | --- |
| macOS, Apple silicon | `…_aarch64.dmg` |
| macOS, Intel | `…_x64.dmg` |
| Linux | `…_amd64.AppImage`, or `…_amd64.deb` for Debian and Ubuntu |
| Windows | `…_x64-setup.exe` |

The builds are not code-signed, so your system warns you the first time you open the editor:

- **macOS:** open it once, then go to **System Settings → Privacy & Security** and choose
  **Open Anyway**.
- **Windows:** in the SmartScreen window, choose **More info**, then **Run anyway**.

To build it yourself instead, follow the
[repository's README](https://github.com/pocket-nutrition/knowledge-editor#readme).

## 2. Get the dataset

First [fork the dataset](https://github.com/pocket-nutrition/knowledge/fork) on GitHub: your changes
will go to your copy before you propose them. Then clone your fork:

```bash
git clone https://github.com/YOUR-ACCOUNT/knowledge.git
```

## 3. Point the editor at the dataset

Tell the editor where your `knowledge` folder is, in its settings file, `config.toml`:

```toml
repo_path = "/path/to/knowledge"
```

| System | Settings file |
| --- | --- |
| macOS | `~/Library/Application Support/pocket-nutrition-knowledge-editor/config.toml` |
| Linux | `~/.config/pocket-nutrition-knowledge-editor/config.toml` |
| Windows | `%APPDATA%\pocket-nutrition-knowledge-editor\config.toml` |

Then open the editor.

## 4. Edit

The editor lists every ingredient of the dataset. Open one to change its names, food group, usual
portion or density, or to link it to its scientific sources: Ciqual, McCance and Widdowson, USDA,
Open Food Facts. Each change is checked against the dataset's rules before it is saved, so a
mistyped value never reaches the files.

## 5. Propose your changes

Every edit is a change in your `knowledge` folder. Commit it on a branch and push it to your fork:

```bash
cd knowledge
git checkout -b add-chicken-thigh
git add .
git commit -m "Add chicken thigh"
git push -u origin add-chicken-thigh
```

Then open a pull request from your fork on GitHub. The maintainers review it and bring it into the
Food Dataset, where it improves the search, the portions and the next model training for everyone.

:::tip[Not ready to edit files?]
Spotted a wrong value in the app? Tap **Report** on the ingredient: the report reaches the team with
no setup at all.
:::
