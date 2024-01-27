import React from 'react'
import getCurrentUser from '@/app/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import ClientOnly from '@/app/components/ClientOnly';
import getConversationById from '@/app/actions/getConversationById';
import Sidebar from '@/app/components/Sidebar';
import getConversations from '@/app/actions/getConversations';
import Header from '@/app/components/structure/Header';
import Body from '@/app/components/structure/Body';
import RightBar from '@/app/components/structure/RightBar';
import MessageBody from './components/MessageBody';
import MessageForm from './components/MessageForm';
import MessageHead from './components/MessageHead';
import getMessages from '@/app/actions/getMessages';
import SidebarGroupSettings from './components/SidebarGroupSettings';
import SidebarSettings from './components/SidebarSettings';

interface IParams {
    conversationsId: string
}
export default async function page({params}: {params: IParams}) {
    const conversation = await getConversationById({conversationId: params.conversationsId});
    const currentUser = await getCurrentUser();
    const conversations = await getConversations();
    const messages = await getMessages(params.conversationsId);

    if(!conversation){
        redirect('/');
    }

    return (
        <ClientOnly>
            <Sidebar initialItems={conversations} currentUser={currentUser}>
                <div className='flex-col flex w-full'>
                    <Header>
                        <div className='flex justify-start items-center h-full'>
                            <MessageHead currentUser={currentUser} conversation={conversation}/>
                        </div>
                    </Header>
                    <div className='flex h-[95%]'>
                        <Body>
                            <div className='w-[98%] h-full flex justify-center items-center flex-col'>
                                <MessageBody conversation={conversation} conversationId={params.conversationsId} currentUser={currentUser} initialMessages={messages}/>
                                <MessageForm currentUser={currentUser} conversation={conversation} conversationId={params.conversationsId}/>
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
                </div>
            </Sidebar>
        </ClientOnly>
    )
}
