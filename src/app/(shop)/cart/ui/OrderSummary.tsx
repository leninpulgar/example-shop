"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";



export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false);
    // const { itemsInCart, subTotal, tax, total } = useCartStore((state) => state.getSummaryInformation());
    const { subTotal, tax, total, itemsInCart } = useCartStore(useShallow((state) => state.getSummaryInformation()));

    useEffect(() => {
       setLoaded(true);
    }, []);

    if (!loaded) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }


  return (
    <>
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
    </>
  );
};
