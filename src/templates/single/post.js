import React, { useRef } from 'react'
import { graphql } from 'gatsby'

import ReadProgressBar from '@components/shared/readProgress'
import Layout from '@components/layout'
import SinglePost from '@components/post/single/singlePost'
import Author from '@/components/post/single/author'
import Related from '@/components/post/single/related'

import Seo from '@components/infra/seo'

const Comments = React.lazy(() => import('@/components/post/single/comments'))
const isSSR = typeof window === 'undefined'

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

      <div className="container">
        <div className="flex justify-center items-center flex-col mb-24">
          <ReadProgressBar
            attachTo={readRef}
            color="bg-purple-600 dark:bg-green-500"
            backgroundColor="transparent"
          />

          <div className="lg:w-5/6 mt-24 mb-16 px-4" ref={readRef}>
            <SinglePost
              title={title}
              content={content}
              date={date}
              readingTime={readingTime && readingTime.minutes}
              tags={tags && tags.nodes}
              featuredImage={featuredImage && featuredImage.node}
            />

            <hr className="border-t border-gray-300 dark:border-gray-500" />
          </div>
          <div className="w-5/6">
            <div className="w-full lg:w-3/5 m-auto">
              <div className="mb-32">
                <p className="text-2xl font-display font-bold mb-8">Autor</p>
                <Author
                  avatar={author.node.avatar.url}
                  firstName={author.node.firstName}
                  lastName={author.node.lastName}
                  description={author.node.description}
                />
              </div>
              {data.related.nodes.length > 0 && (
                <div className="mb-24">
                  <p className="text-2xl font-display font-bold mb-8">
                    Relacionados
                  </p>
                  <Related posts={data.related} />
                </div>
              )}
              <div>
                {!isSSR && (
                  <React.Suspense fallback={<div />}>
                    <p className="text-2xl font-display font-bold mb-8">
                      Comentários
                    </p>
                    <Comments id={slug} title={title} />
                  </React.Suspense>
                )}
              </div>
            </div>
          </div>
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
      }
    }
  }
`
