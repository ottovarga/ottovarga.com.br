import React, { useContext } from 'react'
import HyvorTalk from 'hyvor-talk-react'

import { ThemeContext } from '@components/theme/themeContext'

interface Props {
  id: string
  title: string
}

const comments: React.FC<Props> = ({ id, title }) => {
  const context = useContext(ThemeContext)

  const lightPalette = {
    accent: '#7C3AED',
    accentText: '#ffffff',
    footerHeader: '#FAFAFA',
    footerHeaderText: '#484848',
    box: '#ffffff',
    boxText: '#111827',
    boxLightText: '#aaaaaa',
    backgroundText: '#7C3AED'
  }

  const darkPalette = {
    accent: '#10b981',
    accentText: '#000000',
    footerHeader: '#374151',
    footerHeaderText: '#D1D5DB',
    box: '#4B5563',
    boxText: '#ffffff',
    boxLightText: '#aaaaaa',
    backgroundText: '#10b981'
  }

  return (
    <>
      <HyvorTalk.Embed
        websiteId={2844}
        loadMode="scroll"
        palette={context.theme === 'dark' ? darkPalette : lightPalette}
      />
    </>
  )
}

export default comments

/* <Disqus
      config={{
        url: currentUrl,
        identifier: id,
        title: title
      }}
    /> */
