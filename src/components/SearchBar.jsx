import { useRef } from 'react'
import styles from './SearchBar.module.css'

const HINTS = ['Rode NT1-A', 'Shure SM7B', 'Scarlett 2i2']

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  return (
    <div className={styles.wrap}>
      <div className={styles.bar} onClick={() => inputRef.current?.focus()}>
        <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Поиск по бренду или модели"
        />
        {value && (
          <button className={styles.clear} onClick={() => onChange('')}>×</button>
        )}
      </div>
      {!value && (
        <div className={styles.hints}>
          {HINTS.map(h => (
            <button key={h} className={styles.hint} onClick={() => onChange(h)}>
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
