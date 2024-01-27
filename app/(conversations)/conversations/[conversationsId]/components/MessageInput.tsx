'use client';

import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister
} from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  disabled: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  placeholder, 
  id, 
  type, 
  required, 
  register, 
  disabled
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        disabled={disabled}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="
          text-[#f1f1f1]
          font-light
          py-2
          px-4
          bg-[#383a3f]
          w-full 
          rounded-md
          focus:outline-none
        "
      />
    </div>
   );
}
 
export default MessageInput;