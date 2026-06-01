import styles from './HeroBlock.module.css'

export default function HeroBlock({ onCatalog, onConsult }) {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>🎵 Avanture Store</div>
        <h1 className={styles.title}>
          Профессиональное оборудование для записи, стриминга и домашней студии
        </h1>
        <p className={styles.subtitle}>
          Микрофоны, аудиоинтерфейсы, наушники и студийное оборудование с гарантией
        </p>

        <div className={styles.perks}>
          <span className={styles.perk}><span className={styles.check}>✓</span> Гарантия</span>
          <span className={styles.perk}><span className={styles.check}>✓</span> Быстрая доставка</span>
          <span className={styles.perk}><span className={styles.check}>✓</span> Поддержка специалистов</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onCatalog}>
            Подобрать комплект
          </button>
          <button className={styles.secondaryBtn} onClick={onConsult}>
            Связаться с консультантом
          </button>
        </div>
      </div>
    </div>
  )
}
