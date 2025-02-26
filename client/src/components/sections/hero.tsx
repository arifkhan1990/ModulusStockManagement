import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold leading-tight tracking-tighter mb-6">
              Smart Stock Management for Modern Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Streamline your inventory operations with MSM's comprehensive SaaS solution.
              Perfect for businesses of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button size="lg" variant="outline">Watch Demo</Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1524114051012-0a2aa8dae4e1"
              alt="MSM Dashboard"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
