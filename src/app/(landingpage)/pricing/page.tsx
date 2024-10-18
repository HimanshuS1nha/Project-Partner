import PricingCard from "@/components/landingpage/PricingCard";
import Title from "@/components/landingpage/Title";
import { pricingPlans } from "@/constants/pricing-plans";

const Pricing = () => {
  return (
    <section className="flex flex-col gap-y-12 mt-12 items-center pb-4">
      <Title
        title="Pricing"
        subTitle="Discover our transparent pricing plans designed specifically for project management success. Choose the package that best supports your workflow and goals!"
      />

      <div className="flex w-[1250px] justify-between">
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
            />
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
