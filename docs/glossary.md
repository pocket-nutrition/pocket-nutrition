---
title: Glossary
description: The words the Pocket Nutrition documentation uses, in plain English.
reviewed: true
---

# Glossary

### Cooking method

How a food was cooked: `raw`, `boiled`, `steamed`, `grilled`, `roasted`, `fried`, or `cooked` when
the method is unknown.

### Cooking relationship

How an [ingredient](#ingredient) transforms with one [cooking method](#cooking-method). It gives
the [yield](#yield), which says how much water the food loses or absorbs, and often how much of
each nutrient survives ([retention factors](#retention-factor)). This is what turns the public tables' raw values into the nutrition of a dish cooked at home.

### Food Dataset

The open catalogue of [ingredients](#ingredient) behind Pocket Nutrition, kept as YAML files in a Git repository.
Its site is [community.pocketnutrition.org](https://community.pocketnutrition.org).

### Food group

The family an [ingredient](#ingredient) belongs to, for example `meat`, `vegetable` or `cereal`. The
[Food Dataset](#food-dataset) uses 21 of them.

### Ingredient

A canonical food of the [Food Dataset](#food-dataset), for example `chicken_breast` or
`brown_rice`. Each one has a unique ID, a [food group](#food-group) and the states it comes in: raw,
cooked or processed. It is not a [recipe](#recipe), such as chicken basquaise, nor a portion, such as 200 g of grilled chicken: those are built by
combining ingredients.

An ingredient is meant to be cooked with, so each variety that is cooked or eaten differently is
an ingredient of its own: whole grain rice and refined rice, dried apricot and fresh apricot.

### Link to a scientific source

Ties an [ingredient](#ingredient) to the matching entry of a public food table such as Ciqual,
McCance and Widdowson or USDA. The code and the [Food Dataset](#food-dataset) call it a *mapping*.

### Measured state

Whether the weight you entered is the raw weight or the cooked weight. Cooking changes the weight
(see [yield](#yield)), so the same 100 g gives different nutrition in each case.

### Packaged product

A product from Open Food Facts, found by its barcode or in the [search index](#search-index). Its
nutrition comes from its label.

### Recipe

A dish made of [ingredients](#ingredient), each with its weight and
[cooking method](#cooking-method).

### Retention factor

The share of a nutrient that survives cooking, for example 60% of a vitamin. A
[cooking relationship](#cooking-relationship) can give one per nutrient.

### Search index

The Elasticsearch index `product_search`, built by training. The Nutrition API finds
[ingredients](#ingredient), [recipes](#recipe) and [packaged products](#packaged-product) in it,
and reads their reference values from it.

### Ticket

The receipt the recognition server gives for one recording or photo. The app uses it to follow the
job and to delete it. A [worker](#worker) processes the job.

### Vault

An optional server that keeps an end-to-end encrypted copy of your journal. It stores what your
phone encrypted, without the keys to read it.

### Worker

A computer that processes voice and photo jobs: it fetches a job from the recognition server, turns
it into a list of foods, and delivers the result to your [vault](#vault).

### Yield

Cooked weight divided by raw weight. A yield of 0.77 means that 100 g of raw food weighs 77 g once
cooked. Above 1, the food absorbs water, like rice. See [cooking relationship](#cooking-relationship) and
[measured state](#measured-state).
