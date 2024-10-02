"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Welcome!</p>
        <p className="text-gray-700 text-sm">Create an account</p>
      </div>

      <form className="flex flex-col gap-y-6 w-full">
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="name" className="ml-1">
            Name
          </Label>
          <Input id="name" placeholder="Enter your name" type="text" required />
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
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="confirmPassword" className="ml-1">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="Confirm your password"
            type="confirmPassword"
            required
          />
        </div>

        <Button type="submit">Signup</Button>
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
