import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Breathe() {
  const [isBreathing, setIsBreathing] = useState(false);

  return (
    <div className="min-h-screen bg-card pb-20">
      <AppBar title="Breathing Exercise" />
      
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center"
            animate={isBreathing ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 4, repeat: isBreathing ? Infinity : 0, ease: "easeInOut" }}
          >
            <div className="w-32 h-32 rounded-full bg-primary/40" />
          </motion.div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-card-foreground">
              {isBreathing ? "Breathe with the circle" : "Ready to begin?"}
            </h2>
            <p className="text-muted-foreground">
              {isBreathing ? "Inhale as it expands, exhale as it contracts" : "Find a comfortable position and focus on your breath"}
            </p>
          </div>

          <Button size="lg" onClick={() => setIsBreathing(!isBreathing)}>
            {isBreathing ? "Stop" : "Start Exercise"}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
