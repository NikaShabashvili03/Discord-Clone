import React, { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import Friend from './Friend'
import { pusherClient } from '@/app/libs/pusher'
import Image from 'next/image'
import { SafeConversations, SafePending, SafeUser } from '@/app/types'


interface PendingProps {
    pending: Array<SafePending>,
    setPending: any,
    currentUser: SafeUser,
}

export default function Pending({pending, setPending, currentUser}: PendingProps) {

    const handleFilter = (e: any) => {
        const searchWorld = e.target.value;
        const newFilter = currentUser?.pending?.filter((value: SafePending) => 
            value.from.name.toLowerCase().includes(searchWorld.toLowerCase()) || value.from.username?.toLowerCase().includes(searchWorld.toLowerCase())
        )
    
        setPending(newFilter);
    
        if(searchWorld == ""){
            setPending(currentUser?.pending)
        }
    }

  return (
    <div className='w-full h-full flex justify-center flex-col items-center'>
      <div className='w-[95%] h-[10%] relative mt-5'>
          <input onChange={(e) => {handleFilter(e)}} placeholder='Search' className='w-full shadow-sm text-[#959ba3] bg-[#1e1f22] pl-2 rounded-md py-[5px]'/>
          <IoSearch size={22} className='absolute top-1.5 text-[#959ba3] right-2'/>
      </div>
      <div className='mt-6 w-[96%] h-[90%] ml-1'>
        {pending?.length != 0 ? (
            <>
                <h2 className='text-sm ml-1 text-[#959ba3]'>Pending Friends - {pending?.length}</h2>
                <div className='mt-3 h-full overflow-auto max-h-full'>
                    {pending?.map((pending: SafePending, i: any) => 
                        <Friend  
                        // For Pending
                        pending

                        Filter={() => {setPending((prev: any) => prev.filter((itm: any) => itm.id != pending.id))}} 
                        FromId={pending.fromId}
                        UserId={pending.userId}

                        username={pending.from.username}
                        email={pending.from.email} 
                        key={i} 
                        id={pending.from.id} 
                        avatarUrl={pending.from.image} name={pending.from.name}/>
                    ).reverse()}
                </div>
            </>
         ) : (
            <Image src={'/images/nopending.png'} alt='No Pending' className='w-full object-cover h-auto' width={1000} height={1000}/>
          )}
      </div>
    </div>
  )
}
