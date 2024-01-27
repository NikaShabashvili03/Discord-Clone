'use client'

import { Button } from '@/app/components/Button';
import Input from '@/app/components/inputs/input';
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const toggleVariant = useCallback(() => {
    if(variant === 'LOGIN'){
        setVariant('REGISTER');
    }
    else{
        setVariant('LOGIN');
    }
  },[variant])

  const {
    register,
    handleSubmit,
    formState: {
        errors
    }
  } = useForm<FieldValues>({
    defaultValues: {
        name: '',
        username: '',
        email: '',
        password: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if(variant == 'REGISTER'){
        axios.post('/api/register', data)
        .then(() => {
            toast.success("Success!")
            toggleVariant();
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
    }

    if(variant == 'LOGIN'){
        signIn('credentials', {
            ...data,
            redirect: false
        })
        .then((callback) => {
            if(callback?.error){
                toast.error('Invalid Credentials');
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged in!');
                router.push('/');
            }
        })
        .finally(() => setIsLoading(false));
    }
  }



  return (
    <div 
        className='
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
        '
    >
      <div 
      className='
        bg-[#313338]
        px-4
        py-8
        shadow
        sm:rounded-lg
        sm:px-10
      '>
        <form
            className='space-y-6'
            onSubmit={handleSubmit(onSubmit)}
        >
            {variant === 'REGISTER' && (
                <>
                    <Input 
                        errors={errors}
                        id='name' 
                        register={register} 
                        label='Name'
                        disabled={isLoading}
                    />
                    <Input 
                        errors={errors}
                        id='username' 
                        register={register} 
                        label='Username'
                        disabled={isLoading}
                    />
                </>
            )}
            <Input 
                    errors={errors}
                    id='email' 
                    register={register} 
                    label='Email Adress'
                    type='email'
                    disabled={isLoading}
            />
            <Input 
                    errors={errors}
                    id='password' 
                    register={register} 
                    label='Password'
                    type='password'
                    disabled={isLoading}
            />
            <div>
                <Button
                disabled={isLoading}
                fullWidth
                type="submit"
                
                >
                    {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                </Button>
            </div>
        </form>
        <div className='mt-6'>
            <div className='relative'>
                <div 
                className='
                    absolute
                    inset-0
                    flex
                    items-center
                '>
                    <div className='
                        w-full 
                        border-t 
                        mb-5
                        border-gray-300
                    '/>
                </div>
            </div>
        </div>

        <div className='
            flex
            gap-2
            justify-center
            text-sm
            mt-6
            px-2
            text-gray-500
        '>
            <div className='text-white'>
                {variant === 'LOGIN' ? 'New to Discord?' : 'Alredy have an account?'}
            </div>
            <div onClick={toggleVariant}
                className='underline text-white cursor-pointer'
            >
                {variant === 'LOGIN' ? 'Create an account' : 'Login'}
            </div>
        </div>
      </div>
    </div>
  )
}
