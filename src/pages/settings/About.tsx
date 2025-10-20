import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Users, Sparkles, ExternalLink } from "lucide-react";
import banffImage from "@/assets/banff-lake.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="About Peace" showBack />

      {/* Hero Section */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={banffImage}
          alt="Peaceful mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Leaf className="w-16 h-16 text-primary mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground drop-shadow-lg">
              Peace
            </h1>
            <p className="text-foreground/90 drop-shadow-md mt-2">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Mission */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Peace is dedicated to making mental wellbeing accessible to everyone. 
                We believe that mindfulness, self-reflection, and emotional awareness 
                are essential tools for a balanced and fulfilling life.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Core Values</h3>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    Empathy First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We approach mental wellbeing with compassion and understanding, 
                    creating a safe space for everyone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    Privacy & Security
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your thoughts and feelings are personal. We ensure your data 
                    is encrypted and never shared without your consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    Continuous Innovation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We're constantly improving our AI and features to provide you 
                    with the best possible support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Our Team</h3>
            <p className="text-sm text-muted-foreground">
              Peace is built by a passionate team of mental health advocates, 
              designers, and engineers committed to making wellbeing accessible.
            </p>
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              Meet the Team
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center mb-4">
              Connect With Us
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Twitter
              </Button>
              <Button variant="outline" className="w-full">
                Instagram
              </Button>
              <Button variant="outline" className="w-full">
                LinkedIn
              </Button>
              <Button variant="outline" className="w-full">
                Facebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="bg-muted rounded-lg p-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>Peace - Mental Wellbeing Assistant</p>
          <p>Version 1.0.0 (Build 2024.10)</p>
          <p className="text-xs pt-2">
            © 2024 Peace App. All rights reserved.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
