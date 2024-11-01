"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  loginValidator,
  type loginValidatorType,
} from "@/validators/login-validator";
import type { UserType } from "../../../../types";
import { Suspense } from "react";

const Login = () => {
  const router = useRouter();
  const setUser = useUser((state) => state.setUser);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<loginValidatorType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginValidator),
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: loginValidatorType) => {
      const { data } = await axios.post("/api/login", { ...values });

      return data as { isVerified: boolean; user: UserType; message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      if (!data.isVerified) {
        router.push(`/verify-email?email=${getValues("email")}`);
      } else {
        setUser(data.user);
        if (redirectTo) {
          router.replace(`/${redirectTo}`);
        } else {
          router.replace("/dashboard/projects");
        }
      }
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later");
      }
    },
  });
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Welcome back!</p>
        <p className="text-gray-700 text-sm">Login to your account</p>
      </div>

      <form
        className="flex flex-col gap-y-6 w-full"
        onSubmit={handleSubmit((data) => handleLogin(data))}
      >
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="email" className="ml-1">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            required
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-rose-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="password" className="ml-1">
            Password
          </Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            required
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-rose-600 text-sm">{errors.password.message}</p>
          )}

          <div className="flex justify-end">
            <Link
              href={"/forgot-password"}
              className="text-indigo-600 text-sm font-semibold hover:underline delay-100 transition-all"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Login"}
        </Button>
      </form>

      <div className="flex justify-center gap-x-2 items-center">
        <p>Don&apos;t have an account?</p>
        <Link
          href={"/signup"}
          className={`text-indigo-600 hover:underline font-semibold ${
            isPending ? "pointer-events-none" : ""
          }`}
        >
          Signup
        </Link>
      </div>
    </>
  );
};

const LoginPage = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
