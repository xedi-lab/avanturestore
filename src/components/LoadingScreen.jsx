import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('in') // in → hold → out

  useEffect(() => {
    const hold = setTimeout(() => setPhase('out'), 1400)
    const done = setTimeout(() => onDone(), 1900)
    return () => { clearTimeout(hold); clearTimeout(done) }
  }, [onDone])

  return (
    <div className={`${styles.screen} ${phase === 'out' ? styles.fadeOut : ''}`}>
      <div className={styles.logo}>
        <span className={styles.word}>Avanture</span>
        <span className={styles.line} />
        <span className={styles.sub}>Store</span>
      </div>
    </div>
  )
}
