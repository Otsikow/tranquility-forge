import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import victoriaFallsImage from "@/assets/victoria-falls.jpg";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={victoriaFallsImage}
          alt="Majestic waterfall"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Lost in the Mist
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for seems to have drifted away like clouds over a waterfall
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
