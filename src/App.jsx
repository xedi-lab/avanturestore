import { useState, useCallback } from 'react'
import ProductCard from './components/ProductCard'
import BioPage from './components/BioPage'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import FilterBar from './components/FilterBar'
import AdminPage from './components/AdminPage'
import { getProducts, isAdmin } from './services/productStore'
import styles from './App.module.css'

function openTelegramChat(product) {
  const text = encodeURIComponent(
    `Здравствуйте! Меня заинтересовал товар:\n\n*${product.name}*\nЦена: ${product.price.toLocaleString('ru-RU')} ₽\n\nМожно подробнее?`
  )
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/avanturestorebot?text=${text}`)
  } else {
    window.open(`https://t.me/avanturestorebot?text=${text}`, '_blank')
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState('store')
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState(getProducts)
  const admin = isAdmin()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const filtered = filter === 'all'
    ? products
    : products.filter((p) => p.category === filter)

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleLoaded} />}
      <div className={styles.app} style={!loaded ? { visibility: 'hidden' } : {}}>
        <header className={styles.header}>
          <span className={styles.logo}>Avanture</span>
          <span className={styles.logoAccent}>Store</span>
        </header>

        <main className={styles.main}>
          {tab === 'store' && (
            <>
              <FilterBar active={filter} onChange={setFilter} />
              <div className={styles.grid}>
                {filtered.length > 0 ? (
                  filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onBuy={openTelegramChat} />
                  ))
                ) : (
                  <div className={styles.empty}>Товаров не найдено</div>
                )}
              </div>
            </>
          )}
          {tab === 'bio' && <BioPage />}
          {tab === 'admin' && admin && (
            <AdminPage onProductsChange={(list) => setProducts(list)} />
          )}
        </main>

        <BottomNav active={tab} onChange={setTab} showAdmin={admin} />
      </div>
    </>
  )
}
