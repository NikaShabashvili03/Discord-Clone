'use client'
import React from 'react'
import clsx from 'clsx'
import {
    FieldErrors,
    FieldValues,
    UseFormRegister
} from 'react-hook-form'


interface InputProps {
    label: string,
    id: string,
    type?: string;
    required?: boolean,
    register: UseFormRegister<FieldValues>
    errors: FieldErrors
    disabled?: boolean
}



const Input: React.FC<InputProps> = ({
    label,
    id,
    type,
    required,
    register,
    errors,
    disabled
}) => {
    return (
        <div>
            <label 
            htmlFor={id}
            className='
                block,
                text-sm
                font-medium
                leading-6
                text-white
            '
            >
                {label}
            </label>
            <div className='mt-2'>
                <input 
                    id={id}
                    type={type}
                    autoComplete={id}
                    disabled={disabled}
                    {...register(id, { required })}
                    className={clsx(`
                        form-input
                        block
                        w-full
                        rounded-md
                        border-0
                        py-1.5
                        shadow-sm
                        ring-1
                        ring-inset
                        ring-[#1e1f22]
                        text-[#f1f1f1]
                        bg-[#1e1f22]
                        placeholder:text-gray-400
                        focus:right-2
                        focus:right-inset
                        focus:right-sky-600
                        sm:text-sm
                        sm:leading-6
                    `, 
                    errors[id] && "focus:right-rose-500",
                    disabled && "opacity-50 cursor-default"
                    )}
                />
            </div>
        </div>
    )
}


export default Input

