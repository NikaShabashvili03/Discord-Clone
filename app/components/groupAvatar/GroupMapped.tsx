import useActive from '@/app/hooks/useActive'
import { SafeUser } from '@/app/types'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

interface GroupMappedProps {
    user: any,
    positionMap: any
    small?: boolean,
    index: any,
}
export default function GroupMapped({
    user,
    positionMap,
    small,
    index,
}: GroupMappedProps) {
  const isActive = useActive({email: user.email});
  return (
    <div 
          key={user.id} 
          className={clsx(`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `, 
          small && 'h-[18px] w-[18px]'
          )}>
            <Image
              fill
              className='object-cover'
              src={user?.image || '/images/placeholder.png'}
              alt="Avatar"
            />
            <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[10px] h-[10px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                ${isActive && 'bg-[#50a361]'}
            `}>
                {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
            </span>
    </div>
  )
}
