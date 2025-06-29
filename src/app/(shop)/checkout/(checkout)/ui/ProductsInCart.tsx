'use client';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {

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
          <Image
            src={`/products/${product.image}`}
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

            <span>
               { product.size } - {product.title} ({ product.quantity })
            </span>

            <p className="font-bold">{ currencyFormat(product.price * product.quantity) }</p>

          </div>
        </div>
      ))}
    </>
  );
};
