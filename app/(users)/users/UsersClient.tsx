"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export const UsersClient = ({users}: any) => {
  const router = useRouter();
  const createConversation = (userId: string) => {
    axios.post('/api/conversations', {
      userId: userId
    }).then((res) => {
      router.push(`/conversations/${res.data?.id}`)
      toast.success(":)");
    }).catch(() => {
      toast.error(":(");
    })
  }
  return (
    <div>
      Users
      <div  className='flex justify-center items-start flex-col gap-5'>
        {users?.map((user: any, i: any) => (
          <button onClick={() => {
            createConversation(user.id);
          }} key={i}>
            {user.name}
          </button>
        ))}
      </div>
    </div>
  )
}
