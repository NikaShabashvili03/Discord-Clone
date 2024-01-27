import getCurrentUser from '@/app/actions/getCurrentUser'
import ClientOnly from '@/app/components/ClientOnly';
import { redirect } from 'next/navigation';
import React from 'react'
import { UsersClient } from './UsersClient';
import getAllUsers from '@/app/actions/getAllUsers';

export default async function page() {
  const users = await getAllUsers();

  return (
    <ClientOnly>
        <UsersClient users={users}/>
    </ClientOnly>
  )
}
