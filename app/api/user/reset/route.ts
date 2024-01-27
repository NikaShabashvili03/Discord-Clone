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
        name,
        email,
        image,
        cover
      } = body;

      if (!currentUser?.id || !currentUser?.email) {
        return new NextResponse('Unauthorized', { status: 401 });
      }

      const updatedUser = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            name: name,
            email: email,
            image: image,
            cover: cover,
        }
      })

      return NextResponse.json(updatedUser);
    }
    catch(err) {
        return NextResponse.error();
    }
}