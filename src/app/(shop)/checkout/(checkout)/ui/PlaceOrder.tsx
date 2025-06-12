"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);


    const address = useAddressStore( state => state.address );

    const { subTotal, tax, total, itemsInCart } = useCartStore(useShallow((state) => state.getSummaryInformation()));
    

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore( state => state.clearCart );


    // Evitar discrepancia entre lo que se genera de servidor y cliente
    useEffect(() => {
        setLoaded(true);
    }, []);


    const onPlaceOrder = async() => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map( product => ({
          productId: product.id,
          quantity: product.quantity,
          size: product.size
        }))

        // Server Action
        const res = await placeOrder( productsToOrder, address);
        if ( !res.ok ) {
          setIsPlacingOrder(false);
          setErrorMessage(res.message);
          return;
        }

        // Aqui todo salió bien
        clearCart();
        router.replace('/orders/' + res.order?.id );


        // setIsPlacingOrder(false);
    }


    if( !loaded ) {
        return <p>Loading...</p>
    }


  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Shipping Address</h2>
      <div className="mb-10">
        <p className="text-xl">{ address.firstName } { address.lastName }</p>
        <p>{ address.address }</p>
        <p>{ address.address2 }</p>
        <p> { address.postalCode } </p>
        <p>{ address.city }, { address.country }</p>
        <p>{ address.phone }</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Checkout</h2>

      <div className="grid grid-cols-2">
        <span>No. of Items</span>
                <span className="text-right">
                    { itemsInCart === 1 ? `${ itemsInCart } Item` : `${ itemsInCart } Items` }
                </span>
        
                <span>Subtotal</span>
                <span className="text-right">
                    { currencyFormat(subTotal) }
                </span>
        
                <span>Taxes (%15)</span>
                <span className="text-right">{ currencyFormat(tax) }</span>
        
                <span className="text-2xl mt-5">Total</span>
                <span className="text-2xl mt-5 text-right">{ currencyFormat(total) }</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        {/* Disclaimer */}
        <p className="mb-5">
          <span className="text-xs">
            When clicking &quot;Submit order&quot; you agree to our{" "}
            <Link className="underline" href="/">
              Terms and Conditions and Privacy Policy
            </Link>
            .
          </span>
        </p>

        {/* Place order */}
        <p className="text-red-500">{ errorMessage }</p>
        <button
        //   href="/orders/123"
          onClick={ onPlaceOrder }
          className={
            clsx({
              'btn-primary' : !isPlacingOrder,
              'btn-disabled' : isPlacingOrder
            })
          }
        >
          Submit order
        </button>
      </div>
    </div>
  );
};
