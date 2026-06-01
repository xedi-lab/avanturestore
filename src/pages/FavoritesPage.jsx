import ProductCard from '../components/ProductCard'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage({ products, favorites, onBuy, onToggleFavorite }) {
  const favProducts = products.filter(p => favorites.includes(p.id))

  if (favProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>❤️</div>
        <p className={styles.emptyTitle}>Избранное пусто</p>
        <p className={styles.emptyHint}>Нажмите ❤️ на карточке товара, чтобы добавить</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.title}>Избранное</span>
        <span className={styles.count}>{favProducts.length}</span>
      </div>
      <div className={styles.grid}>
        {favProducts.map((p, i) => (
          <div key={p.id} className={styles.cardWrap} style={{ animationDelay: `${i * 50}ms` }}>
            <ProductCard
              product={p}
              onBuy={onBuy}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
