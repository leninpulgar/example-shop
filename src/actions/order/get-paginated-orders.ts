'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma";

const PAGE_SIZE = 12;

export const getPaginatedOrders = async({ page = 1 }: { page?: number }) => {

    const session = await auth();

    if ( session?.user.role !== 'admin' ) {

        return {
            ok: false,
            message: "Must be authenticated.",
        }
    }

    // const orders = await prisma.order.findMany({
    //     orderBy: {
    //         createdAt: 'desc',
    //     },
    //     include: {
    //         OrderAddress: {
    //             select: {
    //                 firstName: true,
    //                 lastName: true,
    //             }
    //         }
    //     }
    // })


    // return {
    //     ok: true,
    //     orders: orders,
    // }
    const [orders, totalOrders] = await Promise.all([
        prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
            include: {
                OrderAddress: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        }),
        prisma.order.count()
    ]);

    const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

    return {
        ok: true,
        orders,
        currentPage: page,
        totalPages,
    }



}