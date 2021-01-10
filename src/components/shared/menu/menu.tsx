import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string | undefined
}

const menu: React.FC<Props> = ({ children, className }) => {
  return (
    <nav className={className}>
      <ul>{children}</ul>
    </nav>
  )
}

export default menu
