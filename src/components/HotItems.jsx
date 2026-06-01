import ProductCard from './ProductCard'
import styles from './HotItems.module.css'

export default function HotItems({ products, onBuy }) {
  const hot = products
    .filter(p => p.badge === 'hot' || p.badge === 'recommended')
    .slice(0, 4)

  if (!hot.length) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Хиты продаж</span>
        <span className={styles.fire}>🔥</span>
      </div>
      <div className={styles.grid}>
        {hot.map((p, i) => (
          <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className={styles.cardWrap}>
            <ProductCard product={p} onBuy={onBuy} isHot />
          </div>
        ))}
      </div>
    </div>
  )
}
