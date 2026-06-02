import styles from './HeroBlock.module.css'

export default function HeroBlock({ onCatalog, onConsult }) {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.badge}>🎵 Avanture Store</div>
        <h1 className={styles.title}>
          Звучи профессионально — оборудование для любого уровня
        </h1>
        <p className={styles.subtitle}>
          Выбери микрофон, интерфейс или наушники из проверенных брендов.
          Быстрая доставка, гарантия и помощь с выбором.
        </p>

        <div className={styles.perks}>
          <span className={styles.perk}><span className={styles.check}>✓</span> Гарантия</span>
          <span className={styles.perk}><span className={styles.check}>✓</span> Быстрая доставка</span>
          <span className={styles.perk}><span className={styles.check}>✓</span> Живой консультант</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onCatalog}>
            Смотреть каталог
          </button>
          <button className={styles.secondaryBtn} onClick={onConsult}>
            Связаться с консультантом
          </button>
        </div>
      </div>
    </div>
  )
}
