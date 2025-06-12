'use client';
import { ProductImage, QuantitySelector } from '@/components';
import { useCartStore } from '@/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {

    const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore((state) => state.cart);

    useEffect(() => {
      setLoaded(true);
    }, [])
    

    if (!loaded) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${ product.slug }-${ product.size }`} className="flex mb-5">
          <ProductImage
            src={ product.image }
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div className="">
            <Link href={`/product/${product.slug}`} className="underline">
               { product.size } - {product.title}
            </Link>
            <p>${product.price}</p>

            <QuantitySelector
              quantity={product.quantity}
              onQuantityChange={(quantity) => updateProductQuantity(product, quantity)}
            />
            <button onClick={ () => removeProduct(product) } className="underline mt-3">Remove</button>
          </div>
        </div>
      ))}
    </>
  );
};
