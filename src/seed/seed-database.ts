// import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { initialData } from './seed';
import { countries } from './seed-countries';


async function main() {

    // 1. Borrar registros previos
    // await Promise.all([


        await prisma.orderAddress.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();


        await prisma.userAddress.deleteMany();
        await prisma.user.deleteMany();
        await prisma.country.deleteMany();


        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    // ])

    const { categories, products, users } = initialData;

    await prisma.user.createMany({
        data: users
    });

    // Crear una sola categoria
    // await prisma.category.createMany({
    //     data: {
    //         name: 'Shirts',
    //     }
    // })
    // 2. Crear categorias
    const categoriesData = categories.map( (name: string) => ({ name }))
    
    await prisma.category.createMany({
        data: categoriesData
    })

    await prisma.country.createMany({
        data: countries
    })
    


    // Relacionar categorias con ids de productos, es decir nombredecategoria: 'idcategoria'
    const categoriesDB = await prisma.category.findMany();
    
    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLowerCase()] = category.id;

        return map;

    }, {} as Record<string, string>); // <string =shirt, categoryId>

    // console.log(categoriesMap);

    // 3. Crear productos

    // Una sola inserción de producto
    // const { images, type, ...product1 } = products[0];
    // await prisma.product.create({
    //     data: {
    //         ...product1,
    //         categoryId: categoriesMap['shirts'],
    //         }
    // })

    products.forEach( async(product) => {
        // Hago una desestructuring del producto
        const { images, type, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        })

        // Crear las imagenes del producto
        const imagesData = images.map( image => ({
            url: image,
            productId: dbProduct.id
        }));

        await prisma.productImage.createMany({
            data: imagesData
        })

    })

            

    console.log('Seed ejecutado correctamente');
}



// Función anononima autoinvocada
(() => {

    // Evitar que se ejecute en producción
    if(process.env.NODE_ENV === 'production') return;

    main();
})();