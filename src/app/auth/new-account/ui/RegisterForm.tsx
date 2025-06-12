'use client'

import { login, registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link"
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormInputs = {
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {

    // const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('')

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async(data) => {
        setErrorMessage('');

        const { name, email, password } = data;
        
        // Server Action
        const resp = await registerUser( name, email, password );

        if ( !resp.ok ) {

            setErrorMessage(resp.message);
            return;
        }

        // Login the user after registration
        await login( email.toLowerCase(), password );
        window.location.replace('/'); // Redirect to home page after successful registration and login
        // router.replace('/');


    }


  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col">

        {/* {
            errors.name?.type === 'required' && (
                <span className="text-red-500 mb-2">* Name is required</span>
            )
        } */}

      <label htmlFor="email">Full Name</label>
        <input
          className={
            clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                "border-red-500": errors.name
            })
          }
          type="text" {...register('name', { required: true })} autoFocus />
        

        <label htmlFor="email">Email</label>
        <input
          className={
            clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                "border-red-500": errors.email
            })
          }
          type="email" {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />


        <label htmlFor="email">Password</label>
        <input
          className={
            clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                "border-red-500": errors.password
            })
          }
          type="password" {...register('password', { required: true, minLength: 6 })} />


        <span className="text-red-500 mb-2">{ errorMessage }</span>


        <button
          
          className="btn-primary">
          Sign in
        </button>


        {/* divisor l ine */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">Or</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth/login" 
          className="btn-secondary text-center">
          Login
        </Link>
        </form>
  )
}
