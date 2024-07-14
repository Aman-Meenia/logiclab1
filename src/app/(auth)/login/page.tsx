"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/validation-schemas/validationSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LinkedinIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaSquareGithub, FaSquareXTwitter } from "react-icons/fa6";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    if (response?.error) {
      toast({
        title: "Login failed",
        description: "Incorrect Credentials Provided",
        variant: "destructive",
      });
    }

    if (response?.url) {
      router.replace("/");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white ">
            Login to your Logic Lab Account!
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Username or Email" {...field} />
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
            <div className="forgot-password">
              <Link
                className="text-blue-500 hover:text-blue-700"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="o-auth border-t border-solid border-gray-300 dark:border-gray-700 p-3">
          <p className="text-center mb-3">or Login with</p>
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
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:text-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
