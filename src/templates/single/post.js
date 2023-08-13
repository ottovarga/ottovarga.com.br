import React, { useRef } from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

import ReadProgressBar from '@components/shared/readProgress'
import Layout from '@components/layout'
import SinglePost from '@components/post/single/singlePost'
import Related from '@/components/post/single/related'
import Seo from '@components/infra/seo'
import { Breadcrumb } from 'gatsby-plugin-breadcrumb'
const post = ({ data, pageContext }) => {
  const {
    title,
    content,
    date,
    dateGmt,
    modifiedGmt,
    readingTime,
    tags,
    featuredImage,
    author,
    slug,
    seo
  } = data.post

  const {
    breadcrumb: { crumbs }
  } = pageContext

  const readRef = useRef()
  return (
    <Layout>
      <Seo
        title={seo.title}
        canonical={seo.canonical}
        description={seo.metaDesc}
        type="post"
        images={featuredImage && featuredImage.node}
        date={dateGmt}
        modified={modifiedGmt}
      />
      {featuredImage && featuredImage.node && (
        <div className="w-full h-48 lg:h-96 relative">
          <GatsbyImage
            className="w-full h-full object-cover"
            image={featuredImage.node.localFile.childImageSharp.featured}
            alt={featuredImage.node.altText}
          />
        </div>
      )}

      <div className="container px-4">
        <div className="mb-24">
          <ReadProgressBar
            attachTo={readRef}
            color="bg-blue-500"
            backgroundColor="transparent"
          />

          <div className="lg:w-5/6 mt-20 mb-16 mx-auto px-4" ref={readRef}>
            <div className="max-w-2xl mx-auto mb-4">
              <div className="ml-2">
                <Breadcrumb
                  className="text-sm"
                  crumbs={crumbs}
                  crumbLabel={title}
                />
              </div>
            </div>
            <SinglePost
              title={title}
              content={content}
              date={date}
              readingTime={readingTime && readingTime.minutes}
              tags={tags && tags.nodes}
              author={author.node}
            />

            <hr className="border-t border-gray-300 dark:border-gray-500" />
          </div>
          {data.related.nodes.length > 0 && (
            <div className="mb-24">
              <p className="text-2xl font-bold mb-8">Relacionados</p>
              <Related posts={data.related} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default post

export const pageQuery = graphql`
  query POST_QUERY($id: String!, $tags: [String!]) {
    post: wpPost(id: { eq: $id }, status: { eq: "publish" }) {
      ...PostFields
      ...Author
      ...FeaturedImage
      ...SeoPost
      ...PostTags
    }
    related: allWpPost(
      filter: {
        tags: { nodes: { elemMatch: { slug: { in: $tags } } } }
        id: { ne: $id }
      }
      limit: 3
    ) {
      nodes {
        ...PostFields
        ...FeaturedImage
      }
    }
  }
`
