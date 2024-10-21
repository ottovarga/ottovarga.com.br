import React from 'react'
import Layout from '@components/layout'
import { graphql } from 'gatsby'

import Headline from '@components/shared/headline'
import Post from '@components/post/post'
import Pagination from '@components/pagination'

import Seo from '@components/infra/seo'

const WebstoryArchive = ({ data: { allWpWebStory }, pageContext }) => {
  const posts = allWpWebStory.edges

  return (
    <Layout>
      <Seo title="WebStories | Otto" />
      <section className="bg-gray-100 dark:bg-gray-800">
        <div className="container py-12 md:py-24 mb-8 px-4">
          <Headline title="WebStories" />
        </div>
      </section>

      <div className="container px-4 mb-24">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {posts &&
            posts.map(({ node: { title, slug, featuredImage } }, index) => (
              <React.Fragment key={slug + index}>
                <Post
                  cardType="short"
                  title={title}
                  url={`/webstory/${slug}/`}
                  image={featuredImage && featuredImage.node}
                />
              </React.Fragment>
            ))}
        </section>
      </div>
      <Pagination pageContext={pageContext} pathPrefix="/webstories" />
    </Layout>
  )
}

export default WebstoryArchive

export const pageQuery = graphql`
  query Webstories($limit: Int!, $skip: Int!) {
    allWpWebStory(
      sort: { fields: date, order: ASC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          slug
          title
          nodeType
          featuredImage {
            node {
              altText
              localFile {
                childImageSharp {
                  thumb: gatsbyImageData(layout: CONSTRAINED, width: 500)
                }
              }
            }
          }
        }
      }
    }
  }
`
