
import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser'

export default async function getAllUsers() {
    try {
        const currentUser = await getCurrentUser();

        if(!currentUser){
            return null
        }

        const allUsers = await prisma.user.findMany({
            where: {
                NOT: {
                    id: currentUser.id
                }
            }
        })

        return allUsers
    } catch (error) {
        return null
    }
}

