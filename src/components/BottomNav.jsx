import styles from './BottomNav.module.css'

export default function BottomNav({ active, onChange }) {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.tab} ${active === 'store' ? styles.active : ''}`}
        onClick={() => onChange('store')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Витрина</span>
      </button>
      <button
        className={`${styles.tab} ${active === 'bio' ? styles.active : ''}`}
        onClick={() => onChange('bio')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>О нас</span>
      </button>
    </nav>
  )
}
