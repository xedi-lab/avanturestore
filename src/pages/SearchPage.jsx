import { useState, useRef, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import styles from './SearchPage.module.css'

function matchesSearch(p, q) {
  const s = q.toLowerCase()
  return (
    p.name?.toLowerCase().includes(s) ||
    p.brand?.toLowerCase().includes(s) ||
    p.category?.toLowerCase().includes(s) ||
    p.description?.toLowerCase().includes(s)
  )
}

const HINTS = [
  { label: 'Rode NT1-A',    q: 'Rode NT1-A' },
  { label: 'Shure SM7B',    q: 'Shure SM7B' },
  { label: 'Scarlett 2i2',  q: 'Scarlett 2i2' },
  { label: 'Микрофоны',     q: 'Микрофоны' },
  { label: 'Наушники',      q: 'Наушники' },
]

export default function SearchPage({ products, onBuy, onSelect, onKeyboardOpen }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  function handleFocus() { onKeyboardOpen?.(true) }
  function handleBlur()  { onKeyboardOpen?.(false) }

  const results = query.trim() ? products.filter(p => matchesSearch(p, query)) : []

  return (
    <div className={styles.page}>
      <div className={styles.barWrap}>
        <div className={styles.bar}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={styles.icon}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Поиск по бренду или модели"
          />
          {query && (
            <button className={styles.clear} onClick={() => setQuery('')}>×</button>
          )}
        </div>
      </div>

      {!query && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔍</div>
          <p className={styles.emptyTitle}>Найдите нужное оборудование</p>
          <p className={styles.emptyHint}>По названию, бренду или категории</p>
          <div className={styles.hints}>
            {HINTS.map(h => (
              <button key={h.q} className={styles.hint} onClick={() => setQuery(h.q)}>
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div className={styles.noResults}>
          <p className={styles.noResultsTitle}>Ничего не найдено</p>
          <p className={styles.noResultsHint}>Попробуйте другой запрос</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className={styles.count}>{results.length} {results.length === 1 ? 'товар' : results.length < 5 ? 'товара' : 'товаров'}</div>
          <div className={styles.grid}>
            {results.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 50}ms` }} className={styles.cardWrap}>
                <ProductCard product={p} onBuy={onBuy} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
