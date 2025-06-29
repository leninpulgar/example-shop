'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async( userId: string, role: string ) => {


    const session = await auth();

    if ( session?.user.role !== 'admin' ) {
        return {
            ok: false,
            message: 'You are not an admin.',
        }
    }


    try {

        const newRole = role === 'admin' ? 'admin' : 'user';


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role: newRole
            }
        });

        revalidatePath('/admin/users');

        return {
            ok: true,
            // user: user,
        }


        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error changing user role.',
        }
    }

}