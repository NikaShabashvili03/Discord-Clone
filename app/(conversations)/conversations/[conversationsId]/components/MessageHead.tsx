'use client'
import AvatarGroup from '@/app/components/groupAvatar/GroupAvatar'
import useActive from '@/app/hooks/useActive'
import useOtherUser from '@/app/hooks/useOtherUser'
import { SafeConversations, SafeUser } from '@/app/types'
import Image from 'next/image'
import React from 'react'
import { IoCallOutline } from "react-icons/io5";

interface MessageHeadProps {
  conversation: SafeConversations | any
  currentUser: SafeUser | any,
  call: any
}

export default function MessageHead({conversation, currentUser, call}: MessageHeadProps) {
  const OtherUser = useOtherUser({conversation: conversation, currentUser: currentUser})
  const isActive = useActive({email: OtherUser.email})

  return (
    <div className='ml-5 w-full'>
      <div className='flex justify-between items-center w-[68%]'>
        <div className='flex h-full justify-center gap-3 items-center'>
            {conversation.isGroup ? 
              <>
                <AvatarGroup small users={conversation.users}/>
                <div className='flex gap-1'>
                  {conversation?.users.map((user: SafeUser, i: any) => 
                    <div key={i}>
                      <h2 className='text-[#f1f1f1] text-md font-semibold'>{user.name}{conversation.users.indexOf(user) != conversation.users.length - 1 && ','}</h2>
                    </div>
                  )}
                </div>
              </>
              : 
                <>
                  <div className='relative rounded-full w-[28px] h-[28px]'>
                      <Image alt={'Profile'} className='rounded-full object-cover w-[28px] h-[28px]' width={100} height={100} src={OtherUser.image || '/images/placeholder.png'}/>
                      <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[14px] h-[14px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                          ${isActive && 'bg-[#50a361]'}
                      `}>
                          {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                      </span>
                  </div>
                  <h2 className='text-[#f1f1f1] text-md font-semibold'>{OtherUser.name}</h2>
                </>
              }
        </div>
        <div>
          <IoCallOutline onClick={() => {call()}} size={25} fill='white' color='white'/>
        </div>
      </div>
    </div>
  )
}
