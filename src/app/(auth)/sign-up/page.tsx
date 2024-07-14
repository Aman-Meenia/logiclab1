"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signUpSchema } from "@/validation-schemas/validationSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaSquareGithub } from "react-icons/fa6";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const { data: session } = useSession();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          let message = response.data.message;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ||
              "Error occured while checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error signing up user", error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Sign Up failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white ">
            Sign Up to Logic Lab
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <span
                      className={`text-sm ${
                        usernameMessage !== "Username is available"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {usernameMessage}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="o-auth border-t border-solid border-gray-300 dark:border-gray-700 p-3">
          <p className="text-center mb-3">or Sign up with</p>
          <div className="flex justify-center gap-6 align-middle">
            <div
              onClick={() => signIn("google")}
              className="google h-11 flex cursor-pointer border border-solid border-black bg-white text-black rounded px-6 py-1 hover:bg-black hover:text-white hover:border-white"
            >
              <div className="mr-4 mt-1 h-fit">Google</div>
              <FcGoogle className="w-8 h-8 " />
            </div>
            <div
              onClick={() => signIn("github")}
              className="github h-11 flex cursor-pointer border border-solid border-white bg-black text-white rounded px-6 py-1 hover:bg-white hover:text-black hover:border-black"
            >
              <div className="mr-4 mt-1 h-fit">Github</div>
              <FaSquareGithub className="w-8 h-8 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
