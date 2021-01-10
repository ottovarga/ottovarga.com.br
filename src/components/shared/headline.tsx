import React from 'react'

interface Props {
  title?: string
  subtitle?: string
}

const headline: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-2">{title}</h1>
      <div className="text-xl">{subtitle}</div>
    </div>
  )
}

export default headline
