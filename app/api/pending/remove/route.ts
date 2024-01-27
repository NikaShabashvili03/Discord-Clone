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
        fromId,
        userId
      } = body;

      if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      
      const pending = await prisma.pending.deleteMany({
        where: {
            fromId: fromId,
            userId: userId
        }
      })

      return NextResponse.json(pending);
    }
    catch(err) {
        return NextResponse.error();
    }
}