import React from 'react'
import parse from 'html-react-parser'

function Author({ avatar, firstName, lastName, description }) {
  console.log(avatar)

  return (
    <div className="container mb-8 shadow-lg dark:shadow-white-lg border border-gray-200 dark:border-gray-600 ">
      <div className="px-4 py-6 lg:px-8 lg:py-4">
        <p className="text-2xl font-bold mb-6">Sobre o Autor</p>
        <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <p className="mb-4 text-xl font-bold lg:hidden">
              {firstName} {lastName}
            </p>
            <div className="rounded-full overflow-hidden aspect-square w-24 lg:w-40">
              <img
                className="object-cover w-full h-full"
                src={avatar.replace('s=96', 's=300')}
                alt="Otto Varga"
                loading="lazy"
              />
            </div>
          </div>
          <div className="lg:flex-1 pl-0 lg:pl-8">
            <p className="mb-4 text-xl font-bold hidden lg:block">
              {firstName} {lastName}
            </p>
            <div className="text-sm lg:text-base text-gray-700 dark:text-gray-300">
              {description && description.length > 0 && parse(description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Author
