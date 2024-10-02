import Image from "next/image";

import Title from "./Title";
import { featuresAndBenefits } from "@/constants/features-and-benefits";

const FeaturesAndBenefits = () => {
  return (
    <section className="mt-20 flex flex-col gap-y-24 items-center relative">
      <Image
        src={"/star.png"}
        alt="Star"
        width={77}
        height={80}
        className="absolute top-[-5%] right-[24%]"
      />
      <Image
        src={"/arrow.png"}
        alt="Star"
        width={183}
        height={73}
        className="absolute top-[5%] left-[15%]"
      />

      <Title
        title="Features and Benefits"
        subTitle="Unlock your full potential with ProjectPartner and boost your efficiency. Transform how you manage projects and drive success with every task."
      />

      <div className="flex flex-wrap w-[65%] justify-between gap-y-20">
        {featuresAndBenefits.map((item) => {
          return (
            <div
              key={item.title}
              className="flex flex-col gap-y-3 w-[40%] items-center"
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
