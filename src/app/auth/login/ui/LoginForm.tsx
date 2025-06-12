"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/actions";
import { IoInformationOutline } from "react-icons/io5";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";



export const LoginForm = () => {

  const router = useRouter();
  const [state, dispatch] = useActionState(authenticate, undefined);

  // console.log("state: ", state);

  useEffect( () => {
    if (state === "Success") {
      // Revalidate session on the client
      signIn();
      // Redirect to home page after successful login
      router.replace("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state] );

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        name="email"
        type="email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        name="password"
        type="password"
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {state === "CredentialsSignin" && (
          <div className="flex flex-row mb-3">
            <IoInformationOutline className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">Invalid credentials</p>
          </div>
        )}
      </div>

      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">Or</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Create new account
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={ clsx({
      "btn-primary": !pending,
      "btn-disabled": pending
    })}
      disabled={pending}>
      Login
    </button>
  );
}
