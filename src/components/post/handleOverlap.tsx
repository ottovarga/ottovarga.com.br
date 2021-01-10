import React, { useEffect, useRef, useState } from 'react'
import throttle from 'lodash/throttle'

/**
 * <HandleOverlap />
 * This is similar to Medium's "show and hide" the sidebar if it's overlapping an
 * element on the page. For our implementation, the only piece of content that can
 * overlap the <Aside /> is an image. and only 1 image at a time!
 *
 * So, this calculates the position of its children and the currently viewable <img />
 * and decides wether or not they're overlapping (with some buffer). If they are overlapping
 * we want to hide the top element.
 */
const HandleOverlap: React.FC<{}> = props => {
  const asideRef = useRef<HTMLDivElement>(null)
  const [isOverlapping, setIsOverlapping] = useState(false)

  // Is the current element within the window's frame? That's all we care about!
  function isVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect()

    return rect.top < window.innerHeight && rect.bottom >= 0
  }

  /**
   * This is a nice stackoverflow answer that sums up the overlapping feature. All
   * we've added is a small BUFFER because we don't want it to disppear as it touches.
   * We prefer to start the fade out a few pixels before!
   */
  function collide(fixedElement: Element, node: Element): boolean {
    const BUFFER = 80
    const rect1 = fixedElement.getBoundingClientRect()
    const rect2 = node.getBoundingClientRect()

    return !(
      rect1.top - BUFFER > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom + BUFFER < rect2.top ||
      rect1.left > rect2.right
    )
  }

  useEffect(() => {
    const handleScroll = throttle(() => {
      // Elements we want to include for the overlap
      const ctas = Array.from(document.getElementsByClassName('CallToAction'))
      const images = Array.from(document.querySelectorAll('img'))

      const nodesToNotOverlap = [...ctas, ...images]
      const noNodesAreVisible = !nodesToNotOverlap.some(isVisible)

      nodesToNotOverlap.forEach((node: Element): void | null => {
        // @ts-ignore
        const isOverlapping = collide(asideRef.current, node)

        if (noNodesAreVisible) {
          return setIsOverlapping(isOverlapping)
        }
        /**
         * If the node is not in the viewport don't fire state events for it,
         * otherwise we run into issues with multiple nodes on the page.
         */
        if (!isVisible(node)) {
          return null
        }

        setIsOverlapping(isOverlapping)
      })
    }, 20)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [asideRef])

  return (
    <OverlapContainer isOverlapping={isOverlapping} ref={asideRef}>
      {props.children}
    </OverlapContainer>
  )
}

export default HandleOverlap

interface OverlapContainerProps {
  isOverlapping: boolean
  children: React.ReactNode
}

const OverlapContainer = React.forwardRef<
  HTMLDivElement,
  OverlapContainerProps
>(({ isOverlapping, children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        userSelect: isOverlapping ? 'none' : 'initial',
        pointerEvents: isOverlapping ? 'none' : 'initial',
        opacity: isOverlapping ? 0 : 1,
        transition: isOverlapping ? 'opacity 0.25s' : 'opacity 0.25s'
      }}
    >
      {children}
    </div>
  )
})
