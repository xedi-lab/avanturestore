import styles from './BioPage.module.css'

export default function BioPage() {
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
          <div className={styles.feature}>
            <span className={styles.icon}>📦</span>
            <span>Быстрая отправка по всей России</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>✅</span>
            <span>Только оригинальное оборудование</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>💬</span>
            <span>Консультация перед покупкой</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>🔄</span>
            <span>Обмен и возврат в течение 14 дней</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Контакты</h2>
        <a
          href="https://t.me/avanture_store"
          className={styles.contactBtn}
          target="_blank"
          rel="noreferrer"
        >
          Написать в Telegram
        </a>
      </div>
    </div>
  )
}
