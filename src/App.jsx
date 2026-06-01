import { useState, useCallback, useRef } from 'react'
import ProductCard from './components/ProductCard'
import BioPage from './components/BioPage'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import FilterBar from './components/FilterBar'
import HeroBlock from './components/HeroBlock'
import UseCaseScroll from './components/UseCaseScroll'
import HotItems from './components/HotItems'
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

function openConsult() {
  const text = encodeURIComponent('Здравствуйте! Хочу подобрать оборудование, нужна помощь консультанта.')
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
  const [useCaseFilter, setUseCaseFilter] = useState(null)
  const [products, setProducts] = useState(getProducts)
  const catalogRef = useRef(null)
  const admin = isAdmin()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const scrollToCatalog = useCallback(() => {
    setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [])

  const filtered = useCaseFilter
    ? products.filter(p => p.useCases?.includes(useCaseFilter))
    : filter === 'all'
      ? products
      : products.filter(p => p.category === filter)

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleLoaded} />}
      <div className={styles.app} style={!loaded ? { visibility: 'hidden' } : {}}>
        <header className={styles.header}>
          <span className={styles.logo}>Avanture</span>
          <span className={styles.logoAccent}>Store</span>
        </header>

        <main className={styles.main}>
          <div key={tab} className={styles.tabContent}>
            {tab === 'store' && (
              <>
                <HeroBlock onCatalog={scrollToCatalog} onConsult={openConsult} />
                <UseCaseScroll onSelect={(useCase) => {
                  setUseCaseFilter(useCase)
                  setFilter('all')
                  scrollToCatalog()
                }} />
                <HotItems products={products} onBuy={openTelegramChat} />
                <div ref={catalogRef} style={{ paddingTop: 8 }}>
                  <FilterBar active={useCaseFilter ? null : filter} onChange={(f) => { setFilter(f); setUseCaseFilter(null) }} useCaseActive={useCaseFilter} />
                </div>
                <div key={filter} className={styles.grid}>
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
          </div>
        </main>

        <BottomNav active={tab} onChange={setTab} showAdmin={admin} />
      </div>
    </>
  )
}
