export const revalidate = 10080; // 7 days


import { getProductBySlug } from "@/actions";
import { ProductMobileSlideshow, ProductSlideshow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
// import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: Promise<{
    slug: string
  }>;
}

export async function generateMetadata(
  { params }: Props,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
 
  // fetch post information
  const product = await getProductBySlug(slug);
 
  return {
    title: product?.title ?? 'Product not found',
    description: product?.description ?? 'Description not found',
    openGraph: {
      title: product?.title ?? 'Product not found',
      description: product?.description ?? 'Description not found',
      images: [`/products/${ product?.images[1] }`],
    },
  }
}



export default async function ProductPage({ params }: Props) {

  const { slug } = await params;
  // const product = initialData.products.find((product) => product.slug === slug);
  const product = await getProductBySlug(slug);
  // console.log('product', product);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">

        {/* Mobile Slideshow */}
        <ProductMobileSlideshow title={ product.title } images={ product.images } className="block md:hidden" />


        {/* Desktop Slideshow */}
        <ProductSlideshow title={ product.title } images={ product.images } className="hidden md:block" />

      </div>

      {/* Product details */}
      <div className="col-span-1 px-5">

        <StockLabel slug={ product.slug } />

        <h1 className={` ${ titleFont.className } antialiased font-bold text-xl`}>
          { product.title }
        </h1>
        <p className="text-lg mb-5">
          ${ product.price }
        </p>

        <AddToCart product={ product } />

        {/* Description */}
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">
          { product.description }
        </p>
        
      </div>

    </div>
  );
}