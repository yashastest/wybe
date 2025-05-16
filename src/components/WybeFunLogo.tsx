
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface WybeFunLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  withLink?: boolean;
  withAnimation?: boolean;
}

const WybeFunLogo: React.FC<WybeFunLogoProps> = ({
  size = "md",
  withLink = true,
  withAnimation = true,
}) => {
  // Size mappings
  const sizeClasses = {
    sm: {
      container: "gap-1",
      logo: "h-6 w-6 md:h-8 md:w-8",
      title: "text-sm md:text-base",
      subtitle: "text-xs",
      sparkles: 12,
    },
    md: {
      container: "gap-2",
      logo: "h-8 w-8 md:h-10 md:w-10",
      title: "text-lg md:text-xl",
      subtitle: "text-xs md:text-sm",
      sparkles: 14,
    },
    lg: {
      container: "gap-2",
      logo: "h-10 w-10 md:h-12 md:w-12",
      title: "text-xl md:text-2xl",
      subtitle: "text-sm",
      sparkles: 16,
    },
    xl: {
      container: "gap-3",
      logo: "h-12 w-12 md:h-14 md:w-14",
      title: "text-2xl md:text-3xl",
      subtitle: "text-sm md:text-base",
      sparkles: 18,
    },
  };

  // Enhanced animation variants
  const logoVariants = {
    initial: withAnimation ? { scale: 0.8, opacity: 0, rotate: -5 } : { scale: 1, opacity: 1 },
    animate: withAnimation ? { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.6 
      }
    } : { scale: 1, opacity: 1 },
    hover: withAnimation ? {
      scale: 1.05,
      rotate: [0, -2, 2, -2, 0],
      transition: { duration: 0.5 }
    } : {}
  };

  // Enhanced pulse animation with more vibrant colors
  const pulseAnimation = {
    initial: withAnimation ? { opacity: 0.9, scale: 0.98 } : { opacity: 1 },
    animate: withAnimation ? {
      opacity: 1,
      scale: 1.02,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    } : { opacity: 1 }
  };

  // Enhanced sparkle animations
  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: withAnimation ? { 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        repeatType: "reverse" as const,
        delay: 1
      }
    } : { opacity: 0 }
  };

  // Gradient animation for the text
  const textGradientAnimation = {
    animate: withAnimation ? {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    } : {}
  };

  const Content = () => (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={logoVariants}
      className={`flex items-center relative ${sizeClasses[size].container}`}
    >
      <motion.div 
        className="relative z-10"
        variants={pulseAnimation}
      >
        <div className="relative">
          <motion.div
            className="absolute -top-1 -right-1"
            variants={sparkleVariants}
          >
            <Sparkles size={sizeClasses[size].sparkles} className="text-orange-500" />
          </motion.div>
          
          <img 
            src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
            alt="Wybe Fun Logo" 
            className={`${sizeClasses[size].logo} drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]`} 
          />
        </div>
      </motion.div>
      <div className="ml-1">
        <motion.div className="flex flex-col">
          <motion.span 
            className={`${sizeClasses[size].title} text-white font-extrabold font-poppins tracking-wide italic`}
            animate={withAnimation ? { 
              textShadow: [
                "0 0 7px rgba(255,255,255,0.3)",
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 7px rgba(255,255,255,0.3)"
              ]
            } : undefined}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Wybe
          </motion.span>
          <motion.span 
            className={`${sizeClasses[size].subtitle} text-orange-500 font-bold font-poppins -mt-1`}
            style={{
              background: "linear-gradient(90deg, #f97316, #fbbf24, #f97316)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            animate={textGradientAnimation}
          >
            Fun
          </motion.span>
          <motion.div 
            className="h-0.5 bg-gradient-to-r from-orange-600 to-orange-400 mt-0.5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  if (withLink) {
    return (
      <Link to="/" className="flex items-center no-underline">
        <Content />
      </Link>
    );
  }

  return <Content />;
};

export default WybeFunLogo;
