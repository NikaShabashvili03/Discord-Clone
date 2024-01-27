'use client'
import React, { useEffect, useState } from 'react'
import Header from './structure/Header'
import Body from './structure/Body'
import { BsPersonRaisedHand } from 'react-icons/bs'
import Online from './friends/Online'
import All from './friends/All'
import Pending from './friends/Pending'
import RightBar from './structure/RightBar'
import clsx from 'clsx'
import AddFriend from './friends/AddFriend'
import { pusherClient } from '../libs/pusher'
import useActive from '../hooks/useActive'
import RightBarOffline from './sidebar/RightBarOffline'
import RightBarOnline from './friends/RightBarOnline'
import { SafeConversations, SafeFriend, SafePending, SafeUser } from '../types'
import Link from 'next/link'


type WINDOW = 'ONLINE' | 'ALL' | 'PENDING' | 'ADDFRIEND'

interface FriendsProps {
  currentUser: SafeUser | any
}

export default function Friends({
  currentUser
}: FriendsProps) { 
  
  const [window, setWindow] = useState<WINDOW>('ONLINE');
  const [pending, setPending] = useState(currentUser.pending);
  const [friends, setFriends] = useState(currentUser.friend);
  const [online, setOnline] = useState(currentUser.friend);

  useEffect(() => {
    pusherClient.subscribe(currentUser.id);
    let id = (Math.random() + 1).toString(36).substring(2);

    const messageHandler = (body: any) => {
        setPending((prev: Array<SafePending>) => [
            ...prev,
            {
                id: id,
                from: body.from,
                fromId: body.from.id,
                userId: currentUser.id,
                user: currentUser
            }
        ])
    };

    pusherClient.bind('pending:new', messageHandler);

    return () => {
        pusherClient.unbind('pending:new', messageHandler);
    }
  }, [])

  useEffect(() => {
    pusherClient.subscribe(currentUser.id);
    let id = (Math.random() + 1).toString(36).substring(2);

    const messageHandler = (body: any) => {
        setFriends((prev: Array<SafeFriend>) => [
            ...prev,
            {
                id: id,
                friend: body.friend,
                friendId: body.friend.id,
                userId: currentUser.id,
                user: currentUser
            }
        ])
        setOnline((prev: Array<SafeFriend>) => [
          ...prev,
          {
              id: id,
              friend: body.friend,
              friendId: body.friend.id,
              userId: currentUser.id,
              user: currentUser
          }
      ])
    };

    pusherClient.bind('friend:new', messageHandler);

    return () => {
        pusherClient.unbind('friend:new', messageHandler);
    }
  }, [])

  useEffect(() => {
    pusherClient.subscribe(currentUser.id);

    const messageHandler = (body: any) => {
        setFriends((prev: Array<SafeFriend>) => prev.filter((friend: SafeFriend) => friend.friendId != body.friend.id))
        setOnline((prev: Array<SafeFriend>) => prev.filter((friend: SafeFriend) => friend.friendId != body.friend.id))
    };

    pusherClient.bind('friend:delete', messageHandler);

    return () => {
        pusherClient.unbind('friend:delete', messageHandler);
    }
  }, [])


  return (
    <div className='flex-col flex w-full'>
      <Header>
        <div className='flex justify-start items-center h-full'>
            <BsPersonRaisedHand fill={`#959ba3`}  className="w-[30px] ml-2 h-[30px]" />
            <h2 className={`ml-3 text-[#f1f1f1] `}>Friends</h2> 
            <div className='ml-2 bg-[#3f4147] h-[55%] w-[1px]'></div>
            <button onClick={() => {setWindow('ONLINE')}} className={clsx(`rounded-md text-[#959ba3] hover:bg-[#3f4147] text-sm ml-5 py-1 px-2 hover:text-[#f1f1f1]`,
            window == 'ONLINE' && 'py-[5px] px-[10px] text-[#f1f1f1] bg-[#3f4147] hover:text-[#f1f1f1]'
            )}>Online</button>
            <button onClick={() => {setWindow('ALL')}} className={clsx(`rounded-md text-[#959ba3] hover:bg-[#3f4147] text-sm ml-5 py-1 px-2 hover:text-[#f1f1f1]`,
            window == 'ALL' && 'py-[5px] px-[10px] text-[#f1f1f1] bg-[#3f4147] hover:text-[#f1f1f1]'
            )}>All</button>
            <button onClick={() => {setWindow('PENDING')}} className={clsx(`rounded-md text-[#959ba3] hover:bg-[#3f4147] text-sm ml-5 py-1 px-2 hover:text-[#f1f1f1]`,
            window == 'PENDING' && 'py-[5px] text-[#f1f1f1] px-[10px] bg-[#3f4147] hover:text-[#f1f1f1]'
            )}>Pending</button>
            <button onClick={() => {setWindow('ADDFRIEND')}} className={clsx(`rounded-md text-[#f1f1f1] bg-[#417e4c] text-sm ml-5 py-1 px-2`,
            window == 'ADDFRIEND' && 'py-[5px] !text-[#417e4c] px-[10px] !bg-transparent'
            )}>Add Friend</button>
        </div>
      </Header>
      <div className='flex h-[95%]'>
        <Body>
            <div className='w-[98%] h-[92%] flex justify-center items-center flex-col'>
                {window == 'ONLINE' && <Online setOnline={setOnline} currentUser={currentUser} onlines={online}/>}
                {window == 'ALL' && <All setFriends={setFriends} currentUser={currentUser} friends={friends}/>}
                {window == 'PENDING' && <Pending currentUser={currentUser} setPending={setPending} pending={pending}/>}
                {window == 'ADDFRIEND' && <AddFriend/>}
            </div>
        </Body> 
        <RightBar>
          <h2 className='mt-5 h-[5%] text-[#f1f1f1] text-xl font-bold'>Active Now</h2>
          {(online.length != 0) ? 
                <div className='flex flex-col overflow-y-auto h-[92%] max-h-[92%]'>
                  {online?.map((onlineData: SafeFriend, i: any) => 
                        <RightBarOnline 
                          key={i}
                          online={onlineData}

                          setOnline={setOnline}
                          onlines={online}
                          href={`/conversations/${onlineData?.friend?.conversations?.filter((conversation: SafeConversations) => conversation.userIds.some((id: any) => id == currentUser.id))[0].id}`}
                        />
                  ).reverse()}
                </div>
          : <RightBarOffline/>
          }
        </RightBar>
      </div>
    </div>
  )
}
