"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateNewPassword = () => {
  return (
    <>
      <div className="flex flex-col items-start">
        <p className="text-xl font-semibold">Forgot Password</p>
        <p className="text-gray-700 text-sm">Create new password</p>
      </div>

      <form className="flex flex-col gap-y-6 w-full">
        <div className="flex flex-col gap-y-2.5">
          <Label htmlFor="newPassword" className="ml-1">
            New Password
          </Label>
          <Input
            id="newPassword"
            placeholder="Enter your new password"
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
            placeholder="Confirm your new password"
            type="password"
            required
          />
        </div>

        <Button type="submit">Create Password</Button>
      </form>
    </>
  );
};

export default CreateNewPassword;
