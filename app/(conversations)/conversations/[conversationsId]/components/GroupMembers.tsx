import useActive from '@/app/hooks/useActive'
import Image from 'next/image'
import React from 'react'


interface GroupMembersProps {
    user: any
}
export default function GroupMembers({
    user
}: GroupMembersProps) {
  const isActive = useActive({
    email: user.email
  })
  return (
    <div className='flex gap-3 justify-start items-center w-full'>
        <div className='left-4 rounded-full w-[40px] h-[40px]'>
            <Image alt={user.name} className='rounded-full object-cover w-[40px] h-[40px]' width={100} height={100} src={user.image || '/images/placeholder.png'}/>
            <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[25px] h-[25px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                ${isActive && 'bg-[#50a361]'}
            `}>
                {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
            </span>
        </div>
        <h2 className='text-md text-[#f1f1f1]'>{user.name}</h2>
    </div>
  )
}
