"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Welcome back!</p>
        <p className="text-gray-700 text-sm">Login to your account</p>
      </div>

      <form className="flex flex-col gap-y-6 w-full">
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="email" className="ml-1">
            Email
          </Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            required
          />
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
          />
        </div>

        <Button type="submit">Login</Button>
      </form>

      <div className="flex justify-center gap-x-2 items-center">
        <p>Don&apos;t have an account?</p>
        <Link
          href={"/signup"}
          className="text-indigo-600 hover:underline font-semibold"
        >
          Signup
        </Link>
      </div>
    </>
  );
};

export default Login;
