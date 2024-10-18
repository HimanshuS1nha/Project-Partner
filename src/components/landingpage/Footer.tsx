"use client";

import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  return (
    <footer className="mt-20 flex flex-col gap-y-10">
      <div className="flex justify-between px-10">
        <div className="flex flex-col w-[33%] gap-y-4">
          <p className="text-xl font-semibold">
            Project<span className="text-indigo-600 font-bold">Partner</span>
          </p>
          <p className="text-justify leading-7">
            ProjectPartner is your essential resource for effective project
            management. It empowers you to meet deadlines and achieve your
            objectives with confidence and precision. Partner with us for successful outcomes!
          </p>
        </div>

        <div className="flex flex-col gap-y-4 items-center">
          <p className="font-semibold text-lg">Quick Links</p>
          <ul className="flex flex-col gap-y-2.5 items-center">
            <li className="hover:text-indigo-600 delay-100 transition-all">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="hover:text-indigo-600 delay-100 transition-all">
              <Link href={"/pricing"}>Pricing</Link>
            </li>
            <li className="hover:text-indigo-600 delay-100 transition-all">
              <Link href={"/contact"}>Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-y-4 items-center">
          <p className="font-semibold text-lg">Socials</p>
          <div className="flex items-center gap-x-4">
            <Link href={"https://github.com/HimanshuS1nha"} target="__blank">
              <FaGithub
                size={22}
                className="hover:text-indigo-600 delay-100 transition-all cursor-pointer"
              />
            </Link>
            <Link
              href={"https://www.linkedin.com/in/himanshu-sinha-b4a884236"}
              target="__blank"
            >
              <FaLinkedin
                size={22}
                className="hover:text-indigo-600 delay-100 transition-all cursor-pointer"
              />
            </Link>
            <FaInstagram
              size={22}
              className="hover:text-indigo-600 delay-100 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4 w-[30%]">
          <p className="font-semibold text-lg">Subscribe to our newsletter</p>
          <div className="flex items-center gap-x-2">
            <Input placeholder="Enter your email" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <p className="font-semibold">
          Copyright &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
