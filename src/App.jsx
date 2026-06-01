import { useState } from 'react'
import ProductCard from './components/ProductCard'
import BioPage from './components/BioPage'
import BottomNav from './components/BottomNav'
import { products } from './data/products'
import styles from './App.module.css'

function openTelegramChat(product) {
  const text = encodeURIComponent(
    `Здравствуйте! Меня заинтересовал товар:\n\n*${product.name}*\nЦена: ${product.price.toLocaleString('ru-RU')} ₽\n\nМожно подробнее?`
  )
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/avanture_store?text=${text}`)
  } else {
    window.open(`https://t.me/avanture_store?text=${text}`, '_blank')
  }
}

export default function App() {
  const [tab, setTab] = useState('store')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Avanture</span>
        <span className={styles.logoAccent}>Store</span>
      </header>

      <main className={styles.main}>
        {tab === 'store' && (
          <div className={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onBuy={openTelegramChat} />
            ))}
          </div>
        )}
        {tab === 'bio' && <BioPage />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
