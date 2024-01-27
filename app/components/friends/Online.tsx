import React from 'react'
import { IoSearch } from 'react-icons/io5'
import Friend from './Friend'
import Image from 'next/image'
import useActive from '@/app/hooks/useActive'
import FilterOnline from './FilterOnline'
import { SafeFriend, SafeUser } from '@/app/types'

interface OnlineProps {
  onlines: Array<SafeFriend>
  currentUser: SafeUser
  setOnline: any
}
export default function Online({
  onlines, 
  currentUser, 
  setOnline
}: OnlineProps) {
  const handleFilter = (e: any) => {
      const searchWorld = e.target.value;
      const newFilter = currentUser?.friend?.filter((value: SafeFriend) => 
          value.friend.name.toLowerCase().includes(searchWorld.toLowerCase()) || value.friend.username?.toLowerCase().includes(searchWorld.toLowerCase())
      )

      setOnline(newFilter);

      if(searchWorld == ""){
        setOnline(currentUser?.friend)
      }
  }
  return (
    <div className='w-full h-full flex justify-center flex-col items-center'>
      <div className='w-[95%] h-[10%] relative mt-5'>
          <input onChange={handleFilter} placeholder='Search' className='w-full shadow-sm text-[#959ba3] bg-[#1e1f22] pl-2 rounded-md py-[5px]'/>
          <IoSearch size={22} className='absolute top-1.5 text-[#959ba3] right-2'/>
      </div>
      <div className='mt-6 w-[96%] h-[90%] max-h-[90%] overflow-auto ml-1'>
          {onlines?.length != 0 ? (
              onlines?.map((online: SafeFriend, i: any) => 
                  <FilterOnline onlines={onlines} currentUser={currentUser} setOnline={setOnline} key={i} length={onlines?.length} online={online}/>
              ).reverse()
         ) : (
            <Image src={'/images/nooneonline.png'} alt='No Pending' className='w-full object-cover' width={1000} height={1000}/>
          )}
      </div>
    </div>
  )
}
