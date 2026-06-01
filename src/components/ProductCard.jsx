import { useState } from 'react'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onBuy }) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className={`${styles.card} ${pressed ? styles.pressed : ''}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <div className={styles.imageWrap}>
        {product.image ? (
          <img src={product.image} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.noImage}>
            <span className={styles.noImageEmoji}>😔</span>
            <span className={styles.noImageText}>Фото отсутствует</span>
          </div>
        )}
        {!product.inStock && <div className={styles.soldOut}>Нет в наличии</div>}
        <div className={styles.category}>{product.category}</div>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
          <button
            className={`${styles.buyBtn} ${!product.inStock ? styles.disabled : ''}`}
            onClick={() => product.inStock && onBuy(product)}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Купить' : 'Нет в наличии'}
          </button>
        </div>
      </div>
    </div>
  )
}
