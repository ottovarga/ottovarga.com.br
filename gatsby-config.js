const path = require('path')

require('dotenv').config({
  path: '.env'
})

const siteMetadata = require('./config/metadata')

module.exports = {
  siteMetadata,
  flags: { PRESERVE_WEBPACK_CACHE: true, FAST_DEV: true, LAZY_IMAGES: true },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        '@': path.join(__dirname, 'src'),
        '@components': path.join(__dirname, 'src/components'),
        '@templates': path.join(__dirname, 'src/templates'),
        '@infra': path.join(__dirname, 'src/infra'),
        '@styles': path.join(__dirname, 'src/styles'),
        '@svg': path.join(__dirname, 'src/assets/svg'),
        '@utils': path.join(__dirname, 'src/utils'),
        '@config': path.join(__dirname, 'config'),
        '@root': path.join(__dirname)
      }
    },
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
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require('./config/algolia-queries'),
        indexName: process.env.ALGOLIA_INDEX_NAME,
        skipIndexing: process.env.NODE_ENV === 'development'
      }
    },
    {
      resolve: 'gatsby-plugin-wordpress-preview',
      options: {
        graphqlEndpoint: process.env.WP_GRAPHQL_URL,
        debug: true,
        processMediaItems: false
      }
    },
    {
      resolve: 'gatsby-source-wordpress-experimental',
      options: {
        url: process.env.WP_GRAPHQL_URL,
        type: {
          Post: {
            limit: process.env.NODE_ENV === 'development' ? 50 : null
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
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'pt-BR'
      }
    },
    {
      resolve: 'gatsby-plugin-disqus',
      options: {
        shortname: 'gustavo-wtf'
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
    'gatsby-plugin-next-seo',
    'gatsby-transformer-sharp',

    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        failOnError: false
      }
    },
    'gatsby-plugin-preload-link-crossorigin',
    'gatsby-plugin-advanced-sitemap',
    'gatsby-plugin-postcss',
    'gatsby-plugin-react-css-modules',
    'gatsby-plugin-analytics',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#7C3AED',
        showSpinner: false
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Gustavo Rocha',
        short_name: 'Gustavo Rocha',
        start_url: '/',
        background_color: '#7C3AED',
        theme_color: '#7C3AED',
        display: 'minimal-ui',
        icon: './src/assets/images/wtf-icon.png'
      }
    },
    'gatsby-plugin-offline'
  ]
}
