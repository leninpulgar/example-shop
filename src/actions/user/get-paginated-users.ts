'use server'
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


const PAGE_SIZE = 12;


export const getPaginatedUsers = async({ page = 1 }: { page?: number }) => {

    const session = await auth();

    if ( !session ) {
        return {
            ok: false,
            message: 'Must be an admin user.'
        }
    }

    const [ users, totalUsers ] = await Promise.all([

        prisma.user.findMany({
            orderBy: {
                name: 'desc'
            },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.user.count()
    ]);

    const totalUsersPages = Math.ceil(totalUsers / PAGE_SIZE);


    return {
        ok: true,
        users: users,
        currentPage: page,
        totalPages: totalUsersPages,
    }

}