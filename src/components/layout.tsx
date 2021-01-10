import React from 'react'

import ThemeContext from '@components/theme/themeContext'
import Header from '@components/header'
import Footer from '@components/footer'

const layout: React.FC = ({ children }) => {
  return (
    <>
      <ThemeContext>
        <div className="w-screen h-full flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ThemeContext>
    </>
  )
}

export default layout
