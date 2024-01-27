import React, { useEffect } from 'react'
import Friend from './Friend'
import useActive from '@/app/hooks/useActive'
import Image from 'next/image'
import { SafeConversations, SafeFriend, SafeUser } from '@/app/types'

interface FilterOnlineProp {
    online: SafeFriend
    length: number,
    setOnline: any,
    currentUser: SafeUser,
    onlines: any,
}

export default function FilterOnline({online, onlines, length, setOnline, currentUser}: FilterOnlineProp) {
    const isActive = useActive({
        email: online.friend.email
    })



    if(!isActive){
        return null
    }

    return (
        <>
            <h2 className='text-sm ml-1 text-[#959ba3]'>Pending Friends - {length}</h2>
            <div className='mt-3 h-full overflow-auto max-h-full'>
            <Friend 
                Filter={() => {setOnline((prev: any) => prev.filter((itm: any) => itm.id != online.id))}} 
                FromId={online.friendId}
                UserId={online.userId} 
                conversationId={online?.friend?.conversations?.filter((conversation: SafeConversations) => conversation.userIds.some((id: any) => id == currentUser.id))[0].id}
                username={online.friend.username}
                email={online.friend.email} id={online.friend.id} avatarUrl={online.friend.image} name={online.friend.name}/>
            </div>
        </>
    )
}
