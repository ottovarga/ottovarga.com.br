import React from 'react'
import { useStaticQuery, graphql, StaticQuery } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'

interface Props {
  title?: string
  subtitle?: string
  showImg?: boolean
}

interface ImageQuery {
  file: {
    childImageSharp: {
      fluid: FluidObject
    }
  }
}

const headline: React.FC<Props> = ({ title, subtitle, showImg }) => {
  const image = useStaticQuery<ImageQuery>(graphql`
    query AUTHOR_PICTURE {
      file(relativePath: { eq: "otto-varga.png" }) {
        childImageSharp {
          fluid(maxWidth: 180) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `)
  return (
    <div className="flex flex-wrap justify-start lg:justify-around items-center">
      <h1 className="w-full lg:max-w-lg mb-16 lg:mb-0 text-center lg:text-left">
        <div className="text-3xl lg:text-6xl font-bold mb-5">{title}</div>
        <div className="text-xl lg:text-3xl text-gray-600 dark:text-gray-500">
          {subtitle}
        </div>
      </h1>
      {showImg && (
        <div className="flex flex-col justify-center items-center">
          <div className="w-36 lg:w-44 mb-8">
            <Img
              fluid={image.file.childImageSharp.fluid}
              loading="eager"
              alt="Otto Varga"
              fadeIn={true}
              className="shadow-lg rounded-full"
            />
          </div>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-500 text-center">
            CEO e SEO Master na{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
              href="https://onserp.com.br"
            >
              onSERP Marketing
            </a>{' '}
            <br />
            Professor na{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline hover:opacity-90"
              href="https://ecommercenapratica.com"
            >
              E-commerce Pro
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default headline
