"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoFolderOpen } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="h-[8vh] px-6 flex items-center justify-between">
      <div className="flex gap-x-10 items-center">
        <div className="flex gap-x-4 items-center">
          <p className="text-xl font-semibold">
            Project<span className="text-indigo-600 font-bold">Buddy</span>
          </p>
          <p className="text-gray-700">/</p>
          <div className="flex items-center gap-x-2">
            <div className="bg-indigo-600 w-8 h-8 rounded-full flex justify-center items-center">
              <p className="text-white">A</p>
            </div>
          </div>
        </div>

        <div className="flex gap-x-7">
          <Link
            href={"/dashboard/projects"}
            className={`flex gap-x-2 items-center relative ${
              pathname.includes("/dashboard/projects")
                ? ""
                : "hover:bg-indigo-100"
            } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
          >
            <IoFolderOpen color="black" size={23} />
            <p className="font-semibold">Projects</p>
            {pathname.includes("/dashboard/projects") && (
              <div className="w-full h-[3.5px] bg-indigo-600 absolute -bottom-2" />
            )}
          </Link>

          <Link
            href={"/dashboard/settings"}
            className={`flex gap-x-2 items-center relative ${
              pathname === "/dashboard/settings" ? "" : "hover:bg-indigo-100"
            } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
          >
            <IoMdSettings color="black" size={23} />
            <p className="font-semibold">Account Settings</p>
            {pathname === "/dashboard/settings" && (
              <div className="w-full h-[3.5px] bg-indigo-600 absolute -bottom-2" />
            )}
          </Link>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="bg-indigo-600 w-8 h-8 rounded-full flex justify-center items-center">
            <p className="text-white">A</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="focus:bg-rose-600 focus:text-white cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
