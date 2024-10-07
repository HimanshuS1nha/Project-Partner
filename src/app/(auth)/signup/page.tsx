"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  signupValidator,
  type signupValidatorType,
} from "@/validators/signup-validator";

const Signup = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<signupValidatorType>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(signupValidator),
  });

  const { mutate: handleSignup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (values: signupValidatorType) => {
      if (values.confirmPassword !== values.password) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post("/api/signup", { ...values });
      
      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
      router.push("/verify-email");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    },
  });
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Welcome!</p>
        <p className="text-gray-700 text-sm">Create an account</p>
      </div>

      <form
        className="flex flex-col gap-y-6 w-full"
        onSubmit={handleSubmit((data) => handleSignup(data))}
      >
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="name" className="ml-1">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            required
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-rose-600 text-sm">{errors.name.message}</p>
          )}
        </div>
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
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="confirmPassword" className="ml-1">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            required
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && (
            <p className="text-rose-600 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Signup"}
        </Button>
      </form>

      <div className="flex justify-center gap-x-2 items-center">
        <p>Already have an account?</p>
        <Link
          href={"/login"}
          className="text-indigo-600 hover:underline font-semibold"
        >
          Login
        </Link>
      </div>
    </>
  );
};

export default Signup;
