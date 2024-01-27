'use client';

import { User } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import GroupMapped from "./GroupMapped";

interface AvatarGroupProps {
  users?: User[];
  small?: boolean
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  users = [],
  small
}) => {
  const slicedUsers = users.slice(0, 3);
  
  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div className={clsx(
      "relative h-11 w-11",
      small && "w-10 h-10"
    )}>
      {slicedUsers.map((user, index) => {
        return <GroupMapped small={small} index={index} positionMap={positionMap} user={user} key={index}/>
      })}
    </div>
  );
}

export default AvatarGroup;
