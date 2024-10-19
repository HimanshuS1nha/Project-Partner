import Image from "next/image";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <main className="h-[60vh] sm:h-[85vh] flex flex-col items-center justify-center gap-y-7 relative">
      <div className="absolute w-[95%] md:w-[85%] lg:w-[75%] top-[20%] hidden sm:flex justify-between items-center">
        <Image
          src="/notebook.png"
          alt="Notebook"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
        <Image
          src="/woman.png"
          alt="Woman"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-blue-950 text-center">
        Manage your projects easily
      </h1>

      <p className="w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] text-center text-sm md:text-base">
        ProjectPartner makes it super simple to organize and track your tasks,
        so that you can focus on the important stuff.
      </p>

      <div className="absolute w-[85%] md:w-[75%] lg:w-[65%] top-[45%] hidden sm:flex justify-between items-center">
        <Image
          src="/bulb.png"
          alt="Bulb"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
        <Image
          src="/pencil.png"
          alt="Pencil"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
      </div>

      <Button asChild className="h-16 px-9 bg-indigo-600 rounded-xl">
        <Link href={"/signup"} className="gap-x-2.5 text-lg">
          <p className="text-lg">Get Started - It&apos;s free</p>
          <FaArrowRightLong size={20} />
        </Link>
      </Button>

      <div className="absolute w-[70%] md:w-[60%] lg:w-[50%] bottom-[18%] hidden sm:flex justify-between items-center">
        <Image
          src="/man1.png"
          alt="Man"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
        <Image
          src="/man2.png"
          alt="Man"
          width={65}
          height={65}
          className="w-[50px] lg:w-[65px]"
        />
      </div>
    </main>
  );
};

export default HeroSection;
