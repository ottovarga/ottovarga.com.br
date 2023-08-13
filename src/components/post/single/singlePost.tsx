import React, { useRef, useState, useEffect, useContext } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import throttle from 'lodash/throttle'
import parse from 'html-react-parser'

import PostMeta, { Tag } from '@components/post/postMeta'
import { FeaturedImage } from '@components/post/post'
import Sharer from '@/components/post/single/sharer'
import PostAside from '@components/post/postAside'
import parseBlocks from '@components/blocks/parseBlocks'

import { ThemeContext } from '@components/theme/themeContext'

import debounce from '@utils/debounce'

export interface SinglePostProps {
  title: string
  content: string
  date: string
  readingTime: number
  featuredImage?: FeaturedImage
  tags: Tag[]
  slug?: string
  author: {
    firstName: string
    lastName: string
  }
}

const singlePost: React.FC<SinglePostProps> = ({
  title,
  content,
  date,
  readingTime,
  tags,
  featuredImage,
  author
}) => {
  const contentSectionRef = useRef<HTMLElement>(null)

  const context = useContext(ThemeContext)

  const [hasCalculated, setHasCalculated] = useState<boolean>(false)
  const [contentHeight, setContentHeight] = useState<number>(0)

  useEffect(() => {
    const calculateBodySize = throttle(() => {
      const contentSection = contentSectionRef.current

      if (!contentSection) return

      /**
       * If we haven't checked the content's height before,
       * we want to add listeners to the content area's
       * imagery to recheck when it's loaded
       */
      if (!hasCalculated) {
        const debouncedCalculation = debounce(calculateBodySize)
        const $imgs = contentSection.querySelectorAll('img')

        $imgs.forEach($img => {
          // If the image hasn't finished loading then add a listener
          if (!$img.complete) $img.onload = debouncedCalculation
        })

        // Prevent rerun of the listener attachment
        setHasCalculated(true)
      }

      // Set the height and offset of the content area
      setContentHeight(contentSection.getBoundingClientRect().height)
    }, 20)

    calculateBodySize()
    window.addEventListener('resize', calculateBodySize)

    return () => window.removeEventListener('resize', calculateBodySize)
  }, [])

  return (
    <>
      <article className="mb-8 md:mb-16" ref={contentSectionRef}>
        <div
          className="mx-auto"
          id="ArticleFeaturedImage"
          style={{
            maxWidth: 900
          }}
        >
          {featuredImage && (
            <GatsbyImage
              className="mb-8"
              image={featuredImage?.localFile.childImageSharp.featured}
              alt={featuredImage?.altText}
            />
          )}
        </div>
        <div className="prose xl:prose-lg dark:prose-dark m-auto">
          <h1>{title}</h1>
          <b>Escrito por {`${author.firstName} ${author.lastName}`}</b>
          <PostMeta date={date} readingTime={readingTime} tags={tags} />

          {content &&
            content.length > 0 &&
            parse(content, {
              // @ts-ignore
              replace: parseBlocks
            })}
        </div>
        <Sharer
          className="flex flex-wrap lg:hidden items-center justify-end mt-12"
          bgStyle={{
            fill: context.theme === 'dark' ? '#6B7280' : '#9CA3AF'
          }}
          iconClass="ml-3 fill-current text-gray-400"
          round={true}
          size={32}
        />
      </article>
      <PostAside contentHeight={contentHeight}>
        <Sharer
          className="hidden lg:flex items-center justify-center flex-col"
          bgStyle={{
            fill: context.theme === 'dark' ? '#6B7280' : '#9CA3AF'
          }}
          iconClass="fill-current text-gray-400"
          linkClass="mb-4"
          round={true}
          size={32}
        />
      </PostAside>
    </>
  )
}

export default singlePost
