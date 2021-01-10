import React from 'react'

interface Props {
  avatar: string
  firstName: string
  lastName: string
  description: string
}

const author: React.FC<Props> = ({
  avatar,
  firstName,
  lastName,
  description
}) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center">
      <img
        src={avatar}
        alt={`${firstName} ${lastName}`}
        loading="lazy"
        className="rounded-full mr-4 mb-4 md:mb-0"
      />
      <div>
        <div className="text-xl font-display font-bold mb-3">
          {firstName} {lastName}
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {description}
        </div>
      </div>
    </div>
  )
}

export default author
