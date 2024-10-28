"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { IoMenuOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useUser } from "@/hooks/useUser";

import type { UserType } from "../../../types";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const { data, error } = useQuery({
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
    onSuccess: (data) => {
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

  const { mutate: handleCreateBillingPortalSession } = useMutation({
    mutationKey: ["create-billing-portal-session"],
    mutationFn: async () => {
      const { data } = await axios.get("/api/create-billing-portal-session");

      return data as { url: string };
    },
    onSuccess: (data) => {
      router.push(data.url);
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
    }
  }, [data, setUser]);

  useEffect(() => {
    if (error) {
      setUser(null);
    }
  }, [error, setUser]);
  return (
    <nav className="flex h-[8vh] justify-between lg:justify-around items-center px-4 lg:px-0">
      <p className="text-xl font-bold">
        Project<span className="text-indigo-600 font-bold">Partner</span>
      </p>

      <div className="hidden lg:flex items-center gap-x-7">
        <Link
          href={"/"}
          className={`${
            pathname === "/" ? "text-indigo-600" : "hover:text-indigo-600"
          } delay-100 transition-all`}
        >
          Home
        </Link>
        <Link
          href={"/pricing"}
          className={`${
            pathname === "/pricing"
              ? "text-indigo-600"
              : "hover:text-indigo-600"
          } delay-100 transition-all`}
        >
          Pricing
        </Link>
        <Link
          href={"/contact"}
          className={`${
            pathname === "/contact"
              ? "text-indigo-600"
              : "hover:text-indigo-600"
          } delay-100 transition-all`}
        >
          Contact Us
        </Link>
      </div>

      <div className="flex gap-x-5 items-center">
        {user ? (
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
                  ({user.planType} Plan)
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={"/dashboard/projects"}>Go to Dashboard</Link>
              </DropdownMenuItem>
              {user.planType === "Pro" ? (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => handleCreateBillingPortalSession()}
                >
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
        ) : (
          <div className="hidden lg:flex gap-x-5 items-center">
            <Button variant={"ghost"} asChild>
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button asChild>
              <Link href={"/signup"}>Signup</Link>
            </Button>
          </div>
        )}

        <Drawer>
          <DrawerTrigger>
            <IoMenuOutline
              size={30}
              color="black"
              className="block lg:hidden"
            />
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col gap-y-6 items-center py-3">
              <DrawerClose asChild>
                <Link
                  href={"/"}
                  className={`${
                    pathname === "/"
                      ? "text-indigo-600"
                      : "hover:text-indigo-600"
                  } delay-100 transition-all`}
                >
                  Home
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href={"/pricing"}
                  className={`${
                    pathname === "/pricing"
                      ? "text-indigo-600"
                      : "hover:text-indigo-600"
                  } delay-100 transition-all`}
                >
                  Pricing
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  href={"/contact"}
                  className={`${
                    pathname === "/contact"
                      ? "text-indigo-600"
                      : "hover:text-indigo-600"
                  } delay-100 transition-all`}
                >
                  Contact Us
                </Link>
              </DrawerClose>
            </div>

            {!user && (
              <div className="flex gap-x-4 justify-center pb-4">
                <DrawerClose asChild>
                  <Button variant={"outline"} asChild className="w-[45%]">
                    <Link href={"/login"}>Login</Link>
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button asChild>
                    <Link href={"/signup"} className="w-[45%]">
                      Signup
                    </Link>
                  </Button>
                </DrawerClose>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
