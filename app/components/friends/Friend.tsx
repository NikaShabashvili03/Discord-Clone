import Image from 'next/image'
import React, { useState } from 'react'
import { BiSolidMessageRounded } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";

import { RxCross2 } from "react-icons/rx";
import { IoCheckmarkOutline } from "react-icons/io5";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useActive from '@/app/hooks/useActive';

interface FriendProps {
    id: string,
    avatarUrl: string,
    name: string,
    pending?: boolean,
    FromId?: string,
    UserId?: string,
    Filter?: any,
    email?: string,
    username: string,
    conversationId?: string,
    rightbar?: boolean
}
export default function Friend({
    id,
    avatarUrl,
    name,
    pending,
    FromId,
    UserId,
    Filter,
    email,
    conversationId,
    username,
    rightbar
}: FriendProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [isSettingOpen, setSettingOpen] = useState(false);

  const isActive = useActive({
    email: email,
  })

  const removePending = () => {
    setLoading(true);
    axios.post('/api/pending/remove', {
        fromId: FromId,
        userId: UserId
    }).then(() => {
        toast.success("Pending has removed");
        router.refresh();
        Filter();
        setLoading(false)
    })
    .catch((err) => {
        toast.error("Something went wrong");
        router.refresh();
        setLoading(false)
    })
  }

  const acceptPending = () => {
    setLoading(true);
    axios.post('/api/friends/add', {
        friendId: FromId,
        fromId: FromId,
        userId: UserId
    }).then(() => {
        toast.success("Pending has accepted");
        router.refresh();
        Filter();
        setLoading(false)
    }).catch((err) => {
        toast.error("Something went wrong");
        router.refresh();
        setLoading(false)
    })
  }

  const removeFriends = () => {
     setLoading(true);
     setSettingOpen(false);
     axios.post('/api/friends/remove', {
        friendId: FromId,
     }).then(() => {
        toast.success("Friend has removed");
        router.refresh();
        Filter();
        setLoading(false)
    }).catch((err) => {
        toast.error("Something went wrong");
        router.refresh();
        setLoading(false)
    })
  }

  return (
    <div className={`
            group 
            flex 
            py-3 
            cursor-pointer 
            border-[#3a3c41] 
            px-2 
            hover:rounded-md 
            hover:bg-[#3a3c41] 
            justify-between 
            items-center
            ${!rightbar && 'border-t border-b '}
        `}>
        <div className='flex justify-center relative items-center gap-2'>
            <div className='relative rounded-full w-[35px] h-[35px]'>
                <Image alt={name} className='rounded-full object-cover w-[35px] h-[35px]' width={100} height={100} src={avatarUrl || '/images/placeholder.png'}/>
                <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[14px] h-[14px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                    ${isActive && 'bg-[#50a361]'}
                `}>
                    {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                </span>
            </div>
            <div className='leading-4'>
                <div className='flex justify-start items-center'>
                    <h2 className='text-[#f1f1f1]'>{name}</h2>
                    <p className='text-[15px] ml-2 hidden group-hover:block text-[#b0b4ba]'>{username}</p>
                </div>
                {!rightbar && <p className='text-sm text-[#959ba3]'>{isActive ? 'Online' : 'Offline'}</p>}
            </div>
        </div>
        {!rightbar && (
            <div className='flex gap-5 relative'>
                {pending ? (
                    <>
                        <button disabled={loading} onClick={() => acceptPending()} className='py-1 px-1.5 bg-[#2b2d31] group-hover:bg-[#1e1f22] flex justify-center items-center rounded-full'>
                            <IoCheckmarkOutline color='#b6bac0' className='color-[##b6bac0]' size={20}/>
                        </button>
                        <button disabled={loading} onClick={() => removePending()} className='p-1 bg-[#2b2d31] group-hover:bg-[#1e1f22] flex justify-center items-center rounded-full'>
                            <RxCross2 color='#b6bac0' className='rotate-90 text-[##b6bac0] ' size={25}/>
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => router.push(`conversations/${conversationId}`)} disabled={loading} className='py-1 px-1.5 bg-[#2b2d31] group-hover:bg-[#1e1f22] flex justify-center items-center rounded-full'>
                            <BiSolidMessageRounded fill='#b6bac0' className='fill-[##b6bac0]' size={20}/>
                        </button>
                        <button onClick={() => setSettingOpen(!isSettingOpen)} disabled={loading} className='p-1 bg-[#2b2d31] group-hover:bg-[#1e1f22] flex justify-center items-center rounded-full'>
                            <BsThreeDots color='#b6bac0' className='rotate-90 text-[##b6bac0] ' size={25}/>
                        </button>
                    </>
                )}
                {(!pending && isSettingOpen) && (
                    <div className='bg-[#111214] z-10 absolute -bottom-[130px] right-3 w-[200px] rounded-md p-2'>
                        <button className='px-2 py-2 text-sm text-[#9ca0a5] hover:bg-[#4952bd] hover:text-[#f1f1f1] w-full text-start rounded-sm'>Start Video Call</button>
                        <button className='px-2 py-2 text-sm text-[#9ca0a5] hover:bg-[#4952bd] hover:text-[#f1f1f1] w-full text-start rounded-sm'>Start Voice Call</button>
                        <button onClick={() => removeFriends()} className='text-[#c94543] px-2 py-2 text-sm hover:bg-[#c94543] hover:text-[#f1f1f1] w-full text-start rounded-sm'>Remove Friends</button>
                    </div>
                )}
        </div>
        )}
    </div>
  )
}
