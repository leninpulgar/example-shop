'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


export const getOrderById = async ( id: string ) => {
    
    const session = await auth();
    const userId = session?.user.id;
    // Verificar sesión de usuario
    if (!userId) {
        return {
        ok: false,
        message: "Must be authenticated.",
        };
    }


    try {
        
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });

        if ( !order ) throw `${ id } not found.`;

        if ( session.user.role === 'user' ) {
            if ( session.user.id !== order.userId ) {
                throw `${ id } doesn't belong to user.`
            }
        } 



        return {
            ok: true,
            order: order,
        }


    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Order not found.",
        }
    }
    
}