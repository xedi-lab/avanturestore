import { useState } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productStore'
import styles from './AdminPage.module.css'

const EMPTY_FORM = { name: '', category: 'Микрофоны', price: '', image: '', description: '', inStock: true }
const CATEGORIES = ['Микрофоны', 'Звуковые карты', 'Наушники', 'Аксессуары']

export default function AdminPage({ onProductsChange }) {
  const [section, setSection] = useState('products') // products | warmup
  const [products, setProducts] = useState(getProducts)
  const [editing, setEditing] = useState(null) // null | 'new' | product object
  const [form, setForm] = useState(EMPTY_FORM)
  const [warmupMsg, setWarmupMsg] = useState('')
  const [chatId, setChatId] = useState(import.meta.env.VITE_WARMUP_CHAT_ID || '')
  const [warmupStatus, setWarmupStatus] = useState(null) // null | 'sending' | 'ok' | 'error'

  function sync(list) {
    setProducts(list)
    onProductsChange?.(list)
  }

  function openNew() {
    setForm(EMPTY_FORM)
    setEditing('new')
  }

  function openEdit(product) {
    setForm({ ...product })
    setEditing(product)
  }

  function handleDelete(id) {
    if (!confirm('Удалить товар?')) return
    sync(deleteProduct(id))
  }

  function handleSave() {
    if (!form.name || !form.price) return
    const payload = { ...form, price: Number(form.price) }
    if (editing === 'new') {
      addProduct(payload)
    } else {
      updateProduct(editing.id, payload)
    }
    sync(getProducts())
    setEditing(null)
  }

  async function handleWarmup() {
    if (!warmupMsg.trim() || !chatId.trim()) return
    setWarmupStatus('sending')
    try {
      const res = await fetch('/api/warmup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: warmupMsg, chatId }),
      })
      setWarmupStatus(res.ok ? 'ok' : 'error')
    } catch {
      setWarmupStatus('error')
    }
    setTimeout(() => setWarmupStatus(null), 3000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        <button className={`${styles.segTab} ${section === 'products' ? styles.segActive : ''}`} onClick={() => setSection('products')}>Товары</button>
        <button className={`${styles.segTab} ${section === 'warmup' ? styles.segActive : ''}`} onClick={() => setSection('warmup')}>Прогрев</button>
      </div>

      {section === 'products' && (
        <>
          <button className={styles.addBtn} onClick={openNew}>+ Добавить товар</button>

          {editing && (
            <div className={styles.card}>
              <h3 className={styles.formTitle}>{editing === 'new' ? 'Новый товар' : 'Редактировать'}</h3>
              <div className={styles.fields}>
                <input className={styles.input} placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <select className={styles.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className={styles.input} placeholder="Цена (₽)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className={styles.input} placeholder="URL фото (необязательно)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <label className={styles.checkRow}>
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                  <span>В наличии</span>
                </label>
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Отмена</button>
                <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
              </div>
            </div>
          )}

          <div className={styles.productList}>
            {products.map((p) => (
              <div key={p.id} className={styles.productRow}>
                <div className={styles.productInfo}>
                  {p.image
                    ? <img src={p.image} alt={p.name} className={styles.thumb} />
                    : <div className={styles.thumbEmpty}>😔</div>
                  }
                  <div>
                    <div className={styles.productName}>{p.name}</div>
                    <div className={styles.productMeta}>{p.category} · {p.price.toLocaleString('ru-RU')} ₽ · {p.inStock ? '✓ В наличии' : '✗ Нет'}</div>
                  </div>
                </div>
                <div className={styles.rowActions}>
                  <button className={styles.editBtn} onClick={() => openEdit(p)}>✏️</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {section === 'warmup' && (
        <div className={styles.warmupSection}>
          <div className={styles.card}>
            <h3 className={styles.formTitle}>Сообщение для прогрева</h3>
            <p className={styles.warmupHint}>Введите ID канала или чата (например: @mychannel или -1001234567890). Бот должен быть администратором канала.</p>
            <div className={styles.fields}>
              <input className={styles.input} placeholder="ID чата / канала" value={chatId} onChange={(e) => setChatId(e.target.value)} />
              <textarea
                className={`${styles.input} ${styles.textarea} ${styles.warmupTextarea}`}
                placeholder="Текст сообщения. Поддерживается HTML: <b>жирный</b>, <i>курсив</i>"
                value={warmupMsg}
                onChange={(e) => setWarmupMsg(e.target.value)}
              />
            </div>
            <button
              className={`${styles.saveBtn} ${warmupStatus === 'sending' ? styles.sending : ''}`}
              onClick={handleWarmup}
              disabled={warmupStatus === 'sending'}
            >
              {warmupStatus === 'sending' ? 'Отправка...' : warmupStatus === 'ok' ? '✓ Отправлено!' : warmupStatus === 'error' ? '✗ Ошибка' : 'Отправить'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
