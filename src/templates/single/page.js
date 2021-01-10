import React from 'react'
import { graphql } from 'gatsby'

import parse from 'html-react-parser'

import Layout from '@components/layout'
import Headline from '@components/shared/headline'
import Seo from '@components/infra/seo'
import { Breadcrumb } from 'gatsby-plugin-breadcrumb'

import Sidebar from '@components/shared/sidebar'
import SearchLink from '@/components/shared/search/searchLink'
import TagList from '@components/shared/widgets/tagList'

import parseBlocks from '@components/blocks/parseBlocks'

const page = ({ data, pageContext, location }) => {
  const { content, title, dateGmt, modifiedGmt, seo } = data.page
  const tags = data.allTags.edges
  const {
    breadcrumb: { crumbs }
  } = pageContext
  return (
    <Layout>
      <Seo
        title={seo.title}
        canonical={seo.canonical}
        description={seo.metaDesc}
        date={dateGmt}
        modified={modifiedGmt}
        schema={seo.schema}
        breadcrumbs={seo.breadcrumbs}
      />
      <div className="container mt-12 mb-12 md:mt-24 md:mb-20 px-4">
        <div className="flex">
          <div className="w-full lg:w-5/12">
            <Headline title={title} />
            <Breadcrumb
              className="text-sm"
              crumbs={crumbs}
              crumbLabel={title}
            />
          </div>
        </div>
      </div>
      <div className="container px-4 mb-32">
        <div className="flex flex-wrap justify-between">
          <div className="prose xl:prose-lg dark:prose-dark mb-24">
            {parse(content, { replace: parseBlocks })}
          </div>
          <aside className="lg:w-1/4">
            <Sidebar>
              <SearchLink />
              <TagList tags={tags} />
            </Sidebar>
          </aside>
        </div>
      </div>
    </Layout>
  )
}

export default page

export const pageQuery = graphql`
  query PAGE_QUERY($id: String!) {
    page: wpPage(id: { eq: $id }, status: { eq: "publish" }) {
      ...PageFields
      ...SeoPage
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
