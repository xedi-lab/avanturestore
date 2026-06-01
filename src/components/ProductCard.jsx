import { useState, useRef } from 'react'
import styles from './ProductCard.module.css'

const BADGE = {
  hot:         { label: '🔥 Хит продаж',   card: 'cardHot', ribbon: 'ribbonHot' },
  new:         { label: '🆕 Новинка',       card: 'cardNew', ribbon: 'ribbonNew' },
  low_stock:   { label: '⚡ Осталось мало', card: 'cardLow', ribbon: 'ribbonLow' },
  recommended: { label: '⚡ Топ выбор',     card: 'cardRec', ribbon: 'ribbonRec' },
}

export default function ProductCard({ product, onBuy }) {
  const [pressed, setPressed] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const touchStartX = useRef(null)
  const images = product.images?.length ? product.images : []
  const badge = BADGE[product.badge]

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null || images.length < 2) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 40) return
    setImgIndex(i => dx < 0 ? Math.min(i + 1, images.length - 1) : Math.max(i - 1, 0))
    touchStartX.current = null
  }

  const cardClass = [
    styles.card,
    badge ? styles[badge.card] : '',
    pressed ? styles.pressed : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClass}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <div className={styles.imageWrap} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {images.length > 0 ? (
          <>
            <div
              className={styles.imageTrack}
              style={{ transform: `translateX(-${imgIndex * 100}%)` }}
            >
              {images.map((src, i) => (
                <img key={i} src={src} alt={product.name} className={styles.image} />
              ))}
            </div>
            {images.length > 1 && (
              <div className={styles.dots}>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i === imgIndex ? styles.dotActive : ''}`}
                    onPointerDown={e => { e.stopPropagation(); setImgIndex(i) }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImage}>
            <span className={styles.noImageEmoji}>😔</span>
            <span className={styles.noImageText}>Фото отсутствует</span>
          </div>
        )}

        {!product.inStock && <div className={styles.soldOut}>Нет в наличии</div>}
        <div className={styles.category}>{product.category}</div>

        {/* цветная лента внизу фото */}
        {badge && (
          <div className={`${styles.badgeRibbon} ${styles[badge.ribbon]}`}>
            {badge.label}
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>

        {product.rating && (
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
            <span className={styles.ratingNum}>{product.rating}</span>
            {product.reviews && <span className={styles.reviews}>({product.reviews})</span>}
          </div>
        )}

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
