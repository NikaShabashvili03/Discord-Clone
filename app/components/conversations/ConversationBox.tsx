'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import useOtherUser from "@/app/hooks/useOtherUser";
import Image from "next/image";
import useActive from "@/app/hooks/useActive";
import { SafeConversations, SafeUser } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import AvatarGroup from "../groupAvatar/GroupAvatar";

interface ConversationBoxProps {
  data: SafeConversations,
  currentUser: SafeUser
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ 
  data, 
  currentUser,
}) => {
  const router = useRouter();
  const otherUser = useOtherUser({currentUser: currentUser, conversation: data});
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data, router]);


  const isActive = useActive({email: otherUser.email});
  const pathname = usePathname();
  return ( 
    <div
      onClick={handleClick}
      className={clsx(`
        group
        w-full 
        relative 
        flex 
        items-center 
        py-2
        px-2
        space-x-2
        hover:bg-[#36373c]
        rounded-lg
        transition
        cursor-pointer
        `,
        pathname == `/conversations/${data.id}` && 'bg-[#404248]'
      )}
    >
      <div className='rounded-full w-full h-auto'>
          {data.isGroup ? 
            <div className="flex w-full overflow-hidden items-center gap-1">
              <AvatarGroup small users={data.users}/>
              <div className='flex gap-1'>
                {data?.users.map((user: SafeUser, i: any) => 
                  // <div key={i}>
                  //   <h2 className='text-[#f1f1f1] text-md font-semibold'>{user.name}{data.users.indexOf(user) != data.users.length - 1 && ','}</h2>
                  // </div>
                  <div key={i} className="focus:outline-none">
                    <div className="flex mr-1 justify-between items-center mb-1">
                      <p className={clsx(`text-md font-medium text-[#90969e] group-hover:text-[#c8cace]`, pathname == `/conversations/${data.id}` && 'text-[#f1f1f1]')}>
                      {user.name}{data.users.indexOf(user) != data.users.length - 1 && ','}
                      </p>
                    </div>
                  </div> 
                )}
              </div>
            </div>
            : 
              <div className="flex  items-center gap-3">
                <div className="relative w-[35px] h-[35px]">
                  <Image alt={'Profile'} className='rounded-full object-cover w-[35px] h-[35px]' width={100} height={100} src={otherUser.image || '/images/placeholder.png'}/>
                  <span className={`absolute flex justify-center bg-[#2b2d31] items-center rounded-full -bottom-0.5 right-0 w-[14px] h-[14px] border-2 border-[#313338] group-hover:border-[#3a3c41]
                      ${isActive && 'bg-[#50a361]'}
                  `}>
                      {!isActive && <span className='border-2 rounded-full w-[85%] h-[85%] border-[#81848d]'></span>}
                  </span>
                </div>
                <div className="focus:outline-none">
                  <div className="flex justify-between items-center mb-1">
                    <p className={clsx(`text-md font-medium text-[#90969e] group-hover:text-[#c8cace]`, pathname == `/conversations/${data.id}` && 'text-[#f1f1f1]')}>
                      {otherUser.name}
                    </p>
                  </div>
                </div> 
              </div>
            }
        </div>
    </div>
  );
}
 
export default ConversationBox;
