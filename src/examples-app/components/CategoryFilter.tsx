import { CATEGORIES } from '../data/examples'

interface Props {
  active: string
  onSelect: (id: string) => void
}

const ACTIVE = 'bg-leaf-deep text-paper border-leaf-deep'
const INACTIVE = 'bg-white text-ink border-[rgba(30,43,34,0.18)] hover:border-leaf hover:text-leaf-deep'

export function CategoryFilter({ active, onSelect }: Props) {
  return (
    <div role="group" aria-label="Filter the examples" className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={active === id}
          onClick={() => onSelect(id)}
          className={`min-h-10 px-4 rounded-full border text-sm font-medium cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carrot ${active === id ? ACTIVE : INACTIVE}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
