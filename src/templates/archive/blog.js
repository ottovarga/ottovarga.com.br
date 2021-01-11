import React from 'react'
import Layout from '@components/layout'
import { graphql } from 'gatsby'

import Headline from '@components/shared/headline'
import Post from '@components/post/post'
import Pagination from '@components/pagination'

import Seo from '@components/infra/seo'

const IndexPage = ({
  data: { allPosts, allTags, postsByTag, stickyPost },
  pageContext
}) => {
  const posts = pageContext.tagSlug ? postsByTag.edges : allPosts.edges
  console.log(pageContext)
  return (
    <Layout>
      <Seo
        title={
          pageContext.tagName
            ? `Artigos sobre ${pageContext.tagName} | Vamos falar de SEO?`
            : ''
        }
      />
      <section className="bg-gray-100 dark:bg-gray-800">
        <div className="container py-12 md:py-24 mb-8 px-4">
          <Headline
            title={`${
              pageContext.tagName
                ? 'artigos sobre ' + pageContext.tagName
                : 'Olá, eu sou o Otto Varga!'
            }`}
            subtitle={`${pageContext.tagName ? '' : 'Vamos falar de SEO?'}`}
            showImg
          />
        </div>
      </section>

      <div className="container px-4 mb-24">
        <section className="grid grid-cols-3 gap-8">
          {posts &&
            posts.map(
              (
                {
                  node: {
                    title,
                    date,
                    excerpt,
                    slug,
                    uri,
                    readingTime: { minutes },
                    tags,
                    featuredImage,
                    isSticky
                  }
                },
                index
              ) => (
                <React.Fragment key={slug + index}>
                  <Post
                    cardType={index === 0 ? 'long' : 'short'}
                    title={title}
                    date={date}
                    excerpt={excerpt}
                    url={uri}
                    readingTime={minutes}
                    tags={tags.nodes}
                    image={featuredImage && featuredImage.node}
                  />
                  {index === 3 && pageContext.pageNumber === 0 && (
                    <Post
                      cardType="featured"
                      title={stickyPost.title}
                      date={stickyPost.date}
                      excerpt={stickyPost.excerpt}
                      url={stickyPost.uri}
                      readingTime={stickyPost.minutes}
                      tags={stickyPost.tags.nodes}
                      image={
                        stickyPost.featuredImage &&
                        stickyPost.featuredImage.node
                      }
                    />
                  )}
                </React.Fragment>
              )
            )}
        </section>
      </div>
      <Pagination pageContext={pageContext} />
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query BLOG_QUERY($limit: Int!, $skip: Int!, $tagSlug: String) {
    allPosts: allWpPost(
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
      filter: { isSticky: { eq: false } }
    ) {
      edges {
        node {
          ...PostFields
          ...PostTags
          ...FeaturedImage
        }
      }
    }
    stickyPost: wpPost(isSticky: { eq: true }) {
      ...PostFields
      ...PostTags
      ...FeaturedImage
    }
    postsByTag: allWpPost(
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
      filter: { tags: { nodes: { elemMatch: { slug: { eq: $tagSlug } } } } }
    ) {
      edges {
        node {
          ...PostFields
          ...PostTags
          ...FeaturedImage
        }
      }
    }
    allTags: allWpTag(filter: { count: { gte: 1 } }) {
      edges {
        node {
          name
          slug
        }
      }
    }
  }
`
