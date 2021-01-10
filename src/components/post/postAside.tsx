import React, { useEffect, useRef, useState } from 'react'
import throttle from 'lodash/throttle'
import clamp from '@utils/clamp'

import HandleOverlap from '@/components/post/handleOverlap'

interface AsideProps {
  contentHeight: number
}

const postAside: React.FC<AsideProps> = ({ contentHeight, children }) => {
  const progressRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState<number>(0)
  const [imageOffset, setImageOffset] = useState<number>(0)
  const [shouldFixAside, setShouldFixAside] = useState<boolean>(false)

  const show = imageOffset !== 0 && progress < 100

  useEffect(() => {
    const imageRect = document
      .getElementById('ArticleFeaturedImage')
      ?.getBoundingClientRect()

    if (!imageRect) return

    const imageOffsetFromTopOfWindow = imageRect.top // + window.scrollY
    setImageOffset(imageOffsetFromTopOfWindow)

    const handleScroll = throttle(() => {
      const el = progressRef.current
      const top = el?.getBoundingClientRect().top
      const height = el?.offsetHeight
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight

      const percentComplete = (window.scrollY / contentHeight) * 100

      setProgress(clamp(+percentComplete.toFixed(2), 0, 105))

      if (!top || !height) return

      if (top + window.scrollY < imageOffsetFromTopOfWindow) {
        return setShouldFixAside(false)
      }

      if (top + height / 2 <= windowHeight / 2) {
        return setShouldFixAside(true)
      }
    }, 20)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [contentHeight])

  return (
    <AsideContainer>
      <Align
        show={show}
        imageOffset={imageOffset}
        shouldFixAside={shouldFixAside}
      >
        <div ref={progressRef}>
          <HandleOverlap>{children}</HandleOverlap>
        </div>
      </Align>
    </AsideContainer>
  )
}

export default postAside

const AsideContainer: React.FC = ({ children }) => {
  return (
    <aside className="hidden lg:flex mx-auto max-w-screen-xl">{children}</aside>
  )
}

interface AlignProps {
  show: boolean
  shouldFixAside: boolean
  imageOffset: number
  children: React.ReactNode
}

const Align = React.memo<AlignProps>(
  ({ show, shouldFixAside, imageOffset, children }) => {
    return (
      <div
        className="flex z-10 h-screen transform-gpu translate-y-0"
        style={{
          position: shouldFixAside ? 'fixed' : 'absolute',
          top: shouldFixAside ? 0 : imageOffset,
          opacity: show ? 1 : 0,
          alignItems: shouldFixAside ? 'center' : 'flex-start',
          visibility: show ? 'visible' : 'hidden',
          transition: show
            ? 'opacity 0.4s linear, visibility 0.4s linear'
            : 'opacity 0.2s linear, visibility 0.4s linear'
        }}
      >
        {children}
      </div>
    )
  }
)
