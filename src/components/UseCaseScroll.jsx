import styles from './UseCaseScroll.module.css'

const CASES = [
  { id: 'vocal',        emoji: '🎤', label: 'Для вокала' },
  { id: 'streaming',    emoji: '🎮', label: 'Для стриминга' },
  { id: 'mixing',       emoji: '🎧', label: 'Для сведения' },
  { id: 'podcast',      emoji: '🎙', label: 'Для подкастов' },
  { id: 'home-studio',  emoji: '🎸', label: 'Домашняя студия' },
]

export default function UseCaseScroll({ onSelect }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Подобрать по задаче</div>
      <div className={styles.scroll}>
        {CASES.map((c, i) => (
          <button
            key={c.id}
            className={styles.card}
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => onSelect(c.id)}
          >
            <span className={styles.emoji}>{c.emoji}</span>
            <span className={styles.label}>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
