import { getServerSession } from "next-auth/next"
import prisma from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";


export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include: {
        pending: {
          include: {
            from: {
              include: {
                conversations: true
              }
            }
          }
        },
        friend: {
          include: {
            friend: {
              include: {
                conversations: true
              }
            }
          }
        }
      }
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
}

