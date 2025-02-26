import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <a className="text-2xl font-bold text-primary">MSM</a>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Modern stock management solution for businesses of all sizes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
              <li><a href="#demo" className="text-sm text-muted-foreground hover:text-primary">Request Demo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MSM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
