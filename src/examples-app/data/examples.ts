import type { ShowcaseExample } from '../types'

// Reference values from Ciqual 2025 (ANSES) — values are per the portion specified in the request.
export const EXAMPLES: ShowcaseExample[] = [
  // ─── Raw ──────────────────────────────────────────────────────────────────
  {
    id: 'raw-chicken-breast',
    title: 'Raw chicken breast',
    description: 'Chicken breast fillet, raw — 100 g',
    category: 'raw',
    request: [{ ingredientId: 'chicken_fillet', quantity: 100, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    reference: { energyKcal: 110, proteinG: 23.0, fatG: 1.5, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'raw-salmon',
    title: 'Raw salmon',
    description: 'Atlantic salmon, raw — 100 g',
    category: 'raw',
    request: [{ ingredientId: 'salmon_fillet', quantity: 100, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    reference: { energyKcal: 208, proteinG: 20.0, fatG: 13.5, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'raw-ground-beef',
    title: 'Raw ground beef 5%',
    description: 'Ground beef 5% fat, raw — 100 g',
    category: 'raw',
    request: [{ ingredientId: 'ground_beef_5pct', quantity: 100, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    reference: { energyKcal: 121, proteinG: 21.4, fatG: 4.4, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },

  {
    id: 'raw-banana',
    title: 'Raw banana',
    description: 'Banana, raw — 1 banana (100 g)',
    category: 'raw',
    request: [{ ingredientId: 'banana', quantity: 100, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 g: 89 kcal, 1.1 g P, 0.3 g F, 22.8 g C
    reference: { energyKcal: 89, proteinG: 1.1, fatG: 0.3, carbohydratesG: 22.8 },
    referenceSource: 'Ciqual 2025',
  },

  // ─── Cooked ───────────────────────────────────────────────────────────────
  {
    id: 'grilled-chicken',
    title: 'Grilled chicken breast',
    description: 'Chicken breast fillet, grilled — 150 g',
    category: 'cooked',
    request: [{ ingredientId: 'chicken_fillet', quantity: 150, unit: 'g', cookingMethod: 'grilled', measuredState: 'cooked' }],
    // Per 100 g cooked: 165 kcal, 31 g P, 3.6 g F, 0 g C  → × 1.5
    reference: { energyKcal: 248, proteinG: 46.5, fatG: 5.4, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'boiled-rice',
    title: 'Boiled white rice',
    description: 'White rice, boiled — 200 g',
    category: 'cooked',
    request: [{ ingredientId: 'rice_white', quantity: 200, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' }],
    // Per 100 g cooked: 130 kcal, 2.7 g P, 0.3 g F, 28 g C  → × 2
    reference: { energyKcal: 260, proteinG: 5.4, fatG: 0.6, carbohydratesG: 56 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'grilled-salmon',
    title: 'Grilled salmon',
    description: 'Atlantic salmon, grilled — 150 g',
    category: 'cooked',
    request: [{ ingredientId: 'salmon_fillet', quantity: 150, unit: 'g', cookingMethod: 'grilled', measuredState: 'cooked' }],
    // Per 100 g cooked: 206 kcal, 23 g P, 12 g F, 0 g C  → × 1.5
    reference: { energyKcal: 309, proteinG: 34.5, fatG: 18, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'boiled-carrot',
    title: 'Boiled carrot',
    description: 'Carrot, boiled — 150 g',
    category: 'cooked',
    request: [{ ingredientId: 'carrot', quantity: 150, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' }],
    // Per 100 g cooked: 37 kcal, 0.8 g P, 0.2 g F, 7.6 g C  → × 1.5
    reference: { energyKcal: 56, proteinG: 1.2, fatG: 0.3, carbohydratesG: 11.4 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'roasted-turkey',
    title: 'Roasted turkey breast',
    description: 'Turkey breast, roasted — 150 g',
    category: 'cooked',
    request: [{ ingredientId: 'turkey_fillet', quantity: 150, unit: 'g', cookingMethod: 'roasted', measuredState: 'cooked' }],
    // Per 100 g cooked: 153 kcal, 30 g P, 3.2 g F, 0 g C  → × 1.5
    reference: { energyKcal: 230, proteinG: 45, fatG: 4.8, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },

  // ─── Vegetables ───────────────────────────────────────────────────────────
  {
    id: 'steamed-broccoli',
    title: 'Steamed broccoli',
    description: 'Broccoli, steamed — 200 g',
    category: 'vegetable',
    request: [{ ingredientId: 'broccoli', quantity: 200, unit: 'g', cookingMethod: 'steamed', measuredState: 'cooked' }],
    // Per 100 g cooked: 35 kcal, 2.4 g P, 0.4 g F, 4.5 g C  → × 2
    reference: { energyKcal: 70, proteinG: 4.8, fatG: 0.8, carbohydratesG: 9 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'steamed-spinach',
    title: 'Steamed spinach',
    description: 'Spinach, steamed — 150 g',
    category: 'vegetable',
    request: [{ ingredientId: 'spinach', quantity: 150, unit: 'g', cookingMethod: 'steamed', measuredState: 'cooked' }],
    // Per 100 g cooked: 23 kcal, 3 g P, 0.4 g F, 1.3 g C  → × 1.5
    reference: { energyKcal: 35, proteinG: 4.5, fatG: 0.6, carbohydratesG: 2 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'boiled-green-beans',
    title: 'Boiled green beans',
    description: 'Green beans, boiled — 150 g',
    category: 'vegetable',
    request: [{ ingredientId: 'green_beans', quantity: 150, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' }],
    // Per 100 g cooked: 35 kcal, 1.9 g P, 0.2 g F, 5.5 g C  → × 1.5
    reference: { energyKcal: 53, proteinG: 2.9, fatG: 0.3, carbohydratesG: 8.3 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'raw-carrot',
    title: 'Raw carrot',
    description: 'Carrot, raw — 100 g',
    category: 'vegetable',
    request: [{ ingredientId: 'carrot', quantity: 100, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    reference: { energyKcal: 41, proteinG: 0.9, fatG: 0.2, carbohydratesG: 8.5 },
    referenceSource: 'Ciqual 2025',
  },

  // ─── Complex dishes ───────────────────────────────────────────────────────
  {
    id: 'lasagna',
    title: 'Bolognese lasagna',
    description: 'Lasagna with bolognese sauce — ~380 g serving',
    category: 'dish',
    request: [
      { ingredientId: 'pasta', quantity: 120, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' },
      { ingredientId: 'ground_beef_5pct', quantity: 100, unit: 'g', cookingMethod: 'cooked', measuredState: 'cooked' },
      { ingredientId: 'tomato_sauce', quantity: 80, unit: 'g', cookingMethod: 'cooked', measuredState: 'cooked' },
      { ingredientId: 'semi_skimmed_milk', quantity: 80, unit: 'ml', cookingMethod: 'raw', measuredState: 'raw' },
    ],
    reference: { energyKcal: 490, proteinG: 28, fatG: 18, carbohydratesG: 50 },
    referenceSource: 'ANSES estimate',
  },
  {
    id: 'chicken-couscous',
    title: 'Chicken couscous',
    description: 'Chicken couscous with vegetables — ~440 g serving',
    category: 'dish',
    request: [
      { ingredientId: 'chicken_thigh', quantity: 150, unit: 'g', cookingMethod: 'cooked', measuredState: 'cooked' },
      { ingredientId: 'semolina_couscous', quantity: 150, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' },
      { ingredientId: 'zucchini', quantity: 90, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' },
      { ingredientId: 'chickpea', quantity: 50, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' },
    ],
    reference: { energyKcal: 560, proteinG: 38, fatG: 13, carbohydratesG: 68 },
    referenceSource: 'ANSES estimate',
  },
  {
    id: 'chicken-rice',
    title: 'Chicken with rice',
    description: 'Grilled chicken with boiled rice — 350 g plate',
    category: 'dish',
    request: [
      { ingredientId: 'chicken_fillet', quantity: 150, unit: 'g', cookingMethod: 'grilled', measuredState: 'cooked' },
      { ingredientId: 'rice_white', quantity: 200, unit: 'g', cookingMethod: 'boiled', measuredState: 'cooked' },
    ],
    // Sum of grilled chicken 150 g + boiled rice 200 g
    reference: { energyKcal: 508, proteinG: 51.9, fatG: 6, carbohydratesG: 56 },
    referenceSource: 'Ciqual 2025 (sum)',
  },

  // ─── Wine & Spirits ───────────────────────────────────────────────────────
  {
    id: 'red-wine',
    title: 'Red wine',
    description: 'Red wine — 150 ml glass',
    category: 'wine_spirit',
    request: [{ ingredientId: 'red_wine', quantity: 150, unit: 'ml', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 ml: 68 kcal, 0.1 g P, 0 g F, 0.2 g C  → × 1.5
    reference: { energyKcal: 102, proteinG: 0.2, fatG: 0, carbohydratesG: 0.3 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'blonde-beer',
    title: 'Lager beer',
    description: 'Lager beer — 250 ml',
    category: 'wine_spirit',
    request: [{ ingredientId: 'beer', quantity: 250, unit: 'ml', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 ml: 44 kcal, 0.4 g P, 0 g F, 3.4 g C  → × 2.5
    reference: { energyKcal: 110, proteinG: 1.0, fatG: 0, carbohydratesG: 8.5 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'whisky',
    title: 'Whisky',
    description: 'Whisky — 40 ml measure',
    category: 'wine_spirit',
    request: [{ ingredientId: 'whisky', quantity: 40, unit: 'ml', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 ml: 232 kcal, 0 g P, 0 g F, 0 g C  → × 0.4
    reference: { energyKcal: 93, proteinG: 0, fatG: 0, carbohydratesG: 0 },
    referenceSource: 'Ciqual 2025',
  },

  // ─── Industrial ───────────────────────────────────────────────────────────
  {
    id: 'fine-semolina-raw',
    title: 'Raw fine semolina',
    description: 'Fine semolina, dry — 33 g (weighed before cooking)',
    category: 'industrial',
    request: [{ ingredientId: 'semolina', quantity: 33, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 g dry: 360 kcal, 12 g P, 1.5 g F, 74 g C  → × 0.33
    reference: { energyKcal: 119, proteinG: 4.0, fatG: 0.5, carbohydratesG: 24.4 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'dried-raisins',
    title: 'Dried raisins',
    description: 'Dried raisins — 30 g (one handful)',
    category: 'industrial',
    request: [{ ingredientId: 'dried_raisin', quantity: 30, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 g: 299 kcal, 2.5 g P, 0.4 g F, 70 g C  → × 0.3
    reference: { energyKcal: 90, proteinG: 0.8, fatG: 0.1, carbohydratesG: 21.0 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'plain-yoghurt',
    title: 'Plain yoghurt',
    description: 'Plain whole-milk yoghurt — 125 g pot',
    category: 'industrial',
    request: [{ ingredientId: 'yogurt', quantity: 125, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 g: 63 kcal, 3.8 g P, 3.5 g F, 4.5 g C  → × 1.25
    reference: { energyKcal: 79, proteinG: 4.8, fatG: 4.4, carbohydratesG: 5.6 },
    referenceSource: 'Ciqual 2025',
  },
  {
    id: 'cornflakes',
    title: 'Plain cornflakes',
    description: 'Plain cornflakes — 30 g serving',
    category: 'industrial',
    request: [{ ingredientId: 'corn_flake', quantity: 30, unit: 'g', cookingMethod: 'raw', measuredState: 'raw' }],
    // Per 100 g: 376 kcal, 7 g P, 1 g F, 84 g C  → × 0.3
    reference: { energyKcal: 113, proteinG: 2.1, fatG: 0.3, carbohydratesG: 25.2 },
    referenceSource: 'Ciqual 2025',
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'raw', label: 'Raw' },
  { id: 'cooked', label: 'Cooked' },
  { id: 'dish', label: 'Complex dishes' },
  { id: 'vegetable', label: 'Vegetables' },
  { id: 'wine_spirit', label: 'Wine & spirits' },
  { id: 'industrial', label: 'Packaged' },
] as const
