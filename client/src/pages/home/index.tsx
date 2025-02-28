
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { 
  LayoutGrid, 
  LineChart, 
  Database, 
  Globe, 
  ShieldCheck, 
  Zap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

import HeroModel from '../../components/3d/HeroModel';

const features = [
  {
    title: "Multi-Channel Management",
    description: "Manage inventory across all your sales channels from one platform.",
    icon: LayoutGrid,
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance and make data-driven decisions with powerful insights.",
    icon: LineChart,
  },
  {
    title: "Automated Restocking",
    description: "Automate purchase orders based on inventory levels and demand forecasts.",
    icon: Database,
  },
  {
    title: "Global Scalability",
    description: "Scale your operations worldwide with our cloud-based platform.",
    icon: Globe,
  },
  {
    title: "Secure Data",
    description: "End-to-end encryption and security that complies with industry standards.",
    icon: ShieldCheck,
  },
  {
    title: "Lightning Fast",
    description: "Optimized for speed and reliability, even with large inventory databases.",
    icon: Zap,
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$29',
    period: 'per month',
    description: 'Perfect for small businesses just getting started.',
    features: [
      'Up to 1,000 stock items',
      'Basic reporting',
      'Email notifications',
      'Single user access',
      'Community support',
    ],
    cta: 'Start Basic',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: 'per month',
    description: 'Ideal for growing businesses with multiple channels.',
    features: [
      'Up to 10,000 stock items',
      'Advanced analytics',
      'Multi-channel notifications',
      'Up to 5 user accounts',
      'Priority support',
      'API access',
    ],
    cta: 'Start Professional',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: 'per month',
    description: 'For large businesses with complex inventory needs.',
    features: [
      'Unlimited stock items',
      'Custom reporting',
      'All notification channels',
      'Unlimited users',
      'Dedicated support',
      'Custom integrations',
      'White labeling',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll('.gsap-hero-element'), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }
  }, []);
  
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <HeroModel />
            <Environment preset="city" />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={false} 
            />
          </Canvas>
        </motion.div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 pt-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              Introducing Modulus Stock Management
            </motion.div>
            
            <h1 className="gsap-hero-element text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter md:leading-tight max-w-3xl">
              Revolutionize Your Inventory Management
            </h1>
            
            <p className="gsap-hero-element max-w-2xl text-muted-foreground md:text-xl">
              The complete SaaS solution for multi-channel stock management, POS, invoicing, and customer management.
            </p>
            
            <div className="gsap-hero-element flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/signup" 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/demo" 
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                  See Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground"
            >
              <path 
                d="M12 5V19M12 19L5 12M12 19L19 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef} 
        className="py-12 md:py-20"
      >
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Everything you need to manage your inventory efficiently
              </p>
            </div>
          </motion.div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 pt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2 rounded-lg p-4 transition-all hover:bg-accent"
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section 
        ref={pricingRef} 
        className="py-12 md:py-20 bg-accent/50"
      >
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Choose the plan that works best for your business
              </p>
            </div>
          </motion.div>
          
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 pt-12">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`flex flex-col rounded-lg ${plan.popular ? 'border-primary shadow-lg border-2' : 'border'} bg-background p-6`}
                initial={{ opacity: 0, y: 50 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1 + 0.2
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline text-muted-foreground">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="ml-1 text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={plan.popular ? "/signup" : "/contact"} 
                      className={`inline-flex w-full items-center justify-center rounded-md ${
                        plan.popular 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'border border-input bg-background hover:bg-accent'
                      } px-4 py-2 text-sm font-medium`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div 
              className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to get started?
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold tracking-tighter md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Transform Your Inventory Management Today
            </motion.h2>
            
            <motion.p 
              className="max-w-[600px] text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of businesses already using Modulus to streamline their operations
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/signup" 
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Start Free Trial
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/contact" 
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
                >
                  Contact Sales
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
