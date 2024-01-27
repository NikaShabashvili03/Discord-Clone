import { SafeFriend, SafeUser } from '@/app/types'
import React, { useEffect, useState } from 'react'
import Select from '../inputs/Select';
import { useRouter } from 'next/navigation';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from 'react-hook-form';
import CheckFriend from '../inputs/CheckFriend';
import axios from 'axios';
import toast from 'react-hot-toast';
import { pusherClient } from '@/app/libs/pusher';

interface DirectMessagesProps {
    currentUser: SafeUser | any,
    onClose: () => void;
}
export default function DirectMessages({
    currentUser,
    onClose
}: DirectMessagesProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState(currentUser.friend || []);
  
  useEffect(() => {
    pusherClient.subscribe(currentUser.id);
    let id = (Math.random() + 1).toString(36).substring(2);

    const messageHandler = (body: any) => {
        setFriends((prev: Array<SafeFriend>) => [
            ...prev,
            {
                id: id,
                friend: body.friend,
                friendId: body.friend.id,
                userId: currentUser.id,
                user: currentUser
            }
        ])
    };

    pusherClient.bind('friend:new', messageHandler);

    return () => {
        pusherClient.unbind('friend:new', messageHandler);
    }
  }, [])

  useEffect(() => {
    pusherClient.subscribe(currentUser.id);

    const messageHandler = (body: any) => {
        setFriends((prev: Array<SafeFriend>) => prev.filter((friend: SafeFriend) => friend.friendId != body.friend.id))
    };

    pusherClient.bind('friend:delete', messageHandler);

    return () => {
        pusherClient.unbind('friend:delete', messageHandler);
    }
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      members: []
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if(members.length <= 1){
        return toast.error('Please set 1 more people');
    }
    axios.post('/api/conversations', {
      ...data,
      isGroup: true
    })
    .then(() => {
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
  }

  const members = watch('members');

  const handleFilter = (e: any) => {
      const searchWorld = e.target.value;
      const newFilter = currentUser?.friend?.filter((value: SafeFriend) => 
          value.friend.username?.toLowerCase().includes(searchWorld.toLowerCase())
      )

      setFriends(newFilter);

      if(searchWorld == ""){
        setFriends(currentUser?.friend)
      }
  }

  return (
    <div className='w-full rounded-md h-full'>
      <div className='h-[30%] px-4 flex flex-col w-full'>
        <h2 className='mt-4 leading-8  text-xl text-[#f1f1f1]'>Select Friends</h2>
        <p className='text-xs text-gray-400'>You can add {9 - members.length} more friends.</p>

        <input onChange={handleFilter} placeholder='Type the username of a friend' className='mt-6 bg-[#1e1f22] outline-none text-[#f1f1f1] rounded-md px-2 py-1'/>
      </div>
      <div className='h-[50%] max-h-[50%] overflow-y-auto px-4 w-full'>
            {friends?.map((friend: SafeFriend, i: any) => (
                <CheckFriend disabled={members.length > 8} members={members} setValue={setValue} key={i} friend={friend}/>
            ))}
      </div>
      <div className='h-[20%] px-4 flex justify-center items-center border-t border-[#393b40] w-full'>
        <button onClick={handleSubmit(onSubmit)} className='w-full bg-[#5a65ea] text-[#f1f1f1] h-[50%] rounded-md'>Create DM</button>
      </div>
    </div>
  )
}
