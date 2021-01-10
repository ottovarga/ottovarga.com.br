const formatExcerpt = require('../src/utils/moduleFormatExcerpt')

const pageQuery = `{
  posts: allWpPost(filter: {status: {eq: "publish"}}) {
    edges {
      node {
        slug
        title
        excerpt
        content
        date(formatString: "D [de] MMMM [de] YYYY", locale: "pt")
        featuredImage {
          node {
            localFile {
              publicURL
            }
          }
        }
      }
    }
  }
}`

function postToAlgoliaRecord({
  node: { slug, excerpt, content, featuredImage, ...rest }
}) {
  return {
    objectID: slug,
    // strip html tags from content
    excerpt: formatExcerpt(excerpt, 250),
    content: content.replace(/(<([^>]+)>)/gi, ''),
    image: featuredImage ? featuredImage.node.localFile.publicURL : '',
    ...rest
  }
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.posts.edges.map(postToAlgoliaRecord)
  }
]

module.exports = queries
