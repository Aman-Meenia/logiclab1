"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const LoginButton = () => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session, "15151445454544");

  return (
    <>
      {session ? (
        <>
          <Image
            alt="profile"
            src={session.user?.image as string}
            className="rounded-full"
            width={80}
            height={80}
          />
          <h1 className="text-3xl text-green-500 font-bold">
            Welcome back, {session.user?.name}
          </h1>
          <p className="text-2xl font-semibold">{session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="border border-black rounded-lg bg-red-400 px-5 py-1"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-red-500 font-bold mb-3">
            You&apos;re not logged in
          </h1>
          <div className="flex space-x-5 gap-2">
            <button
              onClick={() => router.push("/login")}
              className="border border-black rounded-lg px-5 py-1 w-32"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="border border-black rounded-lg bg-green-500 px-5 py-1 w-32"
            >
              Sign Up
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default LoginButton;
