import React from 'react'

interface Props {
  className?: string
  type: 'long' | 'short' | 'featured'
  content: React.ReactNode
  image?: React.ReactNode
  meta?: React.ReactNode
  rest?: React.HTMLAttributes<HTMLDivElement>
}

const author: React.FC<Props> = ({
  className,
  content,
  image,
  meta,
  type,
  ...rest
}) => {
  const wrapperClass = (type: Props['type']) => {
    const classes: string[] = ['flex', 'h-full']

    switch (type) {
      case 'long':
      case 'featured':
        classes.push('items-stretch')
        classes.push('justify-between')
        break
      case 'short':
        image && classes.push('flex-col-reverse')
        break
    }

    return classes.join(' ')
  }

  const contentWrapperClass = (type: Props['type']) => {
    const classes: string[] = ['']

    switch (type) {
      case 'long':
        classes.push('px-8')
        classes.push('py-10')
        image && classes.push('w-3/5')
        break
      case 'short':
        classes.push('p-8')
        break
      case 'featured':
        classes.push('w-6/12')
        classes.push('p-20')
        classes.push('bg-gray-100')
        classes.push('dark:bg-gray-800')
        break
    }

    return classes.join(' ')
  }

  const imageWrapperClass = (type: Props['type']) => {
    const classes: string[] = ['']

    switch (type) {
      case 'long':
        classes.push('w-2/5')
        break
      case 'short':
        classes.push('w-full')
        break
      case 'featured':
        classes.push('w-6/12')
        break
    }

    return classes.join(' ')
  }

  return (
    <div
      className={`shadow-lg dark:shadow-white-lg border border-gray-200 dark:border-gray-600 h-full  ${className}`}
      {...rest}
    >
      <div className={wrapperClass(type)}>
        <div className={contentWrapperClass(type)}>
          <div className="flex flex-col h-full">
            <div className="flex-grow">{content}</div>
            <div className="mt-4">{meta}</div>
          </div>
        </div>
        {image && <div className={imageWrapperClass(type)}>{image}</div>}
      </div>
    </div>
  )
}

export default React.memo(author)
