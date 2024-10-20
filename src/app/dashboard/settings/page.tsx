"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";

const Settings = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="mt-10 px-5 md:px-12 lg:px-28 xl:px-36 flex flex-col gap-y-8 pb-10">
      <DeleteConfirmationDialog
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        type="all-projects"
      />

      <div className="flex flex-col gap-y-3">
        <p className="text-4xl font-semibold text-indigo-600">Settings</p>
        <div className="w-full h-[0.5px] bg-black" />
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">Change Password</p>
            <p className="text-gray-700 text-xs sm:text-sm">
              Change your current password
            </p>
          </div>

          <Button asChild>
            <Link href={"/change-password"}>Change password</Link>
          </Button>
        </div>

        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">Delete Projects</p>
            <p className="text-gray-700 text-xs sm:text-sm">
              Delete all your projects{" "}
              <span className="text-rose-600 font-semibold">
                (This action is irreversible)
              </span>
            </p>
          </div>

          <Button variant={"destructive"} onClick={() => setIsVisible(true)}>
            Delete projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
