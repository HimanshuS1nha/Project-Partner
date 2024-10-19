"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import Title from "@/components/landingpage/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  contactUsValidator,
  type contactUsValidatorType,
} from "@/validators/contact-us-validator";

const Contact = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<contactUsValidatorType>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      subject: "",
    },
    resolver: zodResolver(contactUsValidator),
  });

  const { mutate: handleContactUs, isPending } = useMutation({
    mutationKey: ["contact-us"],
    mutationFn: async (values: contactUsValidatorType) => {
      const { data } = await axios.post("/api/contact", { ...values });

      return data as { message: string };
    },
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Some error occured. Please try again later!");
      }
    },
  });
  return (
    <section className="flex flex-col gap-y-10 mt-6 md:mt-12 items-center pb-4">
      <Title
        title="Contact Us"
        subTitle="We'd love to hear from you! Whether you have questions or some feedback, feel free to reach out. Our team is here to assist you and ensure you have the best experience possible."
      />

      <form
        className="flex flex-col gap-y-6 w-[90%] sm:w-[75%] lg:w-[60%]"
        onSubmit={handleSubmit((data) => handleContactUs(data))}
      >
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="name" className="ml-1">
            Name
          </Label>
          <Input
            placeholder="Enter your name"
            id="name"
            required
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-rose-600 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="email" className="ml-1">
            Email
          </Label>
          <Input
            placeholder="Enter your email"
            type="email"
            id="email"
            required
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-rose-600 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="subject" className="ml-1">
            Subject
          </Label>
          <Input
            placeholder="Enter subject"
            id="subject"
            required
            {...register("subject", { required: true })}
          />
          {errors.subject && (
            <p className="text-rose-600 text-sm">{errors.subject.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="message" className="ml-1">
            Message
          </Label>
          <Textarea
            placeholder="Type your message"
            id="message"
            required
            {...register("message", { required: true })}
          />
          {errors.message && (
            <p className="text-rose-600 text-sm">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </form>
    </section>
  );
};

export default Contact;
