import styles from './CartPage.module.css'
import { removeFromCart } from '../services/cartStore'

export default function CartPage({ products, cart, onCartChange, onBuy, onSelect }) {
  const cartProducts = cart
    .map(item => ({ ...products.find(p => p.id === item.id), qty: item.qty }))
    .filter(Boolean)

  const total = cartProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

  function handleRemove(id) { onCartChange(removeFromCart(id)) }

  function handleBuyAll() {
    const names = cartProducts.map(p => `• ${p.name} — ${p.price.toLocaleString('ru-RU')} ₽`).join('\n')
    const text = encodeURIComponent(`Здравствуйте! Хочу заказать:\n\n${names}\n\nИтого: ${total.toLocaleString('ru-RU')} ₽`)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/avanturestorebot?text=${text}`)
    } else {
      window.open(`https://t.me/avanturestorebot?text=${text}`, '_blank')
    }
  }

  if (cartProducts.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <p className={styles.emptyTitle}>Корзина пуста</p>
        <p className={styles.emptyHint}>Добавляйте товары из каталога</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.title}>Корзина</span>
        <span className={styles.count}>{cartProducts.length}</span>
      </div>

      <div className={styles.list}>
        {cartProducts.map(p => (
          <div key={p.id} className={styles.row} onClick={() => onSelect(p)}>
            {p.images?.[0]
              ? <img src={p.images[0]} alt={p.name} className={styles.thumb} />
              : <div className={styles.thumbEmpty}>😔</div>
            }
            <div className={styles.rowText}>
              <div className={styles.rowName}>{p.name}</div>
              <div className={styles.rowPrice}>{p.price.toLocaleString('ru-RU')} ₽</div>
              {p.qty > 1 && <div className={styles.rowQty}>× {p.qty}</div>}
            </div>
            <button
              className={styles.removeBtn}
              onClick={e => { e.stopPropagation(); handleRemove(p.id) }}
            >✕</button>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.totalRow}>
          <span>Итого</span>
          <span className={styles.totalPrice}>{total.toLocaleString('ru-RU')} ₽</span>
        </div>
        <button className={styles.checkoutBtn} onClick={handleBuyAll}>
          Оформить заказ
        </button>
      </div>
    </div>
  )
}
