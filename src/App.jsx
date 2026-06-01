import { useState, useCallback, useRef } from 'react'
import ProductCard from './components/ProductCard'
import BioPage from './components/BioPage'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import FilterBar from './components/FilterBar'
import HeroBlock from './components/HeroBlock'
import UseCaseScroll from './components/UseCaseScroll'
import HotItems from './components/HotItems'
import BrandFilter from './components/BrandFilter'
import SearchBar from './components/SearchBar'
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

function matchesSearch(p, q) {
  const s = q.toLowerCase()
  return (
    p.name?.toLowerCase().includes(s) ||
    p.brand?.toLowerCase().includes(s) ||
    p.category?.toLowerCase().includes(s) ||
    p.description?.toLowerCase().includes(s)
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState('store')
  const [filter, setFilter] = useState('all')
  const [brandFilter, setBrandFilter] = useState(null)
  const [useCaseFilter, setUseCaseFilter] = useState(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState(getProducts)
  const catalogRef = useRef(null)
  const admin = isAdmin()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const scrollToCatalog = useCallback(() => {
    setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [])

  const resetFilters = () => {
    setFilter('all')
    setUseCaseFilter(null)
    setBrandFilter(null)
  }

  // search overrides everything
  const filtered = search.trim()
    ? products.filter(p => matchesSearch(p, search))
    : brandFilter
      ? products.filter(p => p.brand === brandFilter)
      : useCaseFilter
        ? products.filter(p => p.useCases?.includes(useCaseFilter))
        : filter === 'all'
          ? products
          : products.filter(p => p.category === filter)

  const isFiltering = search || brandFilter || useCaseFilter || filter !== 'all'

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
                {/* поиск всегда вверху */}
                <SearchBar value={search} onChange={(v) => {
                  setSearch(v)
                  if (v) { resetFilters(); scrollToCatalog() }
                }} />

                {/* hero и блоки только когда нет поиска */}
                {!search && (
                  <>
                    <HeroBlock onCatalog={scrollToCatalog} onConsult={openConsult} />
                    <UseCaseScroll onSelect={(useCase) => {
                      setUseCaseFilter(useCase)
                      setBrandFilter(null)
                      setFilter('all')
                      scrollToCatalog()
                    }} />
                    <HotItems products={products} onBuy={openTelegramChat} />
                    <BrandFilter active={brandFilter} onChange={(b) => {
                      setBrandFilter(b)
                      setUseCaseFilter(null)
                      setFilter('all')
                      scrollToCatalog()
                    }} />
                  </>
                )}

                {/* каталог */}
                <div ref={catalogRef}>
                  {!search && (
                    <FilterBar
                      active={useCaseFilter || brandFilter ? null : filter}
                      onChange={(f) => { setFilter(f); setUseCaseFilter(null); setBrandFilter(null) }}
                    />
                  )}
                  {isFiltering && !search && (
                    <div className={styles.filterBadge}>
                      {brandFilter && <span>Бренд: {brandFilter}</span>}
                      {useCaseFilter && <span>Подборка по задаче</span>}
                      <button onClick={resetFilters}>✕ Сбросить</button>
                    </div>
                  )}
                </div>

                <div key={`${filter}-${brandFilter}-${useCaseFilter}-${search}`} className={styles.grid}>
                  {filtered.length > 0 ? (
                    filtered.map((p) => (
                      <ProductCard key={p.id} product={p} onBuy={openTelegramChat} />
                    ))
                  ) : (
                    <div className={styles.empty}>
                      {search ? `Ничего не найдено по «${search}»` : 'Товаров не найдено'}
                    </div>
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
