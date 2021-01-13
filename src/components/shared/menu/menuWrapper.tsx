import React, { useEffect, useState, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Hamburger from 'hamburger-react'

import Menu from '@components/shared/menu/menu'
import MenuItem from '@components/shared/menu/menuItem'

const menuWrapper: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const menuWrapperRef = useRef<HTMLDivElement>(null)

  const translateSpeed = 'duration-300'

  useEffect(() => {
    if (isOpen) {
      document
        .querySelector('body')
        ?.classList.add('transform', 'translate-x-60', 'overflow-hidden')
      menuWrapperRef.current?.classList.add('translate-x-0')
    } else {
      document
        .querySelector('body')
        ?.classList.remove('transform', 'translate-x-60', 'overflow-hidden')
      menuWrapperRef.current?.classList.remove('translate-x-0')
    }
  }, [isOpen])

  useEffect(() => {
    document.querySelector('body')?.classList.add(translateSpeed)
  })

  const menu = useStaticQuery(
    graphql`
      query MENUS {
        wpMenu(locations: { eq: PRIMARY }) {
          menuItems {
            nodes {
              id
              path
              linkRelationship
              cssClasses
              label
              title
              target
            }
          }
        }
      }
    `
  )

  return (
    <>
      <Hamburger toggled={isOpen} toggle={setOpen} />

      <div
        ref={menuWrapperRef}
        className={`fixed transform -translate-x-60 left-0 top-0 bottom-0 h-screen
        w-60 pt-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 z-50 ${translateSpeed}`}
      >
        {menu.wpMenu && (
          <Menu className="px-4">
            {menu.wpMenu.menuItems.nodes.map(
              ({
                path,
                cssClasses,
                label,
                linkRealationship,
                title,
                target,
                id
              }) => {
                const formattedLink = path.replace('/tag', '/categoria')
                return (
                  <MenuItem
                    key={id}
                    link={formattedLink}
                    name={label}
                    classes={cssClasses}
                    rel={linkRealationship}
                    title={title}
                    target={target}
                  />
                )
              }
            )}
          </Menu>
        )}
      </div>
    </>
  )
}

export default menuWrapper
