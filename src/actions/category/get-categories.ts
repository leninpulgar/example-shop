'use server';

import prisma from "@/lib/prisma";

export const getCategories = async () => {

    try {

        const category = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        })
        
        return category;

        
    } catch (error) {
        console.log(error);
        return  [];
    }

}