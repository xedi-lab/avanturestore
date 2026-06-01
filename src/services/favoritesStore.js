const KEY = 'avanture_favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
}

export function toggleFavorite(id) {
  const list = getFavorites()
  const next = list.includes(id) ? list.filter(i => i !== id) : [...list, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function isFavorite(id) {
  return getFavorites().includes(id)
}
