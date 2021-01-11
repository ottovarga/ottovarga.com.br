import React from 'react'
import { Link } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'

import PostMeta, { Tag } from '@components/post/postMeta'
import formatExcerpt from '@utils/formatExcerpt'
import Card from '@components/shared/card'

interface Props {
  title: string
  excerpt?: string
  tags?: Tag[]
  readingTime?: number
  date: string
  image?: FeaturedImage
  url: string
  cardType: 'long' | 'short' | 'featured'
}

export type FeaturedImage = {
  altText: string
  localFile: {
    childImageSharp: {
      thumb: FluidObject | FluidObject[]
      featured: FluidObject | FluidObject[]
    }
  }
}

const post: React.FC<Props> = ({
  title,
  excerpt,
  tags,
  date,
  image,
  readingTime,
  url,
  cardType
}) => {
  return (
    <article
      className={`${
        cardType === 'long' || cardType === 'featured' ? 'lg:col-span-3' : ''
      }`}
    >
      <Card
        type={cardType}
        content={
          <>
            <Link to={url}>
              <h2
                className={`font-bold mb-6 ${
                  cardType === 'featured'
                    ? 'text-2xl lg:text-5xl'
                    : 'text-2xl lg:text-3xl'
                }`}
              >
                {title}
              </h2>
            </Link>
            <div className="text-base lg:text-lg text-gray-700 dark:text-gray-300 flex-grow">
              <p>{excerpt && formatExcerpt(excerpt, 250)}</p>
            </div>
          </>
        }
        image={
          image && (
            <>
              {
                <Link to={url} className="block h-full w-full">
                  <Img
                    className="object-cover w-full h-full"
                    alt={image?.altText}
                    fluid={image?.localFile.childImageSharp.thumb}
                    loading="lazy"
                  ></Img>
                </Link>
              }
            </>
          )
        }
        meta={
          <div className="flex justify-between">
            <PostMeta date={date} />{' '}
            <Link className="font-bold" to={url}>
              Leia mais
            </Link>
          </div>
        }
      ></Card>
    </article>
  )
}

export default post
