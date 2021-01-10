const { each, filter } = require('lodash')
const { resolve } = require('path')
const { paginate } = require('gatsby-awesome-pagination')
function getOnlySimplePages(edges) {
  return filter(
    edges,
    ({ node }) => node.isPostsPage === false && node.isFrontPage === false
  )
}

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query ALL_POSTS_AND_PAGES_AND_CATEGORIES {
      allWpPost {
        edges {
          node {
            id
            slug
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }

      allWpTag(filter: { count: { gte: 1 } }) {
        nodes {
          name
          slug
          posts {
            nodes {
              id
              slug
            }
          }
        }
      }

      allWpPage {
        edges {
          node {
            id
            slug
            isPostsPage
            isFrontPage
          }
        }
      }
    }
  `)

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()))
    return Promise.reject(result.errors)
  }

  const postTemplate = resolve('./src/templates/single/post.js')
  const blogTemplate = resolve('./src/templates/archive/blog.js')
  const pageTemplate = resolve('./src/templates/single/page.js')

  // In production builds, filter for only published posts.
  const posts = result.data.allWpPost.edges
  const pages = getOnlySimplePages(result.data.allWpPage.edges)

  // Iterate over the array of posts
  each(posts, ({ node: post }) => {
    // Create the Gatsby page for this WordPress post
    createPage({
      path: `/${post.slug}/`,
      component: postTemplate,
      context: {
        id: post.id,
        tags: post.tags.nodes.map(({ slug }) => slug)
      }
    })

    // Create a paginated blog, e.g., /, /page/2, /page/3
    paginate({
      createPage,
      items: posts,
      itemsPerPage: 10,
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? '/' : '/page'),
      component: blogTemplate
    })
  })

  each(pages, ({ node: page }) => {
    // Create the Gatsby page for this WordPress post
    createPage({
      path: `/${page.slug}/`,
      component: pageTemplate,
      context: {
        id: page.id
      }
    })

    // Create a paginated blog, e.g., /, /page/2, /page/3
    paginate({
      createPage,
      items: posts,
      itemsPerPage: 10,
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? '/' : '/page'),
      component: blogTemplate
    })
  })

  const tags = result.data.allWpTag.nodes

  // Iterate over the array of tags
  each(tags, ({ name, slug, posts }) => {
    // Create a paginated blog, e.g., /, /page/2, /page/3
    paginate({
      createPage,
      items: posts.nodes,
      itemsPerPage: 10,
      pathPrefix: ({ pageNumber }) =>
        pageNumber === 0 ? `/tag/${slug}` : `/tag/${slug}/page`,
      component: blogTemplate,
      context: {
        tagSlug: slug,
        tagName: name
      }
    })
  })
}

module.exports = {
  createPages
}
