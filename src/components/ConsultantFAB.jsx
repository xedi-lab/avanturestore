import styles from './ConsultantFAB.module.css'

export default function ConsultantFAB({ onClick }) {
  return (
    <button className={styles.fab} onClick={onClick}>
      <span className={styles.icon}>💬</span>
      <span className={styles.text}>Нужна помощь?</span>
    </button>
  )
}
