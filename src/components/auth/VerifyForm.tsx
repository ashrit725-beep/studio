"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { verifyCode } from "@/actions/auth";

const formSchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 digits." }),
});

export default function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email not found. Please sign up again.",
      });
      router.push("/signup");
      return;
    }

    setIsLoading(true);

    const result = await verifyCode({ email, code: values.code });

    if (result.success) {
      toast({
        title: "Account Verified!",
        description: "You have successfully created your account. Please log in.",
      });
      router.push("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: result.error,
      });
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to {email}. The code expires in 10 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
