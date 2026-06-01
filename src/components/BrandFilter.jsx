import styles from './BrandFilter.module.css'

const BRANDS = [
  { id: 'Rode',              label: 'Rode' },
  { id: 'Shure',             label: 'Shure' },
  { id: 'Focusrite',         label: 'Focusrite' },
  { id: 'Audio-Technica',    label: 'Audio-Technica' },
  { id: 'AKG',               label: 'AKG' },
  { id: 'Yamaha',            label: 'Yamaha' },
  { id: 'Native Instruments',label: 'Native Instr.' },
]

export default function BrandFilter({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Бренды</div>
      <div className={styles.scroll}>
        {BRANDS.map((b, i) => (
          <button
            key={b.id}
            className={`${styles.chip} ${active === b.id ? styles.active : ''}`}
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => onChange(active === b.id ? null : b.id)}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
