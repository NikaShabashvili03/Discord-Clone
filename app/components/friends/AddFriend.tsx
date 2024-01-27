import axios from 'axios';
import clsx from 'clsx';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

export default function AddFriend() {
  const [disabled, setDisabled] = useState(false);
  const [username, setUsername] = useState('');
  const [accept, setAccept] = useState(false);
  const [cancel, setCancel] = useState(false)

  useEffect(() => {
    setAccept(false);   
    setCancel(false);   
  },[username]) 

  const onSubmit = () => {
    setDisabled(true);
    if(username.length > 0){
        axios.post('/api/pending/send', {
            username: username
        }).then(() => {
            setDisabled(false);
            setAccept(true);
        }).catch((err) => {
            setCancel(true)
            setDisabled(false);
        })
    }
  }

  return (
    <div className='w-full h-full flex justify-start flex-col items-center'>
      <div className='mt-3 w-[95%] leading-9'>
        <h2 className='text-[#f1f1f1]'>ADD FRIEND</h2>
        <p className='text-sm text-[#959ba3]'>You can add friends with their Discord usernames.</p>
      </div>
      <div className='w-[95%] h-[10%] relative mt-3'>
          <input value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder='You can add friend with their Discord usernames.' className={clsx(`
            w-full border text-sm xl:text-base border-black shadow-sm text-[#959ba3] bg-[#1e1f22] pl-2 rounded-md py-4 xl:py-3
            `, 
            (accept && !cancel) && '!border !border-[#50a361]',
            (cancel && !accept) && '!border !border-[#df4f4a]'
            )}/>
          <button onClick={() => onSubmit()} disabled={disabled || username.length <= 0} className='absolute right-2 rounded-md disabled:bg-[#3c4286] disabled:text-[#8e8f90] top-2 text-[#ffffff] text-sm px-5 py-2 bg-[#5a65ea]'>
            Send Friend Request
          </button>
          <h2 className={clsx(`hidden text-sm my-2`,
            (accept && !cancel) && '!flex text-[#58a86c]',
            (cancel && !accept) && '!block text-[#ea7e7f]'
          )}>{(accept && !cancel) && `Success! Your friend request to ${username} was sent.`}
            {(cancel && !accept) && 'Hm, that didnt work. Double-check that the username is correct.'}</h2>
      </div>
      <div className='w-[100%] ml-1'>
        <Image src={'/images/waitingfriends.png'} className='w-full  object-cover' alt='' width={1000} height={1000}/>
      </div>
    </div>
  )
}
