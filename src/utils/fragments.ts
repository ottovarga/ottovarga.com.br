import { graphql } from 'gatsby'

export const postFields = graphql`
  fragment PostFields on WpPost {
    id
    slug
    uri
    content
    excerpt
    title
    readingTime {
      minutes
    }
    date(formatString: "D [de] MMMM [de] YYYY", locale: "pt")
    dateGmt
    modifiedGmt
    isSticky
  }
`
export const postTags = graphql`
  fragment PostTags on WpPost {
    tags {
      nodes {
        name
        slug
      }
    }
  }
`

export const featuredImage = graphql`
  fragment FeaturedImage on WpPost {
    featuredImage {
      node {
        ...FeaturedImageFields
      }
    }
  }
`

export const featuredImageFields = graphql`
  fragment FeaturedImageFields on WpMediaItem {
    altText
    localFile {
      childImageSharp {
        thumb: gatsbyImageData(layout: CONSTRAINED, width: 600)
        featured: gatsbyImageData(layout: CONSTRAINED, width: 1000)
        ogImage: gatsbyImageData(layout: FIXED, width: 1200, height: 630)
        ogImageSquare: gatsbyImageData(layout: FIXED, width: 1000, height: 1000)
        ogImageFourXThree: gatsbyImageData(
          layout: FIXED
          width: 1200
          height: 900
        )
        ogImageSixteenXNine: gatsbyImageData(
          layout: FIXED
          width: 1600
          height: 900
        )
      }
    }
  }
`

export const author = graphql`
  fragment Author on WpPost {
    author {
      node {
        avatar {
          url
        }
        firstName
        lastName
        description
      }
    }
  }
`

export const seoPost = graphql`
  fragment SeoPost on WpPost {
    seo {
      canonical
      metaDesc
      title
    }
  }
`

export const seoPage = graphql`
  fragment SeoPage on WpPage {
    seo {
      canonical
      metaDesc
      title
      schema {
        pageType
        articleType
      }
      breadcrumbs {
        text
        url
      }
    }
  }
`

export const pageFields = graphql`
  fragment PageFields on WpPage {
    id
    slug
    uri
    content
    title
    dateGmt
    modifiedGmt
    featuredImage {
      node {
        ...FeaturedImageFields
      }
    }
  }
`
