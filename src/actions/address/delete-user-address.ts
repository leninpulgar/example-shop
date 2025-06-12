'use server'

import prisma from "@/lib/prisma";

// Delete user address

export const removeUserAddress = async(userId: string) => {

    //  const address = await prisma.userAddress.findUnique({
    //         where: { userId }
    //     });

    try {

        const userAddress = await prisma.userAddress.delete({
            // where: {
            //     id: address?.id,
            // }
            where: { userId }
        })
        console.log(userAddress);
        return { ok: true }
        
    } catch (error) {
        console.log(error);
        return{
            ok: false,
            message: 'Error deleting user address',
        }
    }
}