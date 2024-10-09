"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";

import type { UserType } from "../../../types";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const { data } = useQuery({
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

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, setUser]);
  return (
    <nav className="flex h-[8vh] justify-around items-center">
      <p className="text-xl font-semibold">
        Project<span className="text-indigo-600 font-bold">Partner</span>
      </p>

      <div className="flex items-center gap-x-7">
        <Link
          href={"/"}
          className="hover:text-indigo-600 delay-100 transition-all"
        >
          Home
        </Link>
        <Link
          href={"/pricing"}
          className="hover:text-indigo-600 delay-100 transition-all"
        >
          Pricing
        </Link>
        <Link
          href={"/contact"}
          className="hover:text-indigo-600 delay-100 transition-all"
        >
          Contact Us
        </Link>
      </div>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="bg-indigo-600 w-8 h-8 rounded-full flex justify-center items-center">
              <p className="text-white">{user?.name?.[0]}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={"/dashboard/projects"}>Go to Dashboard</Link>
            </DropdownMenuItem>
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
        <div className="flex gap-x-5 items-center">
          <Button variant={"ghost"} asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={"/signup"}>Signup</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
