import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Globe, Zap } from "lucide-react";

const features = [
  {
    title: "Multi-Location Support",
    description: "Manage multiple warehouses and stores from a single dashboard",
    icon: Globe,
  },
  {
    title: "Real-time Analytics",
    description: "Get instant insights into your inventory performance",
    icon: BarChart3,
  },
  {
    title: "Team Collaboration",
    description: "Built-in tools for seamless team coordination",
    icon: Users,
  },
  {
    title: "Lightning Fast",
    description: "Optimized for speed and reliability",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your inventory effectively
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
