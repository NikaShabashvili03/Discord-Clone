'use client'
import React, { useEffect } from 'react'
import Friend from './Friend'
import useActive from '@/app/hooks/useActive'
import Image from 'next/image'
import RightBarOffline from '../sidebar/RightBarOffline'
import { SafeConversations, SafeFriend, SafeUser } from '@/app/types'
import Link from 'next/link'


interface RightBarProps { 
    online: SafeFriend,
    href: any,
    setOnline: any,
    onlines: any
}

export default function RightBarOnline({online, href}: RightBarProps) {
    const isActive = useActive({
        email: online.friend.email
    })
    
    if(!isActive){
        return null
    }

    // if(isActive){
    //     setOnlineLength((prev: any) => [...prev, online.friend.id]);
    // }

    return (
        <Link href={href} className='h-auto'>
            <Friend username={online.friend.username} rightbar email={online.friend.email} id={online.friend.id} avatarUrl={online.friend.image} name={online.friend.name}/>
        </Link>
    )
}
