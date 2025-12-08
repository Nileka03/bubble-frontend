import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { moodThemes } from "../lib/moodThemes"; 
import { cn } from "../lib/utils"; 

const MoodCard = ({ 
  children, 
  currentMood, 
  motionEnabled, 
  className 
}) => {
  // 1. Determine Theme
  const moodKey = currentMood?.emotion || "neutral";
  // Fallback to neutral if the AI invents a mood we don't have
  const theme = moodThemes[moodKey] || moodThemes.neutral;
  
  // 2. Accessibility Checks
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = motionEnabled && !prefersReducedMotion;

  return (
    <div className="relative w-full h-full group">
      
      {/* --- GLOW LAYER (The Soft Light) --- */}
      <motion.div
        className="absolute -inset-1 rounded-3xl blur-2xl opacity-40"
        animate={{
          backgroundColor: theme.colors[0], // Animate the base color
          boxShadow: `0 0 60px ${theme.glow}` // Animate the glow size/color
        }}
        transition={{
          duration: 3.0, // <--- SLOW LIQUID TRANSITION (3 seconds)
          ease: "easeInOut"
        }}
      />

      {/* --- BORDER LAYER (The Moving Gradient) --- */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-80"
        style={{
          backgroundSize: "200% 200%", // Needed for movement
        }}
        // We put the gradient in 'animate' so Framer Motion interpolates it
        animate={{
          backgroundImage: `linear-gradient(45deg, ${theme.colors.join(", ")})`,
          backgroundPosition: shouldAnimate ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
        }}
        // We use TWO transitions:
        // 1. One for the 'backgroundImage' (Color change) -> Slow & Smooth
        // 2. One for the 'backgroundPosition' (Movement) -> Constant loop
        transition={{
          backgroundImage: { duration: 2.5, ease: "linear" }, // Takes 2.5s to morph colors
          backgroundPosition: {
             duration: theme.speed,
             repeat: Infinity,
             ease: "linear",
          }
        }}
      />

      {/* --- CONTENT LAYER (The Glass Card) --- */}
      {/* We apply the background logic here to hide the center of the gradient div above */}
      <div className={cn("relative h-full w-full bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
};

export default MoodCard;