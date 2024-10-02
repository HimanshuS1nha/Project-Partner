"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

const Navbar = () => {
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

      <div className="flex gap-x-5 items-center">
        <Button variant={"ghost"} asChild>
          <Link href={"/login"}>Login</Link>
        </Button>
        <Button asChild>
          <Link href={"/signup"}>Signup</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
