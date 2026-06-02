import { useState } from 'react'
import AdminPage from '../components/AdminPage'
import styles from './ProfilePage.module.css'

function openConsult() {
  const text = encodeURIComponent('Здравствуйте! Хочу подобрать оборудование, нужна помощь консультанта.')
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/avanturestorebot?text=${text}`)
  } else {
    window.open(`https://t.me/avanturestorebot?text=${text}`, '_blank')
  }
}

export default function ProfilePage({ isAdmin, onProductsChange }) {
  const [showAdmin, setShowAdmin] = useState(false)

  if (showAdmin) {
    return (
      <div className={styles.adminWrap}>
        <button className={styles.backToProfile} onClick={() => setShowAdmin(false)}>
          ← Профиль
        </button>
        <AdminPage onProductsChange={onProductsChange} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatar}>A</div>
        <h1 className={styles.name}>Avanture Store</h1>
        <p className={styles.tagline}>Музыкальное оборудование для профессионалов и начинающих</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>О нас</h2>
        <p className={styles.text}>
          Продаём качественное музыкальное оборудование — микрофоны, звуковые карты, наушники и аксессуары.
          Работаем честно: только проверенные бренды, реальные фото и описания.
        </p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Почему мы</h2>
        <div className={styles.features}>
          {[
            ['📦', 'Быстрая отправка по всей России'],
            ['✅', 'Только оригинальное оборудование'],
            ['💬', 'Консультация перед покупкой'],
            ['🔄', 'Обмен и возврат в течение 14 дней'],
          ].map(([icon, text]) => (
            <div key={text} className={styles.feature}>
              <span className={styles.featureIcon}>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Контакты</h2>
        <a href="https://t.me/avanturestorebot" className={styles.contactBtn} target="_blank" rel="noreferrer">
          Написать в Telegram
        </a>
        <button className={styles.consultBtn} onClick={openConsult}>
          💬 Нужна помощь с выбором?
        </button>
      </div>

      {isAdmin && (
        <button className={styles.adminCard} onClick={() => setShowAdmin(true)}>
          <div className={styles.adminCardIcon}>⚙️</div>
          <div className={styles.adminCardText}>
            <div className={styles.adminCardTitle}>Управление магазином</div>
            <div className={styles.adminCardDesc}>Товары, ярлыки, прогрев</div>
          </div>
          <div className={styles.adminCardArrow}>›</div>
        </button>
      )}
    </div>
  )
}
