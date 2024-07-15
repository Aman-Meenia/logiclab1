"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/validation-schemas/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

const VerifyForgotPasswordPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const { username } = params;

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post("/api/verify-otp", {
        username,
        otp: data.otp,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/forgot-password/reset-password/" + username);
    } catch (error) {
      console.log("error verifying user account", error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Verification failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <>
      <div className="text-center">
        <p className="m-4">
          Enter the Verification OTP(One-Time Password) sent to your email
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="change username/email">
            <p
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => router.replace("/forgot-password")}
            >
              Want to change Username or Email?
            </p>
          </div>

          <Button className="w-full" type="submit" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Verify Otp"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default VerifyForgotPasswordPage;
