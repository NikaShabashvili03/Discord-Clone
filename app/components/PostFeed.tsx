'use client'
import { signOut } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { pusherClient } from '../libs/pusher'
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostFeed({currentUser, messages}: any) {
  const [messagess, setMessages] = useState(messages);
  const [value, setValue] = useState('');
  useEffect(() => {
    pusherClient.subscribe('chat');

    const messageHandler = (body: any) => {
        setMessages((current: any) => {  
          return [...current, body]
        });
    };

    pusherClient.bind('messages:new', messageHandler)

    return () => {
        pusherClient.unbind('messages:new', messageHandler)
    }
  }, [])

  const createMessage = () => {
    axios.post('/api/message', {
        message: value
    }).then(() => {
        setValue('')
        toast.success(":)")
    }).catch((err) => {
        setValue('');
    })
  }

  return (
    <div>
      <button onClick={() => {signOut()}}>SignOut</button>
      {currentUser.name}
      {messagess?.map((message: any, i: any) => <div key={i}>{message?.sender?.name}: {message.body}</div>)}
      
      
      <input value={value} onChange={(e: any) => setValue(e.target.value)}/>
      <button onClick={() => {createMessage()}}>Send</button>
    </div>
  )
}
