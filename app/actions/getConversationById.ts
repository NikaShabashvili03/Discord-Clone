import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUserByIdParams {
    conversationId: string,
}


export default async function getConversationById(  
    params: IUserByIdParams
) {
  try {
    const {
        conversationId
    } = params;
    const currentUser = await getCurrentUser();
    
    if(!currentUser){
        return null
    }

    if(!conversationId){
        return null
    }
    
    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId
        },
        include: {
            users: {
                where: {
                    id: {
                        not: currentUser.id
                    }
                },
                include: {
                    pending: true
                }
            }
        }
    })

    return conversation
  } catch (err) {
    return null
  }
}
