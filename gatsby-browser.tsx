import React from 'react'
import './src/styles/tailwind.css'
import './src/styles/blog.css'
import './src/styles/forms.css'
import './src/styles/buttons.css'
import 'gatsby-plugin-breadcrumb/gatsby-plugin-breadcrumb.css'

import RootElement from '@components/rootElement'

export const onRouteUpdate = ({ location }) => {
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  const pagePath = location
    ? location.pathname + location.search + location.hash
    : undefined

  setTimeout(() => {
    if (typeof window['gtag'] === 'function') {
      window['gtag']('event', 'page_view', { page_path: pagePath })
    }

    if (typeof window !== 'undefined') {
      window['dataLayer'] = window['dataLayer'] || []
      window['dataLayer'].push({
        event: 'pageview',
        originalLocation:
          document.location.protocol +
          '//' +
          document.location.hostname +
          document.location.pathname +
          document.location.search +
          document.location.hash
      })
    }
  }, 100)

  return true
}

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it

export const wrapRootElement = ({ element }) => {
  return <RootElement>{element}</RootElement>
}
