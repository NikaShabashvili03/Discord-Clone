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
        username,
      } = body;

      if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
      })

      if(!user){
        return NextResponse.error();
      }

      if(user.id == currentUser.id){
        return NextResponse.error();
      }

      const pendings = await prisma.pending.findMany({
        where: {
          OR: [
            {
              fromId: currentUser.id,
              userId: user.id,
            },
            {
              fromId: user.id,
              userId: currentUser.id,
            }
          ]
        }
      })

      const friends = await prisma.friend.findMany({
        where: {
          OR: [
            {
              friendId: currentUser.id,
              userId: user.id,
            },
            {
              friendId: user.id,
              userId: currentUser.id,
            }
          ]
        }
      })

      if(friends.length > 0){
        return NextResponse.error();
      }

      if(pendings.length > 0) {
        return NextResponse.error();
      }
      
      const pending = await prisma.pending.create({
        data: {
            userId: user.id,
            fromId: currentUser.id
        }
      })

      await pusherServer.trigger(user.id, 'pending:new', {
        from: currentUser,
      })

      return NextResponse.json(pending);
    }
    catch(err) {
        return NextResponse.error();
    }
}