"use client";


import { setUserAddress, removeUserAddress } from "@/actions";
import type { Country, Address } from "@/interfaces";
import { useAddressStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
}

interface Props {
  countries: Country[];
  userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {

  const router = useRouter();

    const { handleSubmit, register, formState: { isValid }, reset  } = useForm<FormInputs>({
        defaultValues: {
            // Did: leer de la base de datos
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(userStoredAddress as any),
            rememberAddress: false,
        }
    });

    const { data: session } = useSession({
      required: true,
    })

    const setAddress = useAddressStore( state => state.setAddress );
    const address = useAddressStore( state => state.address );


    useEffect(() => {
      if( address.firstName) {
        reset(address);
      }
    }, [address, reset]);



    const onSubmit = async( data: FormInputs ) => {
        // console.log("data: ", data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rememberAddress, ...rest } = data;
        setAddress(rest);

        if ( data.rememberAddress ) {
          // Did: server action
          await setUserAddress(data, session!.user.id)
        } else {
          // Did: server action
          await removeUserAddress(session!.user.id)
        }

        router.push('/checkout');
    }


  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
      <div className="flex flex-col mb-2">
        <span>Name</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'firstName' , { required: true})} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Last Name</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'lastName' , { required: true})} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'address' , { required: true})} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Address 2 (opcional)</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'address2')} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Postal Code</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'postalCode' , { required: true})} />
      </div>

      <div className="flex flex-col mb-2">
        <span>City</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register( 'city' , { required: true})} />
      </div>

      <div className="flex flex-col mb-2">
        <span>Country</span>
        <select className="p-2 border rounded-md bg-gray-200" { ...register( 'country' , { required: true})}>
          <option value="">[ Seleccione ]</option>
          {
            countries.map( country => (
              <option key={ country.id } value={ country.id }>
                { country.name }
              </option>
            ))
          }
          <option value="CRI">Costa Rica</option>
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span>Phone</span>
        <input type="text" className="p-2 border rounded-md bg-gray-200" { ...register('phone', { required: true })} />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        <div className="inline-flex items-center mb-10">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              { ...register('rememberAddress') }
            //   checked
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>

          <span className="ml-2 text-sm">Remember address</span>
        </div>

        <button
        disabled={ !isValid }
        //   href="/checkout"
          type="submit"
        //   "btn-primary flex w-full sm:w-1/2 justify-center"
          className={ clsx(
            {
                "btn-primary": isValid,
                "btn-disabled": !isValid
            }
          )}
        >
          Next
        </button>
      </div>
    </form>
  );
};
