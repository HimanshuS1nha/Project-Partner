"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  forgotPasswordValidator,
  type forgotPasswordValidatorType,
} from "@/validators/forgot-password-validator";

const ForgotPassword = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<forgotPasswordValidatorType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(forgotPasswordValidator),
  });

  const { mutate: handleForgotPassword, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: forgotPasswordValidatorType) => {
      const { data } = await axios.post("/api/forgot-password", { ...values });

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/forgot-password/verify?email=${getValues("email")}`);
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
        <p className="text-xl font-semibold">Forgot Password</p>
        <p className="text-gray-700 text-sm">Verify your email to continue</p>
      </div>

      <form
        className="flex flex-col gap-y-6 w-full"
        onSubmit={handleSubmit((data) => handleForgotPassword(data))}
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default ForgotPassword;
