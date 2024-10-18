import Title from "@/components/landingpage/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section className="flex flex-col gap-y-10 mt-12 items-center">
      <Title
        title="Contact Us"
        subTitle="We'd love to hear from you! Whether you have questions or some feedback, feel free to reach out. Our team is here to assist you and ensure you have the best experience possible."
      />

      <form className="flex flex-col gap-y-6 w-[90%] sm:w-[75%] lg:w-[60%]">
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="name" className="ml-1">
            Name
          </Label>
          <Input placeholder="Enter your name" />
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="email" className="ml-1">
            Email
          </Label>
          <Input placeholder="Enter your email" type="email" />
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="subject" className="ml-1">
            Subject
          </Label>
          <Input placeholder="Enter subject" />
        </div>
        <div className="flex flex-col gap-y-3">
          <Label htmlFor="message" className="ml-1">
            Message
          </Label>
          <Textarea placeholder="Type your message" />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
};

export default Contact;
