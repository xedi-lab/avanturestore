import { useState, useRef } from 'react'
import styles from './ProductDetailPage.module.css'

const BADGE_MAP = {
  hot:         { label: '🔥 Хит продаж',   color: '#ff4d00' },
  new:         { label: '🆕 Новинка',       color: '#2563eb' },
  low_stock:   { label: '⚡ Осталось мало', color: '#d97706' },
  recommended: { label: '⚡ Топ выбор',     color: '#2563eb' },
}

export default function ProductDetailPage({ product, onBack, onBuy, onAddToCart, inCart }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(inCart)
  const touchStartX = useRef(null)
  const images = product.images?.length ? product.images : []
  const badge = BADGE_MAP[product.badge]

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchStartX.current === null || images.length < 2) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 40) return
    setImgIndex(i => dx < 0 ? Math.min(i + 1, images.length - 1) : Math.max(i - 1, 0))
    touchStartX.current = null
  }

  function handleAddToCart() {
    setAdded(true)
    onAddToCart(product.id)
  }

  return (
    <div className={styles.page}>
      {/* Back */}
      <button className={styles.backBtn} onClick={onBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Назад
      </button>

      {/* Gallery */}
      <div className={styles.gallery} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {images.length > 0 ? (
          <>
            <div className={styles.track} style={{ transform: `translateX(-${imgIndex * 100}%)` }}>
              {images.map((src, i) => (
                <img key={i} src={src} alt={product.name} className={styles.galleryImg} />
              ))}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbRow}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === imgIndex ? styles.thumbActive : ''}`}
                    onClick={() => setImgIndex(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.noImg}>
            <span>😔</span><span>Фото отсутствует</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.topLine}>
          <span className={styles.category}>{product.category}</span>
          {product.brand && <span className={styles.brand}>{product.brand}</span>}
          {badge && (
            <span className={styles.badgePill} style={{ background: badge.color }}>
              {badge.label}
            </span>
          )}
        </div>

        <h1 className={styles.name}>{product.name}</h1>

        {product.rating && (
          <div className={styles.ratingRow}>
            <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
            <span className={styles.ratingNum}>{product.rating}</span>
            {product.reviews && <span className={styles.reviews}>{product.reviews} отзывов</span>}
          </div>
        )}

        <div className={styles.price}>
          {product.price.toLocaleString('ru-RU')} ₽
        </div>

        {!product.inStock && (
          <div className={styles.outStock}>Нет в наличии</div>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Описание</h2>
          <p className={styles.description}>{product.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={`${styles.cartBtn} ${added ? styles.cartBtnAdded : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {added ? '✓ В корзине' : '🛒 В корзину'}
        </button>
        <button
          className={styles.buyBtn}
          onClick={() => onBuy(product)}
          disabled={!product.inStock}
        >
          Купить сейчас
        </button>
      </div>
    </div>
  )
}
