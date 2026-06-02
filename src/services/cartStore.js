const KEY = 'avanture_cart'

export function getCart() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function addToCart(id) {
  const cart = getCart()
  const exists = cart.find(i => i.id === id)
  const next = exists
    ? cart.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
    : [...cart, { id, qty: 1 }]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function removeFromCart(id) {
  const next = getCart().filter(i => i.id !== id)
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0)
}

export function isInCart(id) {
  return getCart().some(i => i.id === id)
}
