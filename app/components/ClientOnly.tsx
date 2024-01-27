import React, { ReactNode } from 'react'
import getCurrentUser from '../actions/getCurrentUser'
import { redirect } from 'next/navigation';

interface ClientOnlyProps {
    children: ReactNode
}

export default async function ClientOnly({
    children
}: ClientOnlyProps) {
  const currentUser = await getCurrentUser();

  if(!currentUser){
    redirect('/auth');
  }

  return (
    <>
      {children}
    </>
  )
}
