import React from 'react'
import { domToReact } from 'html-react-parser'
import { Element } from 'domhandler/lib/node'

import Code, { getLanguage, getCode } from '@components/blocks/code'

const parseBlocks = (node: Element) => {
  // code block
  if (node.name === 'pre') {
    return (
      node.children.length > 0 && (
        <Code language={getLanguage(node)}>{domToReact(getCode(node))}</Code>
      )
    )
  }
}

export default parseBlocks
