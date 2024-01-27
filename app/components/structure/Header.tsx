import React, { ReactNode } from 'react'

interface HeaderProps {
    children: ReactNode
}
export default function Header({
    children
}: HeaderProps) {
  return (
    <div className='w-full h-[5%] border-[#25272b] border-b-2 bg-[#313338]'>
      {children}
    </div>
  )
}
