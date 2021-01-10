import React from 'react'
import Layout from '@components/layout'
import { graphql } from 'gatsby'

import Headline from '@components/shared/headline'
import Post from '@components/post/post'
import Sidebar from '@components/shared/sidebar'
import SearchLink from '@/components/shared/search/searchLink'
import TagList from '@components/shared/widgets/tagList'
import Pagination from '@components/pagination'

import Seo from '@components/infra/seo'

const IndexPage = ({
  data: { allPosts, allTags, postsByTag },
  pageContext
}) => {
  const posts = pageContext.tagSlug ? postsByTag.edges : allPosts.edges
  const tags = allTags.edges

  return (
    <Layout>
      <Seo
        title={
          pageContext.tagName
            ? `Artigos sobre ${pageContext.tagName} | Gustavo Rocha`
            : ''
        }
      />
      <div className="container my-12 md:my-24 px-4">
        <div className="flex">
          <div className="w-full lg:w-5/12">
            <Headline
              title={`${
                pageContext.tagName
                  ? 'artigos sobre ' + pageContext.tagName
                  : 'Olá, eu sou o Gustavo!'
              }`}
              subtitle={`${
                pageContext.tagName
                  ? ''
                  : 'Desenvolvimento de software, gestão, aprendizados e algumas experiências pessoais...'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="container px-4">
        <div className="flex flex-wrap justify-between">
          <section className="max-w-prose">
            {posts &&
              posts.map(
                ({
                  node: {
                    title,
                    date,
                    excerpt,
                    slug,
                    uri,
                    readingTime: { minutes },
                    tags,
                    featuredImage
                  }
                }) => (
                  <Post
                    key={slug}
                    title={title}
                    date={date}
                    excerpt={excerpt}
                    url={uri}
                    readingTime={minutes}
                    tags={tags.nodes}
                    image={featuredImage && featuredImage.node}
                  />
                )
              )}
          </section>
          <aside className="lg:w-1/4">
            <Sidebar>
              <SearchLink />
              <TagList tags={tags} />
            </Sidebar>
          </aside>
        </div>
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
    ) {
      edges {
        node {
          ...PostFields
          ...PostTags
          ...FeaturedImage
        }
      }
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
