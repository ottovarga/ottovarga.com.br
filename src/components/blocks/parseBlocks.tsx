import React from 'react'
import { domToReact } from 'html-react-parser'
import { Element } from 'domhandler/lib/node'

import Code, { getLanguage, getCode } from '@components/blocks/code'
import TableOfContents from '@components/blocks/tableOfContents'

const parseBlocks = (node: Element) => {
  // code block
  if (node.name === 'pre') {
    return (
      node.children.length > 0 && (
        <Code language={getLanguage(node)}>{domToReact(getCode(node))}</Code>
      )
    )
  }

  // table of contents
  if (node.attribs && node.attribs.id === 'ez-toc-container') {
    return (
      <TableOfContents>
        {domToReact(
          // @ts-ignore
          node.children.filter(({ name }) => name === 'nav')
        )}
      </TableOfContents>
    )
  }
}

export default parseBlocks
