import { Title } from "@/components";
import Link from "next/link";
// import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";




export default function Cart() {


  // if (productsInCart.length === 0) {
  //   redirect('/empty')
  // }




  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-10">
      

      <div className="flex flex-col w-[1000px]">
        
        <Title title="Cart" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Add more items</span>
            <Link href="/" className="underline mb-5">
              Continue shopping
            </Link>
          

          {/* Items */}
          <ProductsInCart />
          </div>


          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Checkout</h2>
            
            <OrderSummary />

            <div>
              <Link className="flex btn-primary justify-center mt-5 mb-2 w-full" href="/checkout/address">
                Checkout
              </Link>
            </div>
          </div>

        </div>

        
      </div>
      


    </div>
  );
}