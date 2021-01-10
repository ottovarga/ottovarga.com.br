import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import Logo from '@components/shared/logo'
import Menu from '@components/shared/menu/menu'
import MenuItem from '@components/shared/menu/menuItem'
import DarkModeButton from '@/components/theme/toggleTheme'

const Header: React.FC = () => {
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
    <header>
      <div className="container px-4 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <Logo />

          <div className="flex items-center">
            {menu.wpMenu && (
              <Menu className="mr-4">
                {menu.wpMenu.menuItems.nodes.map(
                  ({
                    path,
                    cssClasses,
                    label,
                    linkRealationship,
                    title,
                    target,
                    id
                  }) => (
                    <MenuItem
                      key={id}
                      link={path}
                      name={label}
                      classes={cssClasses}
                      rel={linkRealationship}
                      title={title}
                      target={target}
                    />
                  )
                )}
              </Menu>
            )}

            <DarkModeButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
