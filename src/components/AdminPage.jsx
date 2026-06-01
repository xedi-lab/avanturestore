import { useState } from 'react'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productStore'
import styles from './AdminPage.module.css'

const CATEGORIES = ['Микрофоны', 'Звуковые карты', 'Наушники', 'Аксессуары']
const EMPTY_FORM = { name: '', category: 'Микрофоны', price: '', images: [], description: '', inStock: true }

export default function AdminPage({ onProductsChange }) {
  // view: 'home' | 'catalog' | 'form' | 'warmup'
  const [view, setView] = useState('home')
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
    setView('form')
  }

  function openEdit(p) {
    setEditTarget(p)
    setForm({ ...p, images: [...(p.images || [])] })
    setImgInput('')
    setView('form')
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
    setView('catalog')
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

  const viewKey = view

  // ─── HOME ───────────────────────────────────────────────────
  if (view === 'home') return (
    <div key={viewKey} className={`${styles.page} ${styles.viewIn}`}>
      <div className={styles.homeHead}>
        <div className={styles.homeGreeting}>Панель управления</div>
        <div className={styles.homeSubtitle}>Выберите раздел</div>
      </div>

      <div className={styles.homeCards}>
        <button className={styles.homeCard} onClick={() => setView('catalog')}>
          <div className={styles.homeCardIcon}>🛍</div>
          <div className={styles.homeCardInfo}>
            <div className={styles.homeCardTitle}>Ваша витрина</div>
            <div className={styles.homeCardDesc}>Товары, добавление, редактирование</div>
          </div>
          <div className={styles.homeCardArrow}>›</div>
        </button>

        <button className={styles.homeCard} onClick={() => setView('warmup')}>
          <div className={styles.homeCardIcon}>🔥</div>
          <div className={styles.homeCardInfo}>
            <div className={styles.homeCardTitle}>Прогрев</div>
            <div className={styles.homeCardDesc}>Отправить сообщение в канал</div>
          </div>
          <div className={styles.homeCardArrow}>›</div>
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{products.length}</div>
          <div className={styles.statLabel}>товаров</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{products.filter(p => p.inStock).length}</div>
          <div className={styles.statLabel}>в наличии</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{products.filter(p => !p.inStock).length}</div>
          <div className={styles.statLabel}>нет в наличии</div>
        </div>
      </div>
    </div>
  )

  // ─── CATALOG ─────────────────────────────────────────────────
  if (view === 'catalog') return (
    <div key={viewKey} className={`${styles.page} ${styles.viewIn}`}>
      <div className={styles.subHeader}>
        <button className={styles.backBtn} onClick={() => setView('home')}>← Назад</button>
        <h2 className={styles.subTitle}>Витрина</h2>
        <button className={styles.addInlineBtn} onClick={openAdd}>＋ Добавить</button>
      </div>

      <div className={styles.catalog}>
        {products.length === 0 && (
          <div className={styles.empty}>
            <p>Товаров пока нет</p>
            <button className={styles.primaryBtn} onClick={openAdd}>Добавить первый</button>
          </div>
        )}
        {products.map((p) => (
          <button key={p.id} className={styles.row} onClick={() => openEdit(p)}>
            {p.images?.[0]
              ? <img src={p.images[0]} alt={p.name} className={styles.thumb} />
              : <div className={styles.thumbEmpty}>😔</div>
            }
            <div className={styles.rowText}>
              <div className={styles.rowName}>{p.name}</div>
              <div className={styles.rowMeta}>{p.category} · {p.price.toLocaleString('ru-RU')} ₽</div>
              <div className={`${styles.rowStock} ${p.inStock ? styles.inStock : styles.outStock}`}>
                {p.inStock ? '● В наличии' : '● Нет в наличии'}
              </div>
            </div>
            <div className={styles.rowChevron}>›</div>
          </button>
        ))}
      </div>
    </div>
  )

  // ─── FORM ────────────────────────────────────────────────────
  if (view === 'form') return (
    <div key={viewKey} className={`${styles.page} ${styles.viewIn}`}>
      <div className={styles.subHeader}>
        <button className={styles.backBtn} onClick={() => setView('catalog')}>← Назад</button>
        <h2 className={styles.subTitle}>{editTarget ? 'Редактировать' : 'Новый товар'}</h2>
        <div />
      </div>

      <div className={styles.formPage}>
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
          <p className={styles.hint}>Загрузи на imgbb.com или imgur.com и вставь ссылку</p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>Основное</div>
          <div className={styles.fields}>
            <input className={styles.input} placeholder="Название товара" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className={styles.row2}>
              <select className={styles.input} value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input className={styles.input} placeholder="Цена ₽" type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Описание товара"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.stockRow}>
            <div>
              <div className={styles.sectionLabel}>В наличии</div>
              <div className={styles.stockHint}>Если выключено — кнопка «Купить» неактивна</div>
            </div>
            <button className={`${styles.toggle} ${form.inStock ? styles.toggleOn : ''}`}
              onClick={() => setForm({ ...form, inStock: !form.inStock })}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        <button className={styles.primaryBtn} onClick={handleSave}
          disabled={!form.name.trim() || !form.price}>
          {editTarget ? 'Сохранить изменения' : 'Добавить товар'}
        </button>

        {editTarget && (
          <button className={styles.deleteBtn} onClick={() => {
            if (!confirm('Удалить товар?')) return
            sync(deleteProduct(editTarget.id))
            setView('catalog')
          }}>
            🗑 Удалить товар
          </button>
        )}
      </div>
    </div>
  )

  // ─── WARMUP ──────────────────────────────────────────────────
  if (view === 'warmup') return (
    <div key={viewKey} className={`${styles.page} ${styles.viewIn}`}>
      <div className={styles.subHeader}>
        <button className={styles.backBtn} onClick={() => setView('home')}>← Назад</button>
        <h2 className={styles.subTitle}>Прогрев</h2>
        <div />
      </div>

      <div className={styles.warmup}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Куда отправить</div>
          <input className={styles.input} placeholder="@channel или -1001234567890"
            value={chatId} onChange={(e) => setChatId(e.target.value)} />
          <p className={styles.hint}>Добавь бота как администратора в канал или группу</p>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Сообщение</div>
          <textarea className={`${styles.input} ${styles.warmupTextarea}`}
            placeholder={'Текст сообщения...\n\nПоддерживается HTML:\n<b>жирный</b>, <i>курсив</i>'}
            value={warmupMsg} onChange={(e) => setWarmupMsg(e.target.value)} />
        </div>
        <button
          className={`${styles.primaryBtn} ${warmupStatus === 'ok' ? styles.btnSuccess : ''} ${warmupStatus === 'error' ? styles.btnError : ''}`}
          onClick={handleWarmup}
          disabled={warmupStatus === 'sending' || !warmupMsg.trim() || !chatId.trim()}>
          {warmupStatus === 'sending' ? 'Отправка...' : warmupStatus === 'ok' ? '✓ Отправлено!' : warmupStatus === 'error' ? '✗ Ошибка — проверь ID' : '🔥 Отправить'}
        </button>
      </div>
    </div>
  )
}
