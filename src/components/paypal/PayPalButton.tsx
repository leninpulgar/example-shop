'use client'
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";


interface Props {
    orderId: string;
    amount: number;
}



export const PayPalButton = ({ orderId, amount }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = ( Math.round(amount * 100) / 100 )


    if ( isPending ) {
        return (
            <div className="animate-pulse mb-10">
                <div className="h-9 bg-gray-300 rounded mb-2"></div>
                <div className="h-9 bg-gray-300 rounded mb-2"></div>
                <div className="h-9 bg-gray-300 rounded"></div>
            </div>
        )
    }


    const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${ roundedAmount }`,
                        currency_code: 'USD'
                    },
                }
            ]
        });
        
        
        
        const { ok } = await setTransactionId( orderId, transactionId )

        

        if( !ok ) {
            throw new Error('Order could not be updated.')
        }
        


        return transactionId;
    }

    const onApprove = async( data: OnApproveData, actions: OnApproveActions ) => {

        const details = await actions.order?.capture();
        if( !details || !details.id ) return;

        await paypalCheckPayment( details.id );


    }



  return (
    <div className="relative z-0">
        <PayPalButtons
            createOrder={ createOrder }
            onApprove={ onApprove }
        />
    </div>
  )
}
