import { supabase } from './supabaseClient'
import { products as initialProducts } from '../data/products'

const LOCAL_KEY = 'avanture_products'

// ── helpers ──────────────────────────────────────────────────

function fromRow(row) {
  return {
    id:          row.id,
    name:        row.name,
    category:    row.category,
    brand:       row.brand || '',
    price:       row.price,
    images:      row.images || [],
    description: row.description || '',
    inStock:     row.in_stock,
    badge:       row.badge || null,
    rating:      row.rating,
    reviews:     row.reviews,
    useCases:    row.use_cases || [],
  }
}

function toRow(p) {
  return {
    name:        p.name,
    category:    p.category,
    brand:       p.brand || null,
    price:       Number(p.price),
    images:      p.images || [],
    description: p.description || null,
    in_stock:    p.inStock ?? true,
    badge:       p.badge || null,
    rating:      p.rating || null,
    reviews:     p.reviews || null,
    use_cases:   p.useCases || [],
  }
}

// ── local fallback ────────────────────────────────────────────

function localGet() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      return list.map(p => p.images ? p : { ...p, images: p.image ? [p.image] : [] })
    }
  } catch {}
  return initialProducts
}

function localSave(list) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
}

// ── public API ────────────────────────────────────────────────

export function getProducts() {
  return localGet()
}

export async function fetchProducts() {
  if (!supabase) return localGet()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error || !data) return localGet()
  const list = data.map(fromRow)
  localSave(list) // sync to local cache
  return list
}

export async function addProduct(product) {
  if (!supabase) {
    const list = localGet()
    const p = { ...product, id: Date.now(), price: Number(product.price) }
    localSave([...list, p])
    return p
  }
  const { data, error } = await supabase.from('products').insert(toRow(product)).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function updateProduct(id, changes) {
  if (!supabase) {
    const list = localGet().map(p => p.id === id ? { ...p, ...changes, price: Number(changes.price || p.price) } : p)
    localSave(list)
    return list
  }
  const { error } = await supabase.from('products').update(toRow({ ...changes, price: Number(changes.price) })).eq('id', id)
  if (error) throw error
}

export async function deleteProduct(id) {
  if (!supabase) {
    const list = localGet().filter(p => p.id !== id)
    localSave(list)
    return list
  }
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export function saveProducts(list) { localSave(list) }

export function isAdmin() {
  if (!window.Telegram?.WebApp?.initDataUnsafe?.user) return true
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id
  const adminIds = (import.meta.env.VITE_ADMIN_IDS || '')
    .split(',').map(id => Number(id.trim())).filter(Boolean)
  return adminIds.includes(userId)
}
