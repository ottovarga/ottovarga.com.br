import React from 'react'

import ThemeProvider from '@components/theme/themeContext'
import Header from '@components/header'
import Footer from '@components/footer'

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <ThemeProvider>
        <div className="w-screen h-full flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  )
}

export default layout
