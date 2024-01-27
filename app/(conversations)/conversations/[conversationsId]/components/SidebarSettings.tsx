'use client'

import useActive from '@/app/hooks/useActive'
import useOtherUser from '@/app/hooks/useOtherUser'
import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

interface SidebarSettings {
    conversation: any
    currentUser: any
}

export default function SidebarSettings({
    conversation,
    currentUser
}: SidebarSettings) {

  const otherUser = useOtherUser({
    conversation: conversation, 
    currentUser: currentUser
  });

  const isActive  = useActive({
    email: otherUser.email
  })

  return (
    <div className='flex flex-col items-center'>
        <div className='w-full relative h-[130px]'>
            <Image src={otherUser.cover || '/images/cover.png'} className='w-full object-cover h-[130px]' alt='' width={100} height={100}/>
          <div className='absolute -bottom-[30px] border-4 left-4 rounded-full border-[#313338] w-[84px] h-[84px]'>
                <Image alt={otherUser.name} className='rounded-full object-cover w-[77px] h-[77px]' width={100} height={100} src={otherUser.image || '/images/placeholder.png'}/>
                <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[25px] h-[25px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                    ${isActive && 'bg-[#50a361]'}
                `}>
                    {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                </span>
            </div>
        </div>
        <div className='w-[90%] text-[#f1f1f1] px-4 py-4 rounded-md  mt-12 bg-[#111214]'>
            <h2 className='text-xl leading-6'>{otherUser.name}</h2>
            <p className='text-sm mb-3'>{otherUser.username}</p>
            <div className='bg-[#2e2f34] w-full h-[2px]'></div>
            <h2 className='text-sm mt-3 mb-1'>DISCORD MEMBER SINCE</h2>
            <p className='text-xs text-[#b6bac0]'>{format(otherUser.createdAt, 'dd LLL yyyy')}</p>
        </div>
    </div>
  )
}
