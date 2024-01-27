'use client';

import { 
  HiPaperAirplane, 
  HiPhoto
} from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { 
  FieldValues, 
  SubmitHandler, 
  useForm 
} from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import useOtherUser from "@/app/hooks/useOtherUser";
import { SafeConversations, SafeUser } from "@/app/types";
import { useState } from "react";

interface FormProps {
  conversationId: string,
  conversation: SafeConversations | any,
  currentUser: SafeUser | any,
}
const Form = ({conversationId, conversation, currentUser}: FormProps) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });


  const OtherUser = useOtherUser({conversation: conversation, currentUser: currentUser})

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    axios.post('/api/messages', {
      message: data.message,
      conversationId: conversationId
    }).then(() => {
      setValue('message', '', { shouldValidate: true });
      setLoading(false)
    }).catch(() => {
      toast.error("Somthing went wrong");
      setLoading(false)
    })
  }

  // const handleUpload = (result: any) => {
  //   axios.post('/api/messages', {
  //     image: result.info.secure_url,
  //     conversationId: conversationId
  //   })
  // }

  return ( 
    <div 
      className="
        py-4 
        px-4 
        bg-transparent
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
        h-[10%]
      "
    >
      {/* <CldUploadButton 
        options={{ maxFiles: 1 }} 
        onUpload={handleUpload} 
        uploadPreset="pgc9ehd5"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton> */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput 
          id="message" 
          register={register} 
          errors={errors} 
          required 
          disabled={loading}
          placeholder={`Message @${OtherUser.name}`}
        />
      </form>
    </div>
  );
}
 
export default Form;