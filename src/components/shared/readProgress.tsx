import React, { useEffect, RefObject, useState } from 'react'

interface ReadProgessBarProps {
  backgroundColor?: string
  color: string
  attachTo: RefObject<any>
}

const ReadProgressBar: React.FC<ReadProgessBarProps> = ({
  backgroundColor,
  color,
  attachTo
}) => {
  const [progress, setProgress] = useState(-100)

  const trackScrollEvent = () => {
    const { top, height } = attachTo.current.getBoundingClientRect()
    const progress = (top / (height - window.innerHeight)) * 100
    const translateValue = progress < -100 ? 0 : -100 - progress
    setProgress(translateValue < -100 ? -100 : top > 0 ? 0 : translateValue)
  }
  useEffect(() => {
    if (
      attachTo &&
      attachTo.current &&
      attachTo.current.getBoundingClientRect()
    ) {
      window.addEventListener('scroll', trackScrollEvent)
    }
    return () => {
      window.removeEventListener('scroll', trackScrollEvent)
    }
  }, [attachTo])

  return (
    <ReadProgressBarContainer color={backgroundColor} hide={progress === -100}>
      <Bar color={color} style={{ transform: `translateX(${progress}%)` }} />
    </ReadProgressBarContainer>
  )
}

const ReadProgressBarContainer = ({ color, hide, children }) => {
  return (
    <div
      className={`flex top-0 left-0 right-0 fixed w-full overflow-hidden ${color}`}
      style={{
        zIndex: 9999,
        height: hide ? 0 : 5
      }}
    >
      {children}
    </div>
  )
}

const Bar = ({ color, style }) => {
  return (
    <div
      className={`relative left-0 top-0 bottom-0 w-full ${color}`}
      style={{
        transform: 'translateX(-100%)',
        willChange: 'transform',
        ...style
      }}
    ></div>
  )
}

export default ReadProgressBar
