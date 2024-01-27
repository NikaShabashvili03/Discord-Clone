import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { SafeConversations, SafeUser } from "../types";

interface useOtherUserProps {
    conversation: SafeConversations, 
    currentUser: SafeUser
}
const useOtherUser = ({conversation, currentUser}: useOtherUserProps) => {

  const otherUser = useMemo(() => {
    const otherUser = conversation.users.filter((user) => user.id !== currentUser.id);

    return otherUser[0];
  }, [currentUser]);

  return otherUser;
};

export default useOtherUser;
