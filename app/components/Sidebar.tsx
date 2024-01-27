'use client'
import { RxCross1 } from "react-icons/rx";
import { MdOpenInFull } from "react-icons/md";
import Link from 'next/link'
import React, { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { BsPersonRaisedHand } from "react-icons/bs";
import clsx from "clsx";
import { IoSettingsSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { SafeConversations, SafeUser } from "../types";
import { pusherClient } from "../libs/pusher";
import { find } from 'lodash'
import ConversationBox from "./conversations/ConversationBox";
import NotConversationBox from "./conversations/NotSeenConversationBox";
import DirectMessages from "./modals/DirectMessages";
import useSettingsModal from "../hooks/useSettingsModal";

interface SidebarProps {
    children: ReactNode,
    currentUser: SafeUser | any,
    initialItems: Array<SafeConversations> | any
}
export default function Sidebar({
    children,
    currentUser,
    initialItems
}: SidebarProps) {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState(initialItems);
  const pathname = usePathname();
  const [showDirect, setShowDirect] = useState(false);

  useEffect(() => {
    pusherClient.subscribe(currentUser.id);

    const updateHandler = (conversation: any) => {
        setItems((current: any) => current.map((currentConversation: any) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages
            };
          }
  
          return currentConversation;
        }));
      }

      const newHandler = (conversation: any) => {
        setItems((current: any) => {
          if (find(current, { id: conversation.id })) {
            return current;
          }
  
          return [conversation, ...current]
        });
      }
  
      const removeHandler = (conversation: any) => {
        setItems((current: any) => {
          return [...current.filter((convo: any) => convo.id !== conversation.id)]
        });
      }
    
      pusherClient.bind('conversation:update', updateHandler)
      pusherClient.bind('conversation:new', newHandler)
      pusherClient.bind('conversation:remove', removeHandler)
  }, [])

  function fullScreenTgl() {
    if(document.documentElement.requestFullscreen) { 
        (!document.fullscreenElement ? document.documentElement.requestFullscreen() : document.exitFullscreen() ) 
    }  
  }

  const handleFilter = (e: any) => {
    const searchWorld = e.target.value;

    const newFilter =  items?.filter((conversation: any) => {
        return conversation?.users?.some((user: any) => user.name.toLowerCase().includes(searchWorld.toLowerCase()))
    })

    setItems(newFilter);

    if(searchWorld == ""){
        setItems(initialItems);
    }
}

const settingsModal = useSettingsModal();


  return (
    <div className='flex h-screen w-full'>
      <aside className={clsx("hidden md:block", 
            show ? '!block md:block' : 'hidden md:block'
            )}>
            <div className='bg-[#1e1f22] flex flex-col justify-start items-center h-screen w-[9vh]'>
                <div className='w-[90%] flex justify-between pt-3 mb-2 px-2'>
                    <Link href={'https://google.com'} className='w-[13px] group flex justify-center items-center bg-[#ed695e] rounded-full h-[13px]'>
                        <RxCross1 className="hidden group-hover:block" size={9}/>
                    </Link>
                    <button className='w-[13px] group flex justify-center items-center bg-[#f4bf4f] rounded-full h-[13px]'>
                        <span className="hidden group-hover:block mb-0.5">-</span>
                    </button>
                    <button onClick={() => {fullScreenTgl()}} className='w-[13px] group flex justify-center items-center bg-[#63c655] rounded-full h-[13px]'>
                        <MdOpenInFull className="hidden group-hover:block" size={9}/>
                    </button>
                </div>
                <Link href={'/'} className='w-full group cursor-pointer relative flex py-2 justify-center items-center flex-col bg-transparent'>
                    <div className={`absolute left-0 mb-2 z-40 rounded-r-full w-[4px] ${pathname == '/' ? 'h-[60%]' : 'h-[15%] transition-all delay-200 group-hover:h-[60%]'} bg-white`}></div>
                    <div className={`w-[58%] h-[48px] ${pathname != '/' && 'group-hover:-translate-y-[1px]'} transition-all delay-200 rounded-2xl bg-[#5a65ea]`}>
                        <Image className='w-full h-full rounded-2xl object-cover' src={'/images/logo.jpeg'} alt='Discord' width={100} height={100}/>
                    </div>
                    <div className='w-[50%] border-b-2 mt-2 rounded-full border-[#35363c]'></div>
                </Link>
                {items.map((item: SafeConversations) => (
                        <NotConversationBox
                            key={item.id}
                            currentUser={currentUser}
                            data={item}
                        />
                ))}
            </div>
      </aside>
      <div className='w-full bg-[#313338] flex h-screen'>
            <div className={clsx(`
                bg-[#2b2d31] absolute  sm:relative z-20 transition-all sm:block  w-[240px] h-full`, 
                show ? 'translate-x-0 sm:translate-x-0' : '-translate-x-full sm:translate-x-0'
                )
                }>
                <span onClick={() => {setShow(!show)}} className={`absolute  transition-all z-10 ${show ? 'w-[10px] rounded-r-2xl ' : 'w-[10px] rounded-r-full'} h-[50px] bg-black sm:hidden -right-[10px] top-[40%] -translate-y-[50%]`}></span>
                <div className='w-full h-[5%] py-2 px-2 flex justify-center  items-center  border-[#1f2023] border-b-2'>
                    <input placeholder="Find or start a conversation" onChange={handleFilter} className="w-[100%] h-[100%] py-1 text-[#959ba3] text-sm bg-[#1e1f22] pl-2 rounded text-start"/>
                </div>
                <div className="flex h-[10%] flex-col px-2 justify-center items-center gap-1">
                    <Link href={'/'} className={`w-[100%] ${pathname == '/' ? 'bg-[#404248]' : 'bg-transparent'} rounded-md flex h-[50px] justify-start items-center `}>
                        <BsPersonRaisedHand fill={`${pathname == '/' ? '#ffffff' : '#959ba3'}`}  className="w-[30px] ml-2 h-[30px]" />
                        <h2 className={`ml-3 ${pathname == '/' ? 'text-[#ffffff]' : 'text-[#959ba3]'} `}>Friends</h2> 
                    </Link>
                </div>
                <div className="w-full relative h-[79%]">
                        <div className="px-2">
                            <button onClick={() => setShowDirect(!showDirect)} className="flex w-full justify-between items-center">
                                <h2 className="text-[12px] mt-1 text-[#959ba3]">DIRECT MESSAGES</h2>
                                <span className="text-[#ffffff] mr-3">+</span>
                            </button>
                            <div className="h-full flex flex-col max-h-full  overflow-y-auto">
                            {items.map((item: SafeConversations) => (
                                    <ConversationBox
                                        key={item.id}
                                        currentUser={currentUser}
                                        data={item}
                                    />
                            ))}
                            </div>
                        </div>
                        <div className={clsx(`   
                            absolute 
                            top-5 
                            -right-[400px] 
                            hidden
                            w-[420px] 
                            h-[420px] 
                            bg-[#313338]
                            shadow-2xl
                            border
                            border-black
                            rounded-md
                            `, 
                            showDirect && '!block'
                            )
                            }>
                            <DirectMessages onClose={() => setShowDirect(false)} currentUser={currentUser}/>
                        </div>
                </div>
                <div className="bg-[#232428] h-[6%] w-full max-w-full py-2 flex">
                    <div className="px-2 flex overflow-hidden justify-start items-center w-[70%] h-full">
                        <Image width={100} className="w-[33px] object-cover h-[33px] rounded-full ml-2" height={100} src={currentUser?.image || '/images/placeholder.png'} alt=""/>
                        <div onClick={() => {
                            navigator.clipboard.writeText(currentUser.username);
                            toast.success("Username is Copy")
                        }} className="ml-2 cursor-pointer w-full max-w-full leading-3">
                            <h2 className="text-sm text-[#f2f3f5] max-w-full">{currentUser?.name}</h2>    
                            <p className="text-[12px] text-[#a1a5ab] ">{currentUser?.username}</p>
                        </div>
                    </div>
                    <div className="w-[30%] h-full flex justify-end px-3 items-center">
                        <button onClick={() => {settingsModal.onOpen()}}>
                            <IoSettingsSharp size={20} fill="#b6bac0"/>
                        </button>
                    </div>
                </div>
            </div>
                {children}
            </div>
    </div>
  )
}
