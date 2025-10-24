import { Link } from "react-router-dom";
import { Leaf, Heart, Shield, Mail } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg text-foreground">Peace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI companion for mental wellbeing and mindfulness.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-muted-foreground hover:text-primary transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/breathe" className="text-muted-foreground hover:text-primary transition-colors">
                  Meditation
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/health-support" className="text-muted-foreground hover:text-primary transition-colors">
                  Health & Support
                </Link>
              </li>
              <li>
                <Link to="/settings/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/settings/legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/settings/legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@peace.app" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Our Mission</h3>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              Making mental health support accessible to everyone, everywhere.
            </p>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              Your privacy and security are our top priority.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Peace. All rights reserved. Built with care for your wellbeing.
          </p>
        </div>
      </div>
    </footer>
  );
};
