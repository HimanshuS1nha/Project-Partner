import Image from "next/image";

import Title from "./Title";
import { featuresAndBenefits } from "@/constants/features-and-benefits";

const FeaturesAndBenefits = () => {
  return (
    <section className="mt-20 flex flex-col gap-y-10 sm:gap-y-24 items-center relative">
      <Image
        src={"/star.png"}
        alt="Star"
        width={77}
        height={80}
        className="hidden sm:block absolute -top-[1%] lg:top-[-5%] right-[15%] md:right-[11%] lg:right-[15%] xl:right-[24%] w-[40px] md:w-[50px] lg:w-[77px]"
      />
      <Image
        src={"/arrow.png"}
        alt="Star"
        width={130}
        height={73}
        className="hidden sm:block absolute top-0 md:top-[5%] left-[8%] md:left-[1%] lg:left-[5%] xl:left-[14%] 2xl:left-[18%] w-[80px] md:w-[130px]"
      />

      <Title
        title="Features and Benefits"
        subTitle="Unlock your full potential with ProjectPartner and boost your efficiency. Transform how you manage projects and drive success with every task."
      />

      <div className="flex flex-col sm:flex-row flex-wrap w-[90%] md:w-[78%] lg:w-[65%] justify-center sm:justify-between gap-y-10 sm:gap-y-20 items-center sm:items-start">
        {featuresAndBenefits.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col gap-y-3 w-[90%] sm:w-[40%] items-center"
            >
              <item.Icon color="#172554" size={50} />
              <p className="text-2xl text-blue-950 font-bold">{item.title}</p>
              <p className="text-center">{item.content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesAndBenefits;
