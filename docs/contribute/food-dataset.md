---
title: Improve the Food Dataset
sidebar_label: Food Dataset
description: How to report a wrong value, fix a food or add one to the Pocket Nutrition Food Dataset.
reviewed: true
---

# Improve the Food Dataset

The Food Dataset is the list of ingredients the apps can find: their names, usual portions, links
to the public food tables and what cooking does to them. A wrong portion or a missing food shows up
directly in everyone's journal, so corrections are the most useful contribution there is.

## Report a wrong value

In the app, open the ingredient and tap **Report**, then say what is wrong. No account is needed.
[Feedback and votes](../architecture/feedback.md) explains what is stored and what happens next.

## Fix it yourself

Today the dataset works like code:

- **It lives in a Git repository**, [pocket-nutrition/knowledge](https://github.com/pocket-nutrition/knowledge),
  as small text files: one per ingredient, one per link to a food table, one per cooking factor.
  Anyone can read it, and every change has a history.
- **The [Knowledge Editor](./knowledge-editor.md)** edits those files through forms, so you never
  write them by hand.
- **Changes come in as pull requests.** Each one is checked automatically against the dataset's
  rules, then reviewed by a maintainer before it is merged. The repository's
  [contribution guide](https://github.com/pocket-nutrition/knowledge/blob/main/CONTRIBUTING.md)
  describes each file type for those who prefer a text editor.

A merged change reaches the apps with the next training run, which rebuilds the search index and
the cooking model.

This process will evolve as more people contribute; this page will follow.
