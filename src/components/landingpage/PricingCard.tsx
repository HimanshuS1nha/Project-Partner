"use client";

import { IoCheckmarkCircle } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const PricingCard = ({
  planName,
  description,
  features,
  price,
  buttonText,
  isHighlighted,
  handleClick,
}: {
  planName: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
  isHighlighted: boolean;
  handleClick: (planName: string) => void;
}) => {
  return (
    <div
      className={cn(
        "py-10 px-7 w-[95%] sm:w-[400px] rounded-xl flex flex-col gap-y-6 shadow-sm",
        isHighlighted
          ? "border-2 border-indigo-600 shadow-indigo-600"
          : "shadow-black"
      )}
    >
      <div
        className={cn(
          "w-fit px-6 py-1.5 rounded-full",
          isHighlighted ? "bg-indigo-600" : "bg-black"
        )}
      >
        <p className="text-white text-sm">{planName}</p>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-end gap-x-1">
          <p className="text-3xl font-bold">{price}</p>
          <p className="text-sm">/month</p>
        </div>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>

      <div className="flex flex-col gap-y-4">
        {features.map((feature) => {
          return (
            <div key={feature} className="flex gap-x-4 items-center">
              <IoCheckmarkCircle
                size={23}
                color={isHighlighted ? "blue" : "black"}
              />
              <p className="text-gray-700">{feature}</p>
            </div>
          );
        })}
      </div>

      <Button
        variant={isHighlighted ? "default" : "outline"}
        className={
          isHighlighted
            ? ""
            : "text-indigo-600 border-indigo-300 hover:border-indigo-600 hover:bg-transparent hover:text-indigo-600 delay-100 transition-all"
        }
        onClick={() => handleClick(planName)}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PricingCard;
