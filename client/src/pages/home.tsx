
import React from 'react';
import { Link } from 'wouter';
import {
  CheckCircle,
  Database,
  Globe,
  LayoutGrid,
  LineChart,
  ShieldCheck,
  Users,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span className="font-bold text-xl">Modulus</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary">Testimonials</a>
            <a href="#contact" className="text-sm font-medium hover:text-primary">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button className="text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Modulus Stock Management
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Streamline your inventory across all sales channels with our
                powerful SaaS platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to manage your inventory effectively
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Globe className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Multi-Location Support</h3>
              <p className="text-sm text-muted-foreground text-center">
                Manage multiple warehouses and stores from a single dashboard
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <BarChart3 className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground text-center">
                Get instant insights into your inventory performance
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground text-center">
                Built-in tools for seamless team coordination
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <Zap className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground text-center">
                Optimized for speed and reliability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that's right for your business
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            {/* Starter Plan */}
            <div className="flex flex-col rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 500 products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>2 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-6 pt-0">
                <Link href="/register?plan=starter">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Professional Plan */}
            <div className="flex flex-col rounded-lg border shadow-sm bg-primary/5 border-primary/30">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Up to 5,000 products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>10 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Multi-location support</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-6 pt-0">
                <Link href="/register?plan=professional">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="flex flex-col rounded-lg border shadow-sm">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="mt-4 text-center">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto p-6 pt-0">
                <Link href="/register?plan=enterprise">
                  <Button className="w-full" variant="outline">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by Businesses Worldwide
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See what our customers are saying about Modulus
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center text-white font-bold">JD</div>
                <div>
                  <h4 className="text-lg font-bold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">CEO, TechCorp</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "Modulus has transformed how we manage our inventory. We've reduced stockouts by 75% and improved order fulfillment times."
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center text-white font-bold">SR</div>
                <div>
                  <h4 className="text-lg font-bold">Sarah Robinson</h4>
                  <p className="text-sm text-muted-foreground">Inventory Manager, Retail Plus</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "The multi-location support is a game-changer. We can now manage stock across all our stores and warehouses in real-time."
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center text-white font-bold">MJ</div>
                <div>
                  <h4 className="text-lg font-bold">Mike Johnson</h4>
                  <p className="text-sm text-muted-foreground">Operations Director, Global Goods</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "The analytics and reporting features have given us invaluable insights. We've optimized our stock levels and saved thousands."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Optimize Your Inventory?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl">
                Join thousands of businesses already using Modulus to streamline their operations.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">Start Free Trial</Button>
              </Link>
              <Link href="#contact">
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white hover:text-primary">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6" />
                <span className="font-bold text-xl">Modulus</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                The complete stock management solution for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Community</a></li>
              </ul>
            </div>
            <div id="contact">
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">contact@modulus.com</li>
                <li className="text-muted-foreground">+1 (555) 123-4567</li>
                <li className="text-muted-foreground">123 Business St, Tech City</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2023 Modulus, Inc. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
