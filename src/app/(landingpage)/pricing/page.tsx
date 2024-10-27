"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import PricingCard from "@/components/landingpage/PricingCard";
import Title from "@/components/landingpage/Title";
import { useUser } from "@/hooks/useUser";
import { pricingPlans } from "@/constants/pricing-plans";

const Pricing = () => {
  const user = useUser((state) => state.user);
  const router = useRouter();

  const { mutate: handleCreateCheckoutSession } = useMutation({
    mutationKey: ["create-checkout-session"],
    mutationFn: async () => {
      const { data } = await axios.post("/api/create-checkout-session");

      return data as { url: string };
    },
    onSuccess: (data) => {
      router.push(data.url);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        return toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });

  const handleClick = (planName: string) => {
    if (planName === "Basic") {
      router.push("/signup");
    } else if (planName === "Pro") {
      if (!user?.email) {
        router.replace("/login?redirect_to=pricing");
      } else {
        handleCreateCheckoutSession();
      }
    } else if (planName === "Custom") {
      router.push("/contact");
    }
  };
  return (
    <section className="flex flex-col gap-y-12 mt-6 md:mt-12 items-center pb-4">
      <Title
        title="Pricing"
        subTitle="Discover our transparent pricing plans designed specifically for project management success. Choose the package that best supports your workflow and goals!"
      />

      <div className="flex w-[95%] xl:w-[1250px] justify-center xl:justify-between flex-wrap gap-x-8 xl:gap-x-0 gap-y-8">
        {pricingPlans.map((pricingPlan) => {
          return (
            <PricingCard
              key={pricingPlan.planName}
              planName={pricingPlan.planName}
              description={pricingPlan.description}
              price={pricingPlan.price}
              features={pricingPlan.features}
              buttonText={pricingPlan.buttonText}
              isHighlighted={pricingPlan.planName === "Pro"}
              handleClick={handleClick}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
