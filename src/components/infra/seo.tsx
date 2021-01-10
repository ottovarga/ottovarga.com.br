import React from 'react'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from 'gatsby'
import {
  GatsbySeo,
  ArticleJsonLd,
  LogoJsonLd,
  BreadcrumbJsonLd
} from 'gatsby-plugin-next-seo'
import { GatsbyImageFixedProps, GatsbyImageFluidProps } from 'gatsby-image'

interface Props {
  title?: string
  description?: string
  canonical?: string
  images?: Images
  type?: string
  date?: string
  modified?: string
  schema?: {
    articleType: string[]
    pageType: string[]
  }
  breadcrumbs?: Breadcrumb[]
}

type Images = {
  altText: string
  localFile: {
    childImageSharp: {
      thumb: GatsbyImageFluidProps
      featured: GatsbyImageFluidProps
      ogImage: GatsbyImageFixedProps
      ogImageSquare: GatsbyImageFixedProps
      ogImageFourXThree: GatsbyImageFixedProps
      ogImageSixteenXNine: GatsbyImageFixedProps
    }
  }
}

type Breadcrumb = {
  text: string
  url: string
}

const seo: React.FC<Props> = ({
  title,
  description,
  canonical,
  images,
  type,
  date,
  modified,
  breadcrumbs,
  schema
}) => {
  const { pathname } = useLocation()
  const seoQuery = useStaticQuery(graphql`
    query SEO {
      site {
        siteMetadata {
          siteName
          title
          description
          siteUrl
          image
          twitterUsername
          author
          keywords
        }
      }
    }
  `)

  const defaults = seoQuery.site.siteMetadata
  images?.localFile.childImageSharp

  const openGraphImages = (img: Images) => {
    return Object.keys(img.localFile.childImageSharp).map((key, index) => {
      const url = `${defaults.siteUrl}${img.localFile.childImageSharp[key].src}`

      const og = {
        url: url,
        width: img.localFile.childImageSharp[key].width,
        height: img.localFile.childImageSharp[key].height,
        alt: img?.altText
      }

      Object.keys(og).forEach(key => og[key] === undefined && delete og[key])

      return { og, flattened: url }
    })
  }

  const formatBreadcrumbs = (bread: Breadcrumb[]) => {
    return bread.map(({ text, url }, index) => {
      return {
        position: index + 1,
        name: text,
        item: `${defaults.siteUrl}${url}`
      }
    })
  }

  return (
    <>
      <GatsbySeo
        title={title || `${defaults.title} | ${defaults.siteName}`}
        description={description || defaults.description}
        canonical={
          canonical
            ? `${defaults.siteUrl}${canonical}`
            : `${defaults.siteUrl}${pathname}`
        }
        openGraph={{
          url: canonical
            ? `${defaults.siteUrl}${canonical}`
            : `${defaults.siteUrl}${pathname}`,
          title: title || `${defaults.title} | ${defaults.siteName}`,
          description: description || defaults.description,
          site_name: defaults.siteName,
          images: images && openGraphImages(images).map(item => item.og)
        }}
        twitter={{
          handle: defaults.twitterUsername,
          site: canonical
            ? `${defaults.siteUrl}${canonical}`
            : `${defaults.siteUrl}${pathname}`,
          cardType: 'summary_large_image'
        }}
      />

      <LogoJsonLd
        logo={`${defaults.siteUrl}/logo.png`}
        url={defaults.siteUrl}
      />

      {type && type === 'post' && (
        <ArticleJsonLd
          url={
            canonical
              ? `${defaults.siteUrl}${canonical}`
              : `${defaults.siteUrl}${pathname}`
          }
          headline={title}
          // @ts-ignore
          images={images && openGraphImages(images).map(item => item.flattened)}
          // @ts-ignore
          datePublished={date && date}
          dateModified={modified && modified}
          publisherName={defaults.author}
          publisherLogo={`${defaults.siteUrl}/logo.png`}
          authorName={defaults.author}
          description={description || defaults.description}
        />
      )}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd itemListElements={formatBreadcrumbs(breadcrumbs)} />
      )}
    </>
  )
}

export default seo
