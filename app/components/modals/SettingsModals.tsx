'use client'
import useActive from '@/app/hooks/useActive';
import useSettingsModal from '@/app/hooks/useSettingsModal';
import { SafeUser } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CldUploadWidget } from "next-cloudinary";
import axios from 'axios';
import { useRouter } from 'next/navigation';

declare global {
    var cloudinary: any
}
  
const uploadPreset = "upusueif";

interface SettingsModalsProps {
    currentUser: SafeUser | any
}

export default function SettingsModals({
    currentUser
}: SettingsModalsProps) {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const [data, setData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image,
    cover: currentUser.cover
  })

  const settingsModal = useSettingsModal();
  const isActive = useActive({
    email: currentUser.email
  })

  const onSubmit = () => {
    setDisabled(true);
    if(data.name.length <= 0){
        return toast.error("Please set valid name");
    }
    if(data.email.length <= 0){
        return toast.error("Please set valid name");
    }
    axios.post('/api/user/reset', data).then(() => {
        toast.success('Profile has been updated!');
        setDisabled(false)
        settingsModal.onClose();
        router.refresh();
    }).catch((err) => {
        toast.error('Something went wrong');
        setDisabled(false)
    })
  }

  const onReset = () => {
    setDisabled(true);
    setData({
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
        cover: currentUser.cover
    })
    setDisabled(false);
  }
  return (
    <div className={clsx(
        'hidden w-full z-50 justify-center items-center bg-[#313338] fixed left-0 top-0 h-screen',
        settingsModal.isOpen && '!flex'
        )}>
        <div className='flex flex-col items-end w-[30%] h-full'>
            <div className='w-full md:w-[40%] px-2 h-full bg-[#2b2d31]'>
                <h2 className='mt-12 text-sm mb-2 text-[#959ba3]'>USER SETTINGS</h2>
                <ul className='flex gap-1 flex-col'>
                    <li className='text-white cursor-pointer w-full bg-[#404248] rounded-md px-2 py-1 text-base'>Profile</li>
                    <li className='text-white cursor-pointer w-full rounded-md px-2 py-1 text-base' onClick={() => {signOut()}}>Log Out</li>
                </ul>
            </div>
        </div>
        <div className='w-[70%] h-full flex flex-col items-start'>
            
            <div className='w-full md:w-[70%] px-12 mt-12 flex justify-between'>
                <h2 className='text-xl text-[#f1f1f1]'>Profile</h2>
                <p className="text-white border-2 border-white w-[30px] cursor-pointer flex justify-center items-center h-[30px] rounded-full" onClick={() => settingsModal.onClose()}>X</p>
            </div>
            <div className='w-full flex-col sm:flex-row md:w-[70%] px-12 mt-12 flex justify-between'>
                <div className='w-full sm:w-[50%]'>
                    <h2 className='text-sm mb-2 text-[#b6bac0]'>DISPLAY NAME</h2>
                    <input disabled={disabled} className='py-1 bg-[#1e1f22] outline-none px-2 text-white rounded-md' placeholder={data.name} value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>

                    <h2 className='text-sm mb-2 mt-5 text-[#b6bac0]'>Email</h2>
                    <input disabled={disabled} className='py-1 bg-[#1e1f22] outline-none px-2 text-white rounded-md' placeholder={data.email} value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                </div>
                <div className='w-full sm:w-[50%] mt-5 sm:mt-0'>
                    <h2 className='text-sm mb-2 text-[#b6bac0] '>PREVIEW</h2>
                    <div className='w-[80%] h-[400px]'>
                    <div className='flex flex-col items-center'>
                        <div className='w-full relative h-[130px]'>
                                <CldUploadWidget 
                                    onUpload={(result: any) => {setData({...data, cover: result.info.secure_url})}} 
                                    uploadPreset={uploadPreset}
                                    options={{
                                        maxFiles: 1
                                    }}
                                >
                                    {({ open }) => {
                                        return (
                                            <div onClick={() => open?.()} className='group cursor-pointer relative flex justify-center items-center'>
                                                 <Image src={data.cover || '/images/cover.png'} className='w-full object-cover h-[130px]' alt='' width={100} height={100}/>
                                                 <h2 className='absolute hidden group-hover:block'>Upload</h2>
                                            </div>
                                        )
                                    }}
                                </CldUploadWidget>
                            <div className='absolute -bottom-[30px] border-4 left-4 rounded-full border-[#313338] w-[84px] h-[84px]'>
                            <CldUploadWidget 
                                    onUpload={(result: any) => {setData({...data, image: result.info.secure_url})}} 
                                    uploadPreset={uploadPreset}
                                    options={{
                                        maxFiles: 1
                                    }}
                                >
                                    {({ open }) => {
                                        return (
                                        <div onClick={() => open?.()} className='relative cursor-pointer flex group justify-center items-center'>
                                            <Image alt={data.name} className='rounded-full w-[77px] object-cover h-[77px]' width={100} height={100} src={data.image || '/images/placeholder.png'}/>
                                            <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[25px] h-[25px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                                                ${isActive && 'bg-[#50a361]'}
                                            `}>
                                                {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                                            </span>
                                            <h2 className='absolute hidden group-hover:block'>Upload</h2>
                                        </div>
                                )}}
                                </CldUploadWidget>
                            </div>
                        </div>
                        <div className='w-full overflow-hidden text-[#f1f1f1] px-4 py-4 rounded-b-md  pt-12 bg-[#111214]'>
                            <h2 className='text-xl leading-6'>{data.name}</h2>
                            <p className='text-sm mb-3'>{currentUser.username}</p>
                            <div className='bg-[#2e2f34] w-full h-[2px]'></div>
                            <h2 className='text-sm mt-3 mb-1'>DISCORD MEMBER SINCE</h2>
                            <p className='text-xs text-[#b6bac0]'>{format(currentUser.createdAt, 'dd LLL yyyy')}</p>
                        </div>
                    </div>
                    <button className='w-full px-1 py-2 rounded-md mt-2 bg-[#3f894e] text-white disabled:text-gray-400 disabled:bg-[#1e3923cf] hover:bg-[#509c5f]' disabled={disabled || data.name.length <= 0 || data.email.length <= 0} onClick={() => onSubmit()}>Save</button>
                    <button className='w-full px-1 py-2 rounded-md mt-2 text-white disabled:text-gray-400' disabled={disabled} onClick={() => onReset()}>Reset</button>
                    </div>
                </div>
            </div>
            <div>
            </div>
        </div>
    </div>
  )
}
