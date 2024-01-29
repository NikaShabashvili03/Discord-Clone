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
import ConversationClient from './ConversationClient';

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
            <ConversationClient currentUser={currentUser} messages={messages} conversationsId={params.conversationsId} conversation={conversation} conversations={conversations}/>
        </ClientOnly>
    )
}
