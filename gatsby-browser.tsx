import React from 'react'
import './src/styles/tailwind.css'
import './src/styles/blog.css'
import './src/styles/forms.css'
import './src/styles/buttons.css'
import 'gatsby-plugin-breadcrumb/gatsby-plugin-breadcrumb.css'

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// You can delete this file if you're not using it

export const wrapRootElement = ({ element }) => {
  return <>{element}</>
}
