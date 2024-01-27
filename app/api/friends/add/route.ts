import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { pusherServer } from '@/app/libs/pusher'
import prisma from '@/app/libs/prismadb'

export async function POST(
    request: Request,
  ) {
    try {
      const currentUser = await getCurrentUser();
      const body = await request.json();

      const {
        friendId,
        fromId,
        userId
      } = body;

      if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      
      const user = await prisma.user.findUnique({
        where: {
            id: friendId,
        },
        include: {
            friend: true
        }
      })

      if(user?.friend.some((friend: any) => friend.friendId == currentUser.id)){
        return NextResponse.error();
      }

      if(currentUser.friend.some((friend: any) => friend.friendId == friendId)){
        return NextResponse.error();
      }

      if(!user){
        return NextResponse.error();
      }

      const friend = await prisma.friend.createMany({
        data: [
            { friendId: currentUser.id, userId: friendId },
            { friendId: friendId, userId: currentUser.id }, 
          ]
      })

      await prisma.pending.deleteMany({
        where: {
            fromId: fromId,
            userId: userId
        }
      })

      // Create Conversation

      const existingConversations = await prisma.conversation.findMany({
        where: {
          OR: [
            {
              userIds: {
                equals: [currentUser.id, user.id]
              }
            },
            {
              userIds: {
                equals: [user.id, currentUser.id]
              }
            }
          ]
        }
      });
  
      const singleConversation = existingConversations[0];
  
      if (singleConversation) {
        return NextResponse.json(singleConversation);
      }
  
      const newConversation = await prisma.conversation.create({
        data: {
          users: {
            connect: [
              {
                id: currentUser.id
              },
              {
                id: user.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      });
  
      // Update all connections with new conversation
      newConversation.users.map((user) => {
        if (user.id) {
          pusherServer.trigger(user.id, 'conversation:new', newConversation);
        }
      });
  

      pusherServer.trigger(user.id, 'friend:new', {
        friend: currentUser,
      })

      pusherServer.trigger(currentUser.id, 'friend:new', {
        friend: user,
      })

      return NextResponse.json(friend);
    }
    catch(err) {
        return NextResponse.error();
    }
}