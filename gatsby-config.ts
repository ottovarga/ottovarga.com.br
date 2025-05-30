import path from 'path'

require('dotenv').config({
  path: '.env'
})

import siteMetadata from './config/metadata'
import sitemap from './config/sitemap'

module.exports = {
  siteMetadata,
  graphqlTypegen: true,
  partytownProxiedURLs: [
    `https://www.googletagmanager.com/gtm.js?id=${process.env.GATSBY_GTM}`
  ],
  plugins: [
    'gatsby-plugin-tsconfig-paths',
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true, // defaults to false
        jsxPragma: 'jsx', // defaults to "React"
        allExtensions: true // defaults to false
      }
    },
    {
      resolve: 'gatsby-plugin-readingtime',
      options: {
        types: {
          WpPost: source => {
            const { content } = source
            return content
          }
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.join(__dirname, 'src/assets/images')
      }
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: process.env.GATSBY_GTM,
        includeInDevelopment: false,
        defaultDataLayer: { platform: 'gatsby' },
        enableWebVitalsTracking: true
      }
    },
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require('./config/algolia-queries'),
        indexName: process.env.ALGOLIA_INDEX_NAME,
        skipIndexing: true
      }
    },
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        url: process.env.WP_GRAPHQL_URL,
        schema: {
          timeout: 3000000,
          perPage: process.env.NODE_ENV === 'development' ? 10 : 20,
          requestConcurrency: 10,
          previewRequestConcurrency: 10
        },
        type: {
          Post: {
            limit:
              process.env.NODE_ENV === 'development' ||
              process.env.SITE_DEBUG === 'true'
                ? 50
                : 100000
          }
        }
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.svg$/
        }
      }
    },
    {
      resolve: 'gatsby-plugin-breadcrumb',
      options: {
        useAutoGen: true,
        autoGenHomeLabel: 'Início',
        exclude: [
          '**/dev-404-page/**',
          '**/404/**',
          '**/404.html',
          '**/offline-plugin-app-shell-fallback/**'
        ]
      }
    },
    '@onserp/gatsby-plugin-next-seo',
    'gatsby-transformer-sharp',

    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        failOn: 'none',
        defaults: {
          formats: ['auto', 'webp', 'avif'],
          placeholder: 'dominantColor',
          quality: 100
        }
      }
    },
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: sitemap
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-css-modules',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#374151',
        showSpinner: false
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'SEO Otto Varga',
        short_name: 'SEO Otto Varga',
        start_url: '/',
        background_color: '#374151',
        theme_color: '#374151',
        display: 'minimal-ui',
        icon: './src/assets/images/favicon-seo.png'
      }
    },
    'gatsby-plugin-remove-serviceworker'
  ]
}
