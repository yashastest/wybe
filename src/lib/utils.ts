
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type LoadingOptions = {
  minDuration?: number;
  maxDuration?: number;
}

export function simulateLoading(callback: () => void, options?: LoadingOptions) {
  const minDuration = options?.minDuration || 800;
  const maxDuration = options?.maxDuration || 1500;
  const duration = Math.random() * (maxDuration - minDuration) + minDuration;
  
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, duration);
  });
}

export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.5,
      delay: delay,
    }
  })
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: delay,
      ease: "easeOut",
    }
  })
};

export const generateGradientStyle = (colorStart: string, colorEnd: string) => {
  return {
    backgroundImage: `linear-gradient(45deg, ${colorStart}, ${colorEnd})`,
  };
};

export const truncateAddress = (address: string, startChars = 4, endChars = 4) => {
  if (!address) return '';
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
