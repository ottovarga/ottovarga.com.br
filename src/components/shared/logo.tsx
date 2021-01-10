import React from 'react'
import { Link } from 'gatsby'

const logo: React.FC = () => {
  return (
    <Link to="/">
      <div className="font-display text-xl md:text-4xl mb-4 md:mb-0">
        <span className="font-normal">Gustavo</span>
        <span className="font-bold">.WTF</span>
      </div>
    </Link>
  )
}

export default logo
