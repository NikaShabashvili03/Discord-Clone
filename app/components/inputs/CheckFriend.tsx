import useActive from '@/app/hooks/useActive';
import { SafeFriend } from '@/app/types'
import Image from 'next/image';
import React, { useState } from 'react'


interface CheckFriendPros {
    friend: SafeFriend,
    setValue: any,
    members: any,
    disabled: boolean,
}
export default function CheckFriend({
    friend,
    setValue,
    members,
    disabled,
}:CheckFriendPros) {
  const [checked, setChecked] = useState(false);
  const handleCheck = (e: any) => {
    setChecked(!checked);


    !checked ? 
            setValue('members', [...members, e.target.value])
        :
            setValue('members', members.filter((id: string) => id != e.target.value))
  }
  const isActive = useActive({email: friend.friend.email})
  return (
      <label className='w-full flex py-2 rounded-md hover:bg-[#3a3c41] items-center px-2 justify-between'>
            <div className='flex justify-center items-center gap-2'>
                <div className='relative rounded-full w-[35px] h-[35px]'>
                        <Image alt={friend.friend.name} className='rounded-full object-cover w-[35px] h-[35px]' width={100} height={100} src={friend.friend.image || '/images/placeholder.png'}/>
                        <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[14px] h-[14px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                            ${isActive && 'bg-[#50a361]'}
                        `}>
                            {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                        </span>
                </div>
                <div className='flex justify-end items-end gap-1'>
                    <h2 className='text-[#f1f1f1]'>{friend.friend.name}</h2>
                    <p className='text-sm text-[#959ba3]'>{friend.friend.username}</p>
                </div>
            </div>
            <input className='w-[25px] h-[25px]' disabled={disabled && !members.some((id: any) => id == friend.friend.id)} checked={checked} value={friend.friend.id} onChange={(e) => {handleCheck(e)}} type="checkbox" />
     </label>
  )
}
