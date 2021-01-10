import React, { useEffect, useState, useContext } from 'react'

import { ThemeContext } from '@components/theme/themeContext'

import styles from './style.module.css'

const toggleTheme: React.FC = () => {
  const [icon, setIcon] = useState('moon')

  const context = useContext(ThemeContext)

  useEffect(() => {
    context.theme === 'light' && setIcon('moon')
    context.theme === 'dark' && setIcon('sun')

    !('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches &&
      setIcon('sun')
  }, [context])

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault()

    context.toggleThemeMode()
  }

  return (
    <>
      <button
        data-a11y="false"
        aria-label="Ativar modo escuro"
        title="Ativar modo escuro"
        className={`${styles.darkMode} ${styles[icon]}`}
        onClick={e => handleButtonClick(e)}
      >
        <div className={styles.darkMode__inner}></div>
        <div className={styles.darkMode__outer}></div>
      </button>
    </>
  )
}

export default toggleTheme
