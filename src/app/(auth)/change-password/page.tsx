"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  changePasswordValidator,
  type changePasswordValidatorType,
} from "@/validators/change-password-validator";

const ChangePassword = () => {
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<changePasswordValidatorType>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(changePasswordValidator),
  });

  const { mutate: handleChangePassword, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (values: changePasswordValidatorType) => {
      if (values.newPassword !== values.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post("/api/change-password", { ...values });

      return data as { message: string };
    },
    onSuccess: (data) => {
      reset();
      toast.success(data.message);
      router.replace("/dashboard/projects");
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
        <p className="text-xl font-semibold">Welcome back!</p>
        <p className="text-gray-700 text-sm">Change your password</p>
      </div>

      <form
        className="flex flex-col gap-y-6 w-full"
        onSubmit={handleSubmit((data) => handleChangePassword(data))}
      >
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="oldPassword" className="ml-1">
            Old Password
          </Label>
          <Input
            id="oldPassword"
            placeholder="Enter your old password"
            type="password"
            required
            {...register("oldPassword", { required: true })}
          />
          {errors.oldPassword && (
            <p className="text-rose-600 text-sm">
              {errors.oldPassword.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="newPassword" className="ml-1">
            New Password
          </Label>
          <Input
            id="newPassword"
            placeholder="Enter your new password"
            type="password"
            required
            {...register("newPassword", { required: true })}
          />
          {errors.newPassword && (
            <p className="text-rose-600 text-sm">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="confirmPassword" className="ml-1">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="Confirm your new password"
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
          {isPending ? "Please wait..." : "Change Password"}
        </Button>
      </form>
    </>
  );
};

export default ChangePassword;
