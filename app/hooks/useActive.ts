'use client'
import { useMemo, useState } from "react";
import useActiveList from "../hooks/useActiveList";


interface useActiveProps {
    email: any,
}

export default function useActive({email}: useActiveProps) {
  const { members } = useActiveList();
  const isActive = members.indexOf(email!) !== -1;
  
  const statusText = useMemo(() => {

    return isActive ? true : false
  }, [isActive]);

  return statusText
}
