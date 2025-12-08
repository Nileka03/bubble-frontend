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
  
  const moodKey = currentMood?.emotion || "neutral";
  // Fallback to neutral if the ai invents a mood we don't have
  const theme = moodThemes[moodKey] || moodThemes.neutral;
  
  //check if the user have the toggle enabled
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = motionEnabled && !prefersReducedMotion;

  return (
    <div className="relative w-full h-full group">
      
      
      <motion.div
        className="absolute -inset-1 rounded-3xl blur-2xl opacity-40"
        animate={{
          backgroundColor: theme.colors[0], 
          boxShadow: `0 0 60px ${theme.glow}` 
        }}
        transition={{
          duration: 3.0, 
          ease: "easeInOut"
        }}
      />

      
      <motion.div
        className="absolute -inset-[2px] rounded-2xl opacity-80"
        style={{
          backgroundSize: "200% 200%", 
        }}
        
        animate={{
          backgroundImage: `linear-gradient(45deg, ${theme.colors.join(", ")})`,
          backgroundPosition: shouldAnimate ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
        }}
        
        transition={{
          backgroundImage: { duration: 2.5, ease: "linear" }, 
          backgroundPosition: {
             duration: theme.speed,
             repeat: Infinity,
             ease: "linear",
          }
        }}
      />

      
      <div className={cn("relative h-full w-full bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
};

export default MoodCard;