'use server';

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {

    try {

        const product = await prisma.product.findFirst({
            include: {
                // ProductImage: {
                //     select: {
                //         url: true,
                //         id: true,
                //     }
                // }
                ProductImage: true,
            },
            where: {
                slug: slug,
            }
        })

        if (!product) return null;

        return {
            ...product,
            images: product.ProductImage.map((image) => image.url),
        }

        
    } catch (error) {
        console.log('Error fetching product by slug:', error);
        throw new Error('Failed to fetch product by slug');
    }

}