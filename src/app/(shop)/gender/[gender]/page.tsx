export const revalidate = 60; // 1 minute

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";
// import { initialData } from "@/seed/seed";
// import { Category } from "@/interfaces";
// import { notFound } from "next/navigation";

// const seedProducts = initialData.products;

interface Props {
  params: Promise<{
    gender: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Category({ params, searchParams }: Props) {
  // const products = seedProducts.filter((product) => product.gender === id);
  const { gender } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;
  // const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  console.log({ currentPage, totalPages });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const labels: Record<string, string> = {
    men: "Men",
    women: "Women",
    kid: "Kids",
    unisex: "All",
  };

  // if( id === 'kids' ) {
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`${labels[gender]} products`}
        subtitle={`Todos los productos de ${gender}`}
        className="mb-2"
      />

      <ProductGrid products={products} />
      <Pagination totalPages={ totalPages } currentPage={ currentPage } />
    </>
  );
}
