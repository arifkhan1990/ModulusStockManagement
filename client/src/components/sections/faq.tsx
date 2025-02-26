import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does MSM handle multiple locations?",
    answer: "MSM provides a centralized dashboard where you can manage multiple warehouses and stores. Each location can have its own inventory, staff, and settings while maintaining real-time synchronization across your entire business.",
  },
  {
    question: "Can I integrate MSM with my existing systems?",
    answer: "Yes, MSM offers robust API integration capabilities that allow it to work seamlessly with your existing e-commerce platforms, POS systems, and accounting software.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide different levels of support based on your plan. All customers get access to our documentation and email support. Professional and Enterprise plans include priority support and dedicated account managers.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial on all plans. No credit card required. You'll have access to all features during the trial period.",
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about MSM
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
