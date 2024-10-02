"use client";

import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="mt-10 px-36 flex flex-col gap-y-8 pb-10">
      <div className="flex flex-col gap-y-3">
        <p className="text-4xl font-semibold text-indigo-600">Settings</p>
        <div className="w-full h-[0.5px] bg-black" />
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">Change Password</p>
            <p className="text-gray-700 text-sm">
              Change your current password
            </p>
          </div>

          <Button>Change password</Button>
        </div>

        <div className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-y-1">
            <p className="text-lg font-semibold">Delete Projects</p>
            <p className="text-gray-700 text-sm">
              Delete all your projects{" "}
              <span className="text-rose-600 font-semibold">
                (This action is irreversible)
              </span>
            </p>
          </div>

          <Button variant={"destructive"}>Delete projects</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
