import React from 'react'
import { IoSearch } from 'react-icons/io5'
import Friend from './Friend'
import Image from 'next/image'
import { SafeConversations, SafeFriend, SafeUser } from '@/app/types'

interface AllProps {
  friends: Array<SafeFriend>
  currentUser: SafeUser
  setFriends: any
}

export default function All({friends, currentUser, setFriends}: AllProps) {

  const handleFilter = (e: any) => {
    const searchWorld = e.target.value;
    const newFilter = currentUser?.friend?.filter((value: SafeFriend) => 
        value.friend.name.toLowerCase().includes(searchWorld.toLowerCase()) || value.friend.username?.toLowerCase().includes(searchWorld.toLowerCase())
    )

    setFriends(newFilter);

    if(searchWorld == ""){
      setFriends(currentUser?.friend)
    }
}

  return (
    <div className='w-full h-full flex justify-center flex-col items-center'>
      <div className='w-[95%] h-[10%] relative mt-5'>
          <input onChange={handleFilter} placeholder='Search' className='w-full shadow-sm text-[#959ba3] bg-[#1e1f22] pl-2 rounded-md py-[5px]'/>
          <IoSearch size={22} className='absolute top-1.5 text-[#959ba3] right-2'/>
      </div>
      <div className='mt-6 w-[96%] h-[90%] ml-1'>
        {friends?.length != 0 ? (
              <>
                  <h2 className='text-sm ml-1 text-[#959ba3]'>Pending Friends - {friends?.length}</h2>
                  <div className='mt-3 h-full overflow-auto max-h-full'>
                      {friends?.map((friend: SafeFriend, i: any) => 
                          <Friend key={i} 

                          // For Friend Remove
                          Filter={() => {setFriends((prev: any) => prev.filter((itm: any) => itm.id != friend.id))}} 
                          FromId={friend.friendId}
                          UserId={friend.userId}
                          conversationId={friend?.friend?.conversations?.filter((conversation: SafeConversations) => conversation.userIds.some((id: any) => id == currentUser.id))[0].id}
                          username={friend.friend.username}
                          email={friend.friend.email} 
                          id={friend.friend.id} 
                          avatarUrl={friend.friend.image} 
                          name={friend.friend.name}/>
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
