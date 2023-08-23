import React from 'react'
import { useCollapse } from 'react-collapsed'
import Arrow from '@svg/arrow.svg'

export default function TableOfContents({ children }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse()

  return (
    <div className="py-4 pl-4 pr-8 border-2 border-gray-200 rounded-lg relative bg-gray-100 dark:bg-gray-700">
      <h2 className="text-xl font-bold text-gray-700 !m-0">Índice</h2>
      <button
        className={`toggle-toc ${isExpanded ? '-rotate-90' : 'rotate-90'}`}
        {...getToggleProps()}
      >
        <Arrow className="w-4 lg:w-6 transform transition-all origin-center duration-300 text-gray-400 fill-current" />
      </button>
      <div className="navigation-toc" {...getCollapseProps()}>
        {children}
      </div>
    </div>
  )
}
