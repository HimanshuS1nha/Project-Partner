import FeaturesAndBenefits from "@/components/landingpage/FeaturesAndBenefits";
import Footer from "@/components/landingpage/Footer";
import HeroSection from "@/components/landingpage/HeroSection";
import Testimonials from "@/components/landingpage/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesAndBenefits />
      <Testimonials />
      <Footer />
    </>
  );
}
