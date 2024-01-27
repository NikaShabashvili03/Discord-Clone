'use client'
import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'
import GroupMembers from './GroupMembers'

interface SidebarGroupSettingsProps {
    conversation: any,
    users: any
}
export default function SidebarGroupSettings({
    conversation,
    users
}:SidebarGroupSettingsProps) {
  return (
    <div className='px-5 mt-5 flex flex-col gap-5'>
      <h2 className='text-md text-[#f1f1f1]'>MEMBERS-{users.length}</h2>
      {users.map((user: any, i: any) =>
        <GroupMembers key={i} user={user}/>
      )}
    </div>
  )
}
