"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoFolderOpen, IoMenuOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Loader from "../ui/loader";
import { useUser } from "@/hooks/useUser";

import type { UserType } from "../../../types";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { setUser, user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["is-logged-in"],
    queryFn: async () => {
      const { data } = await axios.get("/api/is-logged-in");
      return data as { user: UserType };
    },
  });

  const { mutate: handleLogout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const { data } = await axios.get("/api/logout");

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["is-logged-in"] });
      setUser(null);
      toast.success(data.message);
      router.replace("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later");
      }
    },
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      setUser(null);
    }
  }, [error, setUser]);
  return (
    <nav className="h-[8vh] px-6 flex items-center justify-between">
      <div className="flex gap-x-10 items-center">
        <div className="flex gap-x-4 items-center">
          <p className="text-xl font-bold">
            Project<span className="text-indigo-600 font-bold">Buddy</span>
          </p>
          <p className="text-gray-700 hidden md:block">/</p>
          <div className="hidden md:flex items-center gap-x-2">
            {isLoading ? (
              <Loader size="sm" />
            ) : (
              <div className="bg-indigo-600 w-8 h-8 rounded-full flex justify-center items-center">
                <p className="text-white">{user?.name?.[0]}</p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-x-7">
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

      <div className="flex items-center gap-x-5">
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="bg-indigo-600 w-8 h-8 rounded-full flex justify-center items-center">
                <p className="text-white">{user?.name?.[0]}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                My Account{" "}
                <span className="text-indigo-600 font-bold">
                  ({user?.planType} Plan)
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.planType === "Pro" ? (
                <DropdownMenuItem className="cursor-pointer">
                  Manage Subscription
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={"/pricing"}>Upgrade Plan</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={"/change-password"}>Change Password</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-rose-600 focus:text-white cursor-pointer"
                onClick={() => handleLogout()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Sheet>
          <SheetTrigger>
            <IoMenuOutline
              size={30}
              color="black"
              className="block lg:hidden"
            />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <p className="text-xl font-bold">
                  Project
                  <span className="text-indigo-600 font-bold">Buddy</span>
                </p>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-y-4 mt-6">
              <SheetClose asChild>
                <Link
                  href={"/dashboard/projects"}
                  className={`flex gap-x-2 items-center ${
                    pathname.includes("/dashboard/projects")
                      ? "text-indigo-600"
                      : "hover:bg-indigo-100"
                  } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
                >
                  <IoFolderOpen
                    color={
                      pathname.includes("/dashboard/projects")
                        ? "blue"
                        : "black"
                    }
                    size={23}
                  />
                  <p className="font-semibold">Projects</p>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href={"/dashboard/settings"}
                  className={`flex gap-x-2 items-center ${
                    pathname === "/dashboard/settings"
                      ? "text-indigo-600"
                      : "hover:bg-indigo-100"
                  } p-1.5 cursor-pointer delay-100 transition-all rounded-lg`}
                >
                  <IoMdSettings
                    color={
                      pathname === "/dashboard/settings" ? "blue" : "black"
                    }
                    size={23}
                  />
                  <p className="font-semibold">Account Settings</p>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
