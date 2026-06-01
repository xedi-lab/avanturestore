import { products as initialProducts } from '../data/products'

const KEY = 'avanture_products'

export function getProducts() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : initialProducts
  } catch {
    return initialProducts
  }
}

export function saveProducts(products) {
  localStorage.setItem(KEY, JSON.stringify(products))
}

export function addProduct(product) {
  const list = getProducts()
  const newProduct = { ...product, id: Date.now() }
  saveProducts([...list, newProduct])
  return newProduct
}

export function updateProduct(id, changes) {
  const list = getProducts()
  const updated = list.map((p) => (p.id === id ? { ...p, ...changes } : p))
  saveProducts(updated)
  return updated
}

export function deleteProduct(id) {
  const list = getProducts().filter((p) => p.id !== id)
  saveProducts(list)
  return list
}

export function isAdmin() {
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user) return true
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id
  const adminIds = (import.meta.env.VITE_ADMIN_IDS || '')
    .split(',')
    .map((id) => Number(id.trim()))
    .filter(Boolean)
  return adminIds.includes(userId)
}
