import styles from './BottomNav.module.css'

export default function BottomNav({ active, onChange, showAdmin }) {
  return (
    <div className={styles.navWrap}>
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
      {showAdmin && (
        <button
          className={`${styles.tab} ${active === 'admin' ? styles.active : ''}`}
          onClick={() => onChange('admin')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Панель</span>
        </button>
      )}
    </nav>
    </div>
  )
}
