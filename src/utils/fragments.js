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
        altText
        localFile {
          childImageSharp {
            thumb: fluid(maxWidth: 600) {
              ...GatsbyImageSharpFluid_withWebp
            }
            featured: fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid_withWebp
            }
            ogImage: fixed(width: 1200, height: 630) {
              ...GatsbyImageSharpFixed_noBase64
            }
            ogImageSquare: fixed(width: 1000, height: 1000) {
              ...GatsbyImageSharpFixed_noBase64
            }
            ogImageFourXThree: fixed(width: 1200, height: 900) {
              ...GatsbyImageSharpFixed_noBase64
            }
            ogImageSixteenXNine: fixed(width: 1600, height: 900) {
              ...GatsbyImageSharpFixed_noBase64
            }
          }
        }
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
  }
`
