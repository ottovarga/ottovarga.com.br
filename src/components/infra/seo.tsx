import React from 'react'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql, Script } from 'gatsby'
import {
  GatsbySeo,
  ArticleJsonLd,
  LogoJsonLd,
  BreadcrumbJsonLd,
  SitelinksSearchBoxJsonLd
} from '@onserp/gatsby-plugin-next-seo'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import { Person } from 'schema-dts'

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
      thumb: IGatsbyImageData
      featured: IGatsbyImageData
      ogImage: IGatsbyImageData
      ogImageSquare: IGatsbyImageData
      ogImageFourXThree: IGatsbyImageData
      ogImageSixteenXNine: IGatsbyImageData
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

  const openGraphImages = (img: Images) => {
    return Object.keys(img.localFile.childImageSharp).map((key, index) => {
      const url = `${defaults.siteUrl}${img.localFile.childImageSharp[key].images.fallback.src}`

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

  const author = {
    '@type': 'Person',
    name: defaults.author,
    url: '${defaults.siteUrl}/sobre-mim/',
    image: '${defaults.siteUrl}/Otto-Varga.png',
    sameAs: [
      'https://www.facebook.com/ottovarga.88',
      'https://www.instagram.com/seo.otto',
      'https://www.linkedin.com/in/ottovarga'
    ]
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
        url={defaults.siteUrl}
        logo={`${defaults.siteUrl}/logo.png`}
      />

      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Otto Varga',
            url: defaults.siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${defaults.siteUrl}/search/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />

      {type && type === 'post' && (
        <ArticleJsonLd
          url={
            canonical
              ? `${defaults.siteUrl}${canonical}`
              : `${defaults.siteUrl}${pathname}`
          }
          headline={title}
          images={images && openGraphImages(images).map(item => item.flattened)}
          datePublished={date && new Date(date).toISOString()}
          dateModified={modified && new Date(modified).toISOString()}
          publisherName={defaults.author}
          publisherLogo={`${defaults.siteUrl}/logo.png`}
          authorType={'Person'}
          authorName={defaults.author}
          overrides={{
            '@type': 'Article',
            author: author as Person
          }}
          description={description || defaults.description}
        />
      )}

      {type && type === 'search' && (
        <SitelinksSearchBoxJsonLd
          searchHandlerQueryStringUrl={`${defaults.siteUrl}/search/?q=`}
          url={defaults.siteUrl}
        />
      )}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbJsonLd itemListElements={formatBreadcrumbs(breadcrumbs)} />
      )}

      {schema && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      )}
    </>
  )
}

export default seo
