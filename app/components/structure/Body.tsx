import React, { ReactNode } from 'react'

interface BodyProps {
    children: ReactNode
}

export default function Body({
    children
}: BodyProps) {
  return (
    <div className='w-full flex justify-start items-center flex-col xl:w-[70%] h-full'>
      {children}
    </div>
  )
}
