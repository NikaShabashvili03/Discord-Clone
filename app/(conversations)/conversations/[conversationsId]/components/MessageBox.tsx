'use client';

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { SafeMessage } from "@/app/types";

interface MessageBoxProps {
  data: SafeMessage;
  isLast?: boolean;
  isOwn: boolean
}

const MessageBox: React.FC<MessageBoxProps> = ({ 
  data, 
  isLast,
  isOwn
}) => {

  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  return ( 
    <div className="flex">
      <div className={'avatar'}>
        <Image className="w-[40px] h-[40px] rounded-full" alt={'Profile Picture'} src={data.sender.image || '/images/placeholder.png'} width={100} height={100}/>
      </div>
      <div className={'flex flex-col ml-3 gap-1'}>
        <div className="flex items-center gap-1">
          <div className="text-md text-[#f2f3f5]">
            {data.sender.name}
          </div>
          <div className="text-xs mt-1 text-[#9298a0]">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={clsx(
            'text-sm text-[#dcdee1] w-fit overflow-hidden', 
        )}>
          {data.image ? (
            <Image
              alt="Image"
              height="288"
              width="288" 
              src={data.image} 
              className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div 
            className="
            text-xs 
            font-light 
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
   );
}
 
export default MessageBox;
