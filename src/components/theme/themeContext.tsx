import React, { createContext, useState, useEffect } from 'react'

export type ThemeContextType = {
  theme: string
  toggleThemeMode: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleThemeMode: () => {}
})

const themeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.querySelector('html')?.classList.add('dark')
      setTheme('dark')
    } else {
      document.querySelector('html')?.classList.remove('dark')
      setTheme('light')
    }
  }, [])

  function toggleThemeMode(): void {
    if (
      !localStorage.getItem('theme') ||
      localStorage.getItem('theme') === 'light'
    ) {
      localStorage.theme = 'dark'
      document.querySelector('html')?.classList.add('dark')
      setTheme('dark')
    } else {
      localStorage.theme = 'light'
      document.querySelector('html')?.classList.remove('dark')
      setTheme('light')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default themeProvider
