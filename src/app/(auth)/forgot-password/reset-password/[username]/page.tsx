"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  resetPasswordSchema,
  verifySchema,
} from "@/validation-schemas/validationSchema";
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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const { username } = params;
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsResetting(true);
      const response = await axios.post("/api/reset-password", {
        username,
        password: data.password,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.push("/login");
      } else {
        toast({
          title: "Reset Password Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error resetting password", error);

      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Reset Password Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };
  return (
    <>
      <div className="text-justify text-[14px] bg-[#FFFFE0] text-black p-4 border border-solid border-[#E6DB55] rounded">
        Reset your password. Please enter your new password.
      </div>
      <Form {...form}>
        <form
          id="form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
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
                    placeholder="Confirm New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isResetting}>
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ResetPasswordPage;
