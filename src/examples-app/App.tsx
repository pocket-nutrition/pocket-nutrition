import { useState } from 'react'
import '../styles/tailwind-tools.css'
import { EXAMPLES } from './data/examples'
import { CategoryFilter } from './components/CategoryFilter'
import { ExampleCard } from './components/ExampleCard'

const GAP_KEY = [
  { label: 'Within 15%', dot: 'bg-leaf' },
  { label: 'Within 30%', dot: 'bg-carrot' },
  { label: 'More than 30%', dot: 'bg-bad' },
]

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all' ? EXAMPLES : EXAMPLES.filter((e) => e.category === activeCategory)

  return (
    <div className="pn-examples text-ink">
      <main className="max-w-(--site-max) mx-auto px-(--site-gutter) pt-16 pb-20">
        <p className="text-xs font-semibold text-leaf uppercase tracking-[0.18em] mb-4">Prediction quality</p>
        <h1 className="font-serif font-medium text-[clamp(2.4rem,4.6vw,3.4rem)] leading-[1.05] tracking-[-0.01em] max-w-[16ch] mb-5">
          How well does Pocket Nutrition predict nutrition?
        </h1>
        <p className="max-w-[58ch] text-[1.06rem] leading-relaxed text-ink-soft mb-6">
          Each card sends a live request to the Nutrition API and compares its answer with reference
          values, mostly from Ciqual 2025. The collection grows as the model improves.
        </p>
        <ul aria-label="Colour key" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft mb-10">
          {GAP_KEY.map(({ label, dot }) => (
            <li key={label} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-full ${dot}`} />
              {label}
            </li>
          ))}
        </ul>

        <CategoryFilter active={activeCategory} onSelect={setActiveCategory} />

        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(min(100%,18.5rem),1fr))]">
          {filtered.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>

        <div className="mt-14 pt-7 border-t border-line flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <p className="max-w-[62ch] text-[0.95rem] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">More examples are added regularly.</strong>{' '}
            Each retraining improves the predictions and widens the collection: more food groups,
            more cooking methods, more dishes.
          </p>
          <a
            href="/calculator"
            className="inline-flex items-center min-h-11 px-5 rounded-full border-[1.5px] border-leaf-deep text-leaf-deep font-semibold no-underline hover:bg-leaf/10 hover:text-leaf-deep"
          >
            Try your own meal
          </a>
        </div>
      </main>
    </div>
  )
}
