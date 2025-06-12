export const revalidate = 60; // 1 minute

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components"
import { redirect } from "next/navigation";


interface Props {
  searchParams: Promise<{ page?: string }>
}


export default async function Home({ searchParams }: Props) {
  // 1. Espera a que la Promise se resuelva
  const resolvedSearchParams = await searchParams;

  console.log(resolvedSearchParams);

  const page  = resolvedSearchParams.page ? parseInt( resolvedSearchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });

  console.log( { currentPage, totalPages })

  if ( products.length === 0 ) {
    // return (
    //   <div className="flex flex-col items-center justify-center h-screen">
    //     <h1 className="text-2xl font-bold">No hay productos</h1>
    //   </div>
    // )
    redirect("/");
  }

  return (
    <>
    <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

    <ProductGrid products={ products } />

    <Pagination totalPages={ totalPages } currentPage={ currentPage } />
    </>
  )
}