import getCurrentUser from '@/app/actions/getCurrentUser'
import { redirect } from 'next/navigation';
import React from 'react'
import AuthForm from './components/AuthForm';

export default async function page() {
  const currentUser = await getCurrentUser();
  
  if(currentUser){
    redirect('/');
  }

  return (
    <div style={{
      backgroundImage: 'url("/images/background.png")'
    }} className='h-screen object-cover flex justify-center items-center'>
        <AuthForm/>
    </div>
  )
}
