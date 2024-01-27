import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface RightBarProps {
  children: ReactNode,
  pxO?: boolean,
}
export default function RightBar({
  children,
  pxO
}: RightBarProps) {
  return (
    <div className={clsx('hidden xl:block px-5 w-[30%] h-full border-l-2 border-[#3f4147]', pxO && '!px-0')}>
      {children}
    </div>
  )
}
