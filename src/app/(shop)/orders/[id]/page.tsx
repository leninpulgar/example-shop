import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
// import { initialData } from "@/seed/seed";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";


// const productsInCart = [
//   initialData.products[0],
//   initialData.products[1],
//   initialData.products[2],
// ]


interface Props {
  params: Promise<{
    id: string
  }>;
}


export default async function Cart({ params }: Props) {

  const { id } = await params;

  // Todo: Llamar el server action

  const { ok, order } = await getOrderById(id);

  if ( !ok ) {
    redirect('/')
  }



  const address = order!.OrderAddress;




  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-10">
      

      <div className="flex flex-col w-[1000px]">
        
        <Title title={` Order #${ id.split('-').at(-1) }`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">

            {/* Payment status */}
            <OrderStatus isPaid={ order?.isPaid ?? false } />

            
            

          {/* Items */}
          {
            order!.OrderItem.map( (item) => {
              return(
                <div key={ item.product.slug + '-' + item.size } className="flex mb-5">
                <Image
                  src={ `/products/${ item.product.ProductImage[0].url }` }
                  width={ 100 }
                  height={ 100 }
                  style={{
                    width: '100px',
                    height: '100px'
                  }}
                  alt={`${ item.product.title } - ${ item.size }`}
                  className="mr-5 rounded"
                />
                <div className="">
                  <p>{`${ item.product.title } - ${ item.size }`}</p>
                  <p>${ item.price } x { item.quantity }</p>
                  <p className="font-bold">Subtotal: { currencyFormat(item.price * item.quantity) }</p>
                  
                </div>
              </div>
              )
            })
          }
          </div>


          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Shipping Address</h2>
            <div className="mb-10">
              <p className="text-xl">{ address!.firstName } { address!.lastName }</p>
              <p>{ address!.address }</p>
              <p>{ address!.address2 }</p>
              <p> { address!.postalCode } </p>
              <p>{ address!.city }, { address!.countryId }</p>
              <p>{ address!.phone }</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />




            <h2 className="text-2xl mb-2">Checkout</h2>
            
            <div className="grid grid-cols-2">
            <span>No. of Items</span>
                    <span className="text-right">
                        { order?.itemsInOrder === 1 ? `${ order?.itemsInOrder } Item` : `${ order?.itemsInOrder } Items` }
                    </span>
            
                    <span>Subtotal</span>
                    <span className="text-right">
                        { currencyFormat(order!.subTotal) }
                    </span>
            
                    <span>Taxes (%15)</span>
                    <span className="text-right">{ currencyFormat(order!.tax) }</span>
            
                    <span className="text-2xl mt-5">Total</span>
                    <span className="text-2xl mt-5 text-right">{ currencyFormat(order!.total) }</span>
          </div>

            <div className="mt-5 mb-2 w-full">

              {/* Payment status */}
              {
                order?.isPaid
                ? (
                  <OrderStatus isPaid={ order?.isPaid ?? false } />
                ) : (
                  <PayPalButton
                    amount={ order!.total }
                    orderId={ order!.id }
                  />
                )
              }

            </div>
          </div>

        </div>

        
      </div>
      


    </div>
  );
}