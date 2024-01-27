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

      if(user?.friend.some((friend: any) => friend.friendId != currentUser.id)){
        return NextResponse.error();
      }

      if(currentUser.friend.some((friend: any) => friend.friendId != friendId)){
        return NextResponse.error();
      }

      if(!user){
        return NextResponse.error();
      }

      const friend = await prisma.friend.deleteMany({
        where: { 
            OR: [
                {
                    friendId: friendId, 
                    userId: currentUser.id,
                },
                {
                    friendId: currentUser.id, 
                    userId: friendId,
                }
            ]
        },
      })


      await pusherServer.trigger(user.id, 'friend:delete', {
        friend: currentUser,
      })

      await pusherServer.trigger(currentUser.id, 'friend:delete', {
        friend: user,
      })

      return NextResponse.json(friend);
    }
    catch(err) {
        return NextResponse.error();
    }
}