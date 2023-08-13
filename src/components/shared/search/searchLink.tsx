import React from 'react'
import { Link } from 'gatsby'

import SearchIcon from '@svg/search.svg'
import * as styles from './style.module.css'

const SearchLink: React.FC = () => {
  return (
    <Link to="/search" className="relative">
      <input
        placeholder="Buscar"
        type="text"
        className="w-40 lg:w-full outline-none py-2 pr-2 pl-12 text-lg lg:text-xl cursor-pointer border-b border-gray-400 dark:bg-transparent dark:text-white"
      />
      <SearchIcon className="absolute top-0 bottom-0 m-auto left-2 dark:text-gray-300 stroke-current" />
    </Link>
  )
}

export default SearchLink
