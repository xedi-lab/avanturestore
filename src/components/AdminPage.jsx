import { useState } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productStore'
import styles from './AdminPage.module.css'

const CATEGORIES = ['Микрофоны', 'Звуковые карты', 'Наушники', 'Аксессуары']
const EMPTY_FORM = { name: '', category: 'Микрофоны', price: '', images: [], description: '', inStock: true }

export default function AdminPage({ onProductsChange }) {
  const [tab, setTab] = useState('catalog')
  const [products, setProducts] = useState(getProducts)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imgInput, setImgInput] = useState('')
  const [warmupMsg, setWarmupMsg] = useState('')
  const [chatId, setChatId] = useState(import.meta.env.VITE_WARMUP_CHAT_ID || '')
  const [warmupStatus, setWarmupStatus] = useState(null)

  function sync(list) { setProducts(list); onProductsChange?.(list) }

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setImgInput('')
    setTab('form')
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({ ...p, images: [...(p.images || [])] })
    setImgInput('')
    setTab('form')
  }

  function handleDelete(id) {
    if (!confirm('Удалить товар?')) return
    sync(deleteProduct(id))
  }

  function addImage() {
    const url = imgInput.trim()
    if (!url) return
    setForm((f) => ({ ...f, images: [...f.images, url] }))
    setImgInput('')
  }

  function removeImage(i) {
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  function handleSave() {
    if (!form.name.trim() || !form.price) return
    const payload = { ...form, price: Number(form.price) }
    if (editTarget) updateProduct(editTarget.id, payload)
    else addProduct(payload)
    sync(getProducts())
    setTab('catalog')
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
    } catch { setWarmupStatus('error') }
    setTimeout(() => setWarmupStatus(null), 3000)
  }

  return (
    <div className={styles.page}>

      {/* Top nav */}
      <div className={styles.topNav}>
        <button className={`${styles.navBtn} ${tab === 'catalog' ? styles.navActive : ''}`} onClick={() => setTab('catalog')}>
          <span className={styles.navIcon}>📦</span>
          <span>Каталог</span>
        </button>
        <button className={`${styles.navBtn} ${tab === 'form' ? styles.navActive : ''}`} onClick={openAdd}>
          <span className={styles.navIcon}>＋</span>
          <span>Добавить</span>
        </button>
        <button className={`${styles.navBtn} ${tab === 'warmup' ? styles.navActive : ''}`} onClick={() => setTab('warmup')}>
          <span className={styles.navIcon}>🔥</span>
          <span>Прогрев</span>
        </button>
      </div>

      {/* ─── КАТАЛОГ ─── */}
      {tab === 'catalog' && (
        <div className={styles.catalog}>
          {products.length === 0 && (
            <div className={styles.empty}>
              <p>Товаров пока нет</p>
              <button className={styles.primaryBtn} onClick={openAdd}>Добавить первый</button>
            </div>
          )}
          {products.map((p) => (
            <div key={p.id} className={styles.row}>
              {p.images?.[0]
                ? <img src={p.images[0]} alt={p.name} className={styles.thumb} />
                : <div className={styles.thumbEmpty}>😔</div>
              }
              <div className={styles.rowText}>
                <div className={styles.rowName}>{p.name}</div>
                <div className={styles.rowMeta}>
                  {p.category} · {p.price.toLocaleString('ru-RU')} ₽
                </div>
                <div className={`${styles.rowStock} ${p.inStock ? styles.inStock : styles.outStock}`}>
                  {p.inStock ? '● В наличии' : '● Нет в наличии'}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button className={styles.iconBtn} onClick={() => openEdit(p)}>✏️</button>
                <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => handleDelete(p.id)}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── ФОРМА ─── */}
      {tab === 'form' && (
        <div className={styles.formPage}>
          <div className={styles.formHeader}>
            <button className={styles.backBtn} onClick={() => setTab('catalog')}>← Назад</button>
            <h2 className={styles.formTitle}>{editTarget ? 'Редактировать' : 'Новый товар'}</h2>
          </div>

          {/* Фото */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Фотографии</div>
            <div className={styles.imageGrid}>
              {form.images.map((url, i) => (
                <div key={i} className={styles.imageThumbWrap}>
                  <img src={url} alt="" className={styles.imageThumb} />
                  <button className={styles.removeImg} onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
              <div className={styles.imgInputWrap}>
                <input
                  className={styles.imgUrlInput}
                  placeholder="Вставь URL фото..."
                  value={imgInput}
                  onChange={(e) => setImgInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                />
                <button className={styles.addImgBtn} onClick={addImage}>＋</button>
              </div>
            </div>
            <p className={styles.hint}>Загрузи фото на imgbb.com или imgur.com и вставь ссылку</p>
          </div>

          {/* Основное */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Основное</div>
            <div className={styles.fields}>
              <input
                className={styles.input}
                placeholder="Название товара"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className={styles.row2}>
                <select
                  className={styles.input}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  className={styles.input}
                  placeholder="Цена ₽"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Описание товара"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Наличие */}
          <div className={styles.section}>
            <div className={styles.stockRow}>
              <div>
                <div className={styles.sectionLabel}>В наличии</div>
                <div className={styles.stockHint}>Если выключено — кнопка «Купить» будет неактивна</div>
              </div>
              <button
                className={`${styles.toggle} ${form.inStock ? styles.toggleOn : ''}`}
                onClick={() => setForm({ ...form, inStock: !form.inStock })}
              >
                <span className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          <button
            className={styles.primaryBtn}
            onClick={handleSave}
            disabled={!form.name.trim() || !form.price}
          >
            {editTarget ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
        </div>
      )}

      {/* ─── ПРОГРЕВ ─── */}
      {tab === 'warmup' && (
        <div className={styles.warmup}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Куда отправить</div>
            <input
              className={styles.input}
              placeholder="@channel или -1001234567890"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <p className={styles.hint}>Добавь бота как администратора в канал/группу</p>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Сообщение</div>
            <textarea
              className={`${styles.input} ${styles.warmupTextarea}`}
              placeholder={'Текст сообщения...\n\nПоддерживается HTML:\n<b>жирный</b>, <i>курсив</i>'}
              value={warmupMsg}
              onChange={(e) => setWarmupMsg(e.target.value)}
            />
          </div>
          <button
            className={`${styles.primaryBtn} ${warmupStatus === 'sending' ? styles.btnLoading : ''} ${warmupStatus === 'ok' ? styles.btnSuccess : ''} ${warmupStatus === 'error' ? styles.btnError : ''}`}
            onClick={handleWarmup}
            disabled={warmupStatus === 'sending' || !warmupMsg.trim() || !chatId.trim()}
          >
            {warmupStatus === 'sending' ? 'Отправка...' : warmupStatus === 'ok' ? '✓ Отправлено!' : warmupStatus === 'error' ? '✗ Ошибка — проверь ID' : '🔥 Отправить'}
          </button>
        </div>
      )}
    </div>
  )
}
