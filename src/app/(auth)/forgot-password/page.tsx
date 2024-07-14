"use client";
import { useToast } from "@/components/ui/use-toast";
import { forgotPasswordSchema } from "@/validation-schemas/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  //zod implementation
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onIdentifierSubmit = async (
    data: z.infer<typeof forgotPasswordSchema>
  ) => {
    try {
      setIsSending(true);
      const response = await axios.post("/api/find-account-and-send-otp", {
        identifier: data.identifier,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        console.log(
          "success sending verification to associated email",
          response.data
        );
        router.push(`/forgot-password/verify/${response.data.data.username}`);
      } else {
        toast({
          title: "Error Sending Verification Code",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error sending verification to associated email", error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error Sending Verification Code",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="text-justify text-[14px] bg-[#FFFFE0] text-black p-4 border border-solid border-[#E6DB55] rounded">
        Enter your e-mail address or username associated with your account
        below, and we&apos;ll send you a verification code to your e-mail
        address. Once verified, you’ll be allowed to reset your password.
      </div>
      <Form {...form}>
        <form
          id="form"
          onSubmit={form.handleSubmit(onIdentifierSubmit)}
          className="space-y-8"
        >
          <FormField
            name="identifier"
            control={form.control}
            render={({ field: identifierField }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    id="identifier"
                    placeholder="Username or Email"
                    {...identifierField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ForgotPasswordPage;
