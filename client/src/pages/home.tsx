import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Pricing from "@/components/sections/pricing";
import DemoForm from "@/components/sections/demo-form";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <DemoForm />
      <FAQ />
      <Footer />
    </main>
  );
}
