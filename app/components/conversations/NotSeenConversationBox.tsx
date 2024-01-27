'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";
import Image from "next/image";
import useActive from "@/app/hooks/useActive";
import { SafeUser } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import Link from "next/link";
import AvatarGroup from "../groupAvatar/GroupAvatar";

interface ConversationBoxProps {
  data: any,
  currentUser: SafeUser
}

const NotConversationBox: React.FC<ConversationBoxProps> = ({ 
  data, 
  currentUser,
}) => {
  const router = useRouter();
  const otherUser = useOtherUser({currentUser: currentUser, conversation: data});
  const [dataMessages, setMessages] = useState(data.messages);

  useEffect(() => {
    pusherClient.subscribe(data.id)

    const messageHandler = (message: any) => {
      setMessages((current: any) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message]
      });
      
    };

    const updateMessageHandler = (newMessage: any) => {
      setMessages((current: any) => current.map((currentMessage: any) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }
  
        return currentMessage;
      }))
    };
  

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, []);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);

  
  const lastMessage = useMemo(() => {
    const messages = dataMessages || [];

    return messages[messages.length - 1];
  }, [dataMessages]);


  const userId = useMemo(() => currentUser.id, [currentUser.id]);

  const notSeenLength = useMemo(() => {
    if (!userId) {
      return false;
    }

    return dataMessages?.map((message: any) => message?.seen.filter((user: any) => user.id == userId).length != 0).filter((data: any) => data == false).length
  }, [userId, dataMessages]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userId) {
      return false;
    }

    return seenArray.filter((user: any) => user.id === userId).length !== 0;
  }, [userId, lastMessage]);

  const pathname = usePathname();

  if(hasSeen){
    return null;
  }

  if(lastMessage?.senderId == currentUser.id){
    return null;
  }

  return ( 
    <Link href={`/conversations/${data.id}`}
      onClick={handleClick}
      className={clsx(`
        w-full group cursor-pointer relative flex py-2 justify-center items-center flex-col bg-transparent
        `,
      )}
    >
        <div className={`absolute left-0 mb-2 z-40 rounded-r-full w-[4px] ${pathname == `/conversations/${data.id}` ? 'h-[60%]' : 'h-[15%] transition-all delay-200 group-hover:h-[60%]'} bg-white`}></div>
            <div className={`w-[58%] relative h-[48px] ${pathname != `/conversations/${data.id}` && 'group-hover:-translate-y-[1px]'} transition-all delay-200 rounded-full`}>
            {data.isGroup ? 
              <>
                  <AvatarGroup users={data.users}/>
                  {notSeenLength > 0 && (
                    <h2 className={`absolute flex text-[13px] font-bold justify-center bg-[#df4f4a] items-center rounded-full -bottom-0.5 right-0 px-1 h-[23px] border-4 border-[#1e1f22] text-[#ffffff]`}>
                        {notSeenLength > 99 ? '99' : notSeenLength}
                    </h2>
                  )}
              </>
              : 
                <>
                  <Image className='w-full h-full rounded-full object-cover' src={otherUser.image || '/images/placeholder.png'} alt='Discord' width={100} height={100}/>
                  {notSeenLength > 0 && (
                    <h2 className={`absolute flex text-[13px] font-bold justify-center bg-[#df4f4a] items-center rounded-full -bottom-0.5 right-0 px-1 h-[23px] border-4 border-[#1e1f22] text-[#ffffff]`}>
                        {notSeenLength > 99 ? '99' : notSeenLength}
                    </h2>
                  )}
                </>
              }
            </div>
        <div className='w-[50%] border-b-2 mt-2 rounded-full border-[#35363c]'></div>
    </Link>
  );
}
 
export default NotConversationBox;
