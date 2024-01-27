'use client'
import { pusherClient } from '@/app/libs/pusher';
import { SafeConversations, SafeFriend, SafeMessage, SafePending, SafeUser } from '@/app/types'
import axios from 'axios';
import { find, indexOf } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import toast from 'react-hot-toast';
import Image from 'next/image';
import useOtherUser from '@/app/hooks/useOtherUser';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import AvatarGroup from '@/app/components/groupAvatar/GroupAvatar';

interface MessageBodyProps {
  initialMessages: Array<SafeMessage> | any,
  currentUser: SafeUser | any,
  conversationId: string,
  conversation: SafeConversations | any
}
export default function MessageBody({
  conversation,
  initialMessages,
  currentUser,
  conversationId
}: MessageBodyProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const OtherUser = useOtherUser({conversation: conversation, currentUser: currentUser})

  useEffect(() => {
    axios.post(`/api/conversations/seen`, {
      conversationId: conversationId
    })
  }, []);

  const [friends, setFriends] = useState(currentUser.friend);
  const [pending, setPending] = useState(OtherUser.pending)
  


  // Pending
  const sendPending = () => {
    setLoading(true);
    axios.post('/api/pending/send', {
        username: OtherUser.username
    }).then(() => {
        setLoading(false)
        setPending((prev: any) => [...prev, {
          from: currentUser,
          fromId: currentUser.id,
          userId: OtherUser.id,
          user: OtherUser
         }])
    }).catch((err) => {
        setLoading(false)
        toast.error('Please check pendings')
    })
  }

  // Friends
  const removeFriends = () => {
    setLoading(true);
    axios.post('/api/friends/remove', {
       friendId: OtherUser.id,
    }).then(() => {
       toast.success("Friend has removed");
       router.refresh()
       setFriends((prev: Array<SafeFriend>) => prev.filter((friend) => friend.friendId != OtherUser.id))
       setLoading(false);
   }).catch((err) => {
       toast.error("Something went wrong");
       router.refresh();
       setLoading(false)
   })
 }

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
  };

  pusherClient.bind('friend:delete', messageHandler);

  return () => {
      pusherClient.unbind('friend:delete', messageHandler);
  }
}, [])

  //  Messages
  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: any) => {
      axios.post(`/api/conversations/seen`, {
        conversationId: conversationId
      })
      setMessages((current: any) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: any) => {
      setMessages((current: any) => current.map((currentMessage: any) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };
  

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, []);

  return (
    <div className='max-h-[90%] gap-3 flex flex-col px-5 overflow-y-auto w-full h-[90%]'>
      <div className='mt-5 mb-5'>
        {conversation.isGroup ? 
        <>
          <AvatarGroup users={conversation.users}/>
          <div className='flex gap-1'>
            {conversation?.users.map((user: SafeUser, i: any) => 
              <div key={i}>
                <h2 className='text-3xl font-bold text-[#f2f3f5] mt-2'>{user.name}{conversation.users.indexOf(user) != conversation.users.length - 1 && ','}</h2>
                {/* <p className='text-xl font-semibold text-[#f2f3f5] mt-1'>{user.username}</p>
                <p className='mt-5 text-[#b6bac0] text-sm'>This is the beginning of your direct message history with <span className='font-bold'>{user.name}</span></p> */}
              </div>
            )}
          </div>
          <div className='flex gap-1'>
            {conversation?.users.map((user: SafeUser, i: any) => 
              <div key={i}>
                {/* <h2 className='text-3xl font-bold text-[#f2f3f5] mt-2'>{user.name},</h2> */}
                <p className='text-xl font-semibold text-[#f2f3f5] mt-1'>{user.username}{conversation.users.indexOf(user) != conversation.users.length - 1 && ','}</p>
                {/* <p className='mt-5 text-[#b6bac0] text-sm'>This is the beginning of your direct message history with <span className='font-bold'>{user.name}</span></p> */}
              </div>
            )}
          </div>
          <p className='mt-5 flex gap-1 text-[#b6bac0] text-sm'>This is the beginning of your direct message history with 
            {conversation?.users.map((user: SafeUser, i: any) => 
              <span key={i} className='font-bold flex'>{user.name}{conversation.users.indexOf(user) != conversation.users.length - 1 && ','}</span>
            )}
          </p>
        </>
        : 
          <>
            <Image className='rounded-full w-[75px] object-cover h-[75px]' src={OtherUser.image || '/images/placeholder.png'} alt='' width={100} height={100}/>
            <h2 className='text-3xl font-bold text-[#f2f3f5] mt-2'>{OtherUser.name}</h2>
            <p className='text-xl font-semibold text-[#f2f3f5] mt-1'>{OtherUser.username}</p>
            <p className='mt-5 text-[#b6bac0] text-sm'>This is the beginning of your direct message history with <span className='font-bold'>{OtherUser.name}</span></p>
            {friends.some((friend: SafeFriend) => friend.friendId == OtherUser.id) ? 
              <button disabled={loading} onClick={() => removeFriends()} className='text-sm px-4 hover:bg-[#6d6f77] py-1 mt-2 text-[#ffffff] bg-[#4e5057] rounded-md'>Remove Friend</button>
              : 
              <button disabled={loading || pending.some((pending: SafePending) => pending.fromId == currentUser.id)} onClick={() => sendPending()} className='text-sm px-4 disabled:cursor-not-allowed hover:bg-[#4952bd] disabled:bg-[#4952bd] disabled:opacity-80 py-1 mt-2 text-[#ffffff] bg-[#5a65ea] rounded-md'>Add Friend</button>
            }
          </>
        }
        <div className='w-full flex justify-start items-center mt-5'>
          <span className='w-[37.5%]  md:w-[40%] h-[2px] bg-[#3f4147]'>
          </span>
          <h2 className='mx-1 w-[30%] md:w-[13%] text-sm text-[#959ba3]'>
            {format(conversation.createdAt, 'dd LLLL yyyy')}
          </h2>
          <span className='w-[37.5%] md:w-[40%] h-[2px] bg-[#3f4147]'>

          </span>
        </div>
      </div>
      {messages.map((message: SafeMessage, i: any) => (
        <MessageBox 
          isLast={i === messages.length - 1} 
          key={message.id} 
          isOwn={message.sender.id == currentUser.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  )
}
