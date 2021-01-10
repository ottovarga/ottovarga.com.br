import React from 'react'
import { Link } from 'gatsby'

import SearchIcon from '@svg/search.svg'
import styles from './style.module.css'

const SearchLink: React.FC = () => {
  return (
    <Link to="/search" className="relative">
      <input
        placeholder="Buscar"
        type="text"
        className="w-full outline-none py-2 px-2 text-xl rounded cursor-pointer border border-gray-400 dark:bg-transparent dark:text-white"
      />
      <SearchIcon className="absolute top-0 bottom-0 m-auto right-2 dark:text-gray-300 stroke-current" />
    </Link>
  )
}

export default SearchLink
