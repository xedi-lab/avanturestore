import { useState, useCallback, useRef } from 'react'
import ProductCard from './components/ProductCard'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import FilterBar from './components/FilterBar'
import HeroBlock from './components/HeroBlock'
import HotItems from './components/HotItems'
import BrandFilter from './components/BrandFilter'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AdminPage from './components/AdminPage'
import { getProducts, isAdmin } from './services/productStore'
import { getCart, addToCart, getCartCount } from './services/cartStore'
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
  const [products, setProducts] = useState(getProducts)
  const [cart, setCart] = useState(getCart)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [navHidden, setNavHidden] = useState(false)
  const catalogRef = useRef(null)
  const admin = isAdmin()

  const handleLoaded = useCallback(() => setLoaded(true), [])

  const scrollToCatalog = useCallback(() => {
    setTimeout(() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [])

  const handleAddToCart = useCallback((id) => {
    setCart(addToCart(id))
  }, [])

  const resetFilters = () => { setFilter('all'); setBrandFilter(null) }

  const filtered = brandFilter
    ? products.filter(p => p.brand === brandFilter)
    : filter === 'all'
      ? products
      : products.filter(p => p.category === filter)

  // Product detail overlay — shown above current tab
  if (selectedProduct) {
    return (
      <div className={styles.app} style={!loaded ? { visibility: 'hidden' } : {}}>
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onBuy={openTelegramChat}
          onAddToCart={handleAddToCart}
          inCart={cart.some(i => i.id === selectedProduct.id)}
        />
      </div>
    )
  }

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
                <HotItems products={products} onBuy={openTelegramChat} onSelect={setSelectedProduct} />
                <BrandFilter active={brandFilter} onChange={(b) => {
                  setBrandFilter(b); setFilter('all'); scrollToCatalog()
                }} />
                <div ref={catalogRef}>
                  <FilterBar
                    active={brandFilter ? null : filter}
                    onChange={(f) => { setFilter(f); setBrandFilter(null) }}
                  />
                  {(brandFilter || filter !== 'all') && (
                    <div className={styles.filterBadge}>
                      {brandFilter && <span>Бренд: {brandFilter}</span>}
                      <button onClick={resetFilters}>✕ Сбросить</button>
                    </div>
                  )}
                </div>
                <div key={`${filter}-${brandFilter}`} className={styles.grid}>
                  {filtered.length > 0
                    ? filtered.map(p => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onBuy={openTelegramChat}
                          onSelect={setSelectedProduct}
                        />
                      ))
                    : <div className={styles.empty}>Товаров не найдено</div>
                  }
                </div>
              </>
            )}

            {/* ── ПОИСК ── */}
            {tab === 'search' && (
              <SearchPage
                products={products}
                onBuy={openTelegramChat}
                onSelect={setSelectedProduct}
                onKeyboardOpen={setNavHidden}
              />
            )}

            {/* ── КОРЗИНА ── */}
            {tab === 'cart' && (
              <CartPage
                products={products}
                cart={cart}
                onCartChange={setCart}
                onBuy={openTelegramChat}
                onSelect={setSelectedProduct}
              />
            )}

            {/* ── ПРОФИЛЬ ── */}
            {tab === 'profile' && (
              <ProfilePage isAdmin={admin} onProductsChange={(list) => setProducts(list)} />
            )}

            {/* ── ПАНЕЛЬ ── */}
            {tab === 'admin' && admin && (
              <AdminPage onProductsChange={(list) => setProducts(list)} />
            )}

          </div>
        </main>

        {!(tab === 'search' && navHidden) && (
          <BottomNav
            active={tab}
            onChange={(newTab) => { setNavHidden(false); setTab(newTab) }}
            showAdmin={admin}
            cartCount={getCartCount()}
          />
        )}
      </div>
    </>
  )
}
