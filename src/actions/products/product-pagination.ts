'use server';

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages =  async({
    page = 1,
    take = 12,
    gender
}: PaginationOptions) => {

    if( isNaN( Number(page) )) page = 1;
    if( page < 1 ) page = 1;


    try {
        // 1. Obtenemos la cantidad total de productos
        const products = await prisma.product.findMany({
            // take: take,
            // skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    },
                },
            },
            skip: (page - 1) * take,
            take: take,

            //! Por género
            where: {
                gender: gender
            }
        });

        // 2. Obtener el total de páginas
        // todo:
        const totalCount = await prisma.product.count({
            where: {
                gender: gender
            }
        })
        const totalPages = Math.ceil(totalCount / take);

        // console.log(products);

        return {
            currentPage: page,
            totalPages: totalPages,
            totalItems: products.length,
            products: products.map((product) => ({
                ...product,
                images: product.ProductImage.map((image) => image.url)
            }))
        };
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error("Error al obtener los productos");
    }

}