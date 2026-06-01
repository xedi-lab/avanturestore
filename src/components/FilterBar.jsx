import styles from './FilterBar.module.css'

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'Микрофоны', label: 'Микрофоны' },
  { id: 'Звуковые карты', label: 'Звуковые карты' },
  { id: 'Наушники', label: 'Наушники' },
  { id: 'Аксессуары', label: 'Аксессуары' },
]

export default function FilterBar({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`${styles.chip} ${active === f.id ? styles.active : ''}`}
            onClick={() => onChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
