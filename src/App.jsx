import { useState, useCallback, useRef } from 'react'
import ProductCard from './components/ProductCard'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import FilterBar from './components/FilterBar'
import HeroBlock from './components/HeroBlock'
import UseCaseScroll from './components/UseCaseScroll'
import HotItems from './components/HotItems'
import BrandFilter from './components/BrandFilter'
import ConsultantFAB from './components/ConsultantFAB'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
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
  const [brandFilter, setBrandFilter] = useState(null)
  const [useCaseFilter, setUseCaseFilter] = useState(null)
  const [products, setProducts] = useState(getProducts)
  const catalogRef = useRef(null)
  const admin = isAdmin()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const scrollToCatalog = useCallback(() => {
    setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [])

  const resetFilters = () => { setFilter('all'); setUseCaseFilter(null); setBrandFilter(null) }

  const filtered = brandFilter
    ? products.filter(p => p.brand === brandFilter)
    : useCaseFilter
      ? products.filter(p => p.useCases?.includes(useCaseFilter))
      : filter === 'all'
        ? products
        : products.filter(p => p.category === filter)

  const isFiltering = brandFilter || useCaseFilter || filter !== 'all'

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

            {/* ── ГЛАВНАЯ ── */}
            {tab === 'store' && (
              <>
                <HeroBlock onCatalog={scrollToCatalog} onConsult={openConsult} />
                <UseCaseScroll onSelect={(useCase) => {
                  setUseCaseFilter(useCase); setBrandFilter(null); setFilter('all'); scrollToCatalog()
                }} />
                <HotItems products={products} onBuy={openTelegramChat} />
                <BrandFilter active={brandFilter} onChange={(b) => {
                  setBrandFilter(b); setUseCaseFilter(null); setFilter('all'); scrollToCatalog()
                }} />

                <div ref={catalogRef}>
                  <FilterBar
                    active={useCaseFilter || brandFilter ? null : filter}
                    onChange={(f) => { setFilter(f); setUseCaseFilter(null); setBrandFilter(null) }}
                  />
                  {isFiltering && (
                    <div className={styles.filterBadge}>
                      {brandFilter && <span>Бренд: {brandFilter}</span>}
                      {useCaseFilter && <span>Подборка по задаче</span>}
                      <button onClick={resetFilters}>✕ Сбросить</button>
                    </div>
                  )}
                </div>

                <div key={`${filter}-${brandFilter}-${useCaseFilter}`} className={styles.grid}>
                  {filtered.length > 0
                    ? filtered.map(p => <ProductCard key={p.id} product={p} onBuy={openTelegramChat} />)
                    : <div className={styles.empty}>Товаров не найдено</div>
                  }
                </div>
              </>
            )}

            {/* ── ПОИСК ── */}
            {tab === 'search' && (
              <SearchPage products={products} onBuy={openTelegramChat} />
            )}

            {/* ── ПРОФИЛЬ ── */}
            {tab === 'profile' && (
              <ProfilePage
                isAdmin={admin}
                onProductsChange={(list) => setProducts(list)}
              />
            )}

          </div>
        </main>

        <ConsultantFAB onClick={openConsult} />
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </>
  )
}
