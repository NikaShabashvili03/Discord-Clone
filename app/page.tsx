import getCurrentUser from "./actions/getCurrentUser";
import PostFeed from "./components/PostFeed";
import AuthForm from "./(auth)/auth/components/AuthForm";
import { redirect } from "next/navigation";
import getMessages from "./actions/getMessages";
import ClientOnly from "./components/ClientOnly";
import Friends from "./components/Friends";
import Sidebar from "./components/Sidebar";
import getConversations from "./actions/getConversations";

export default async function Home() {
    const currentUser = await getCurrentUser();
    const conversations = await getConversations();

    return (
        <ClientOnly>
            <Sidebar initialItems={conversations} currentUser={currentUser}>
                <Friends currentUser={currentUser}/>
            </Sidebar>
        </ClientOnly>
    );
  }
  