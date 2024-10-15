"use client";

import AutoPlay from "embla-carousel-autoplay";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Image from "next/image";

import Title from "./Title";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/constants/testimonials";

const Testimonials = () => {
  return (
    <section className="mt-20 flex flex-col items-center gap-y-12">
      <Title
        title="Testimonials"
        subTitle="Explore how our clients have leveraged ProjectPartner to achieve timely project completions and turn challenges into remarkable successes."
      />

      <Carousel
        className="w-[500px]"
        opts={{ loop: true }}
        plugins={[AutoPlay({ delay: 2000 })]}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => {
            return (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center gap-y-3 justify-center p-6">
                      <Image
                        src={testimonial.image}
                        className="w-20 h-20 rounded-full object-cover"
                        alt={testimonial.name}
                        width={80}
                        height={80}
                      />
                      <p className="font-semibold text-lg">
                        {testimonial.name}
                      </p>
                      <div className="relative flex justify-center">
                        <FaQuoteLeft
                          size={20}
                          className="absolute top-0 left-0 text-blue-950"
                        />
                        <p className="leading-7 text-justify w-[85%]">
                          {testimonial.content}
                        </p>
                        <FaQuoteRight
                          size={20}
                          className="absolute bottom-0 right-0 text-blue-950"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default Testimonials;
