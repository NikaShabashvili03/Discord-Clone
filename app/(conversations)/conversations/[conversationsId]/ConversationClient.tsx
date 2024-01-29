'use client'
import React, { useState } from 'react'
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/structure/Header';
import Body from '@/app/components/structure/Body';
import RightBar from '@/app/components/structure/RightBar';
import MessageBody from './components/MessageBody';
import MessageForm from './components/MessageForm';
import MessageHead from './components/MessageHead';
import SidebarGroupSettings from './components/SidebarGroupSettings';
import SidebarSettings from './components/SidebarSettings';
import { SafeConversations, SafeUser } from '@/app/types';
import { LiveKitRoom, VideoConference, GridLayout, RoomName } from "@livekit/components-react";
import "@livekit/components-styles";

interface ConversationClientProps {
    conversation: SafeConversations | any,
    currentUser: SafeUser | any
    conversationsId: string,
    messages: any,
    conversations: any
}
export default function ConversationClient({
    conversation,
    currentUser,
    conversationsId,
    messages,
    conversations
}: ConversationClientProps) {
  const [token, setToken] = useState('');

  const onSubmit = ()  => {
        (async () => {
        try {
            const resp = await fetch(`/api/livekit?room=${conversationsId}&username=${currentUser.name}`);
            const data = await resp.json();
            setToken(data.token);
        } catch (e) {
            console.log(e);
        }
        })()
    }

  return (
    <div>
      <Sidebar initialItems={conversations} currentUser={currentUser}>
                <div className='flex-col flex w-full'>
                    {!token ? (
                        <>
                            <Header>
                                <div className='flex justify-start items-center w-full h-full'>
                                    <MessageHead call={onSubmit} currentUser={currentUser} conversation={conversation}/>
                                </div>
                            </Header>
                            <div className='flex h-[95%]'>
                                <Body>
                                    <div className='w-[98%] h-full flex justify-center items-center flex-col'>
                                        <MessageBody conversation={conversation} conversationId={conversationsId} currentUser={currentUser} initialMessages={messages}/>
                                        <MessageForm currentUser={currentUser} conversation={conversation} conversationId={conversationsId}/>
                                    </div>
                                </Body> 
                                <RightBar pxO>
                                    {conversation.isGroup ? (
                                        <SidebarGroupSettings users={conversation.users} conversation={conversation}/>
                                    ) : (
                                        <SidebarSettings conversation={conversation} currentUser={currentUser}/>
                                    )}
                                </RightBar>
                            </div>
                        </>
                    ) : <>
                        <div className="h-full">
                            <LiveKitRoom
                                data-lk-theme="default"
                                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                                token={token}
                                connect={true}
                                onDisconnected={() => setToken('')}
                                screen={true}
                                video={false}

                                audio={true}
                            >
                                <VideoConference />
                            </LiveKitRoom>
                        </div>
                    </>}
                </div>
            </Sidebar>
    </div>
  )
}
