import React from 'react'

import MenuWrapper from '@/components/shared/menu/menuWrapper'
import DarkModeButton from '@/components/theme/toggleTheme'
import SearchLink from '@components/shared/search/searchLink'
import MetaPixel from '@/utils/metaPixel'

const Header: React.FC = () => {
  return (
    <header>
      <div className="container px-4 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <MenuWrapper />
          <MetaPixel />
          <SearchLink />
          <DarkModeButton />
        </div>
      </div>
    </header>
  )
}

export default Header
