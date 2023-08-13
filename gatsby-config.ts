import path from 'path'

require('dotenv').config({
  path: '.env'
})

const siteMetadata = require('./config/metadata')

module.exports = {
  siteMetadata,
  graphqlTypegen: true,
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
        failOn: 'none'
      }
    },
    'gatsby-plugin-image',
    'gatsby-plugin-advanced-sitemap',
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
        name: 'OV SEO',
        short_name: 'OV SEO',
        start_url: '/',
        background_color: '#374151',
        theme_color: '#374151',
        display: 'minimal-ui',
        icon: './src/assets/images/favicon-seo.png'
      }
    },
    'gatsby-plugin-offline'
  ]
}
