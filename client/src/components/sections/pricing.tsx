import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "Starter",
    price: { monthly: 49, yearly: 39 },
    features: ["Single location", "Up to 1,000 items", "Basic analytics", "Email support"],
  },
  {
    name: "Professional",
    price: { monthly: 99, yearly: 89 },
    features: ["Multiple locations", "Up to 10,000 items", "Advanced analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    price: { monthly: 199, yearly: 179 },
    features: ["Unlimited locations", "Unlimited items", "Custom analytics", "24/7 support"],
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <div className="flex items-center justify-center gap-4">
            <span className={!yearly ? "font-medium" : "text-muted-foreground"}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={yearly ? "font-medium" : "text-muted-foreground"}>Yearly</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold mt-4">
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <span className="mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
