import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import icelandImage from "@/assets/iceland-lights.jpg";

export default function Breathe() {
  const [isBreathing, setIsBreathing] = useState(false);

  return (
    <div className="min-h-screen bg-card pb-20 relative overflow-hidden">
      <AppBar title="Breathing Exercise" showBack backTo="/dashboard" />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={icelandImage}
          alt="Northern Lights over Iceland"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-card/60 to-card/90" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            className="w-48 h-48 rounded-full bg-primary/30 backdrop-blur-sm flex items-center justify-center border-2 border-primary/20 shadow-2xl"
            animate={isBreathing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 4, repeat: isBreathing ? Infinity : 0, ease: "easeInOut" }}
          >
            <div className="w-32 h-32 rounded-full bg-primary/50 backdrop-blur-sm" />
          </motion.div>

          <div className="text-center space-y-2 backdrop-blur-sm bg-card/30 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {isBreathing ? "Breathe with the circle" : "Ready to begin?"}
            </h2>
            <p className="text-muted-foreground">
              {isBreathing ? "Inhale as it expands, exhale as it contracts" : "Find a comfortable position and focus on your breath"}
            </p>
          </div>

          <Button size="lg" onClick={() => setIsBreathing(!isBreathing)} className="shadow-lg">
            {isBreathing ? "Stop" : "Start Exercise"}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
