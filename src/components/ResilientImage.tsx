import React, { useState, useRef, useEffect } from "react";
import { Wrench } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

export const MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackTitle?: string;
  hoverScale?: boolean;
  priority?: boolean;
  enableParallax?: boolean;
  parallaxIntensity?: number;
  maskReveal?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallbackTitle = "K H Plumbing Supply Counter",
  hoverScale = false,
  priority = false,
  enableParallax = false,
  parallaxIntensity = 18,
  maskReveal = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const activeParallax =
    enableParallax && !prefersReducedMotion && !isMobile ? parallaxIntensity : 0;

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    [-activeParallax, activeParallax]
  );

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative flex flex-col items-center justify-center bg-[#111827] text-white p-8 overflow-hidden ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <Wrench className="w-8 h-8 text-[#155EEF] mb-3 relative z-10" />
        <span className="text-sm font-semibold tracking-tight text-white relative z-10 text-center">
          {fallbackTitle}
        </span>
        <span className="text-xs text-[#9CA3AF] mt-1 relative z-10 text-center max-w-xs">
          {alt}
        </span>
      </div>
    );
  }

  const shouldAnimateMask = maskReveal && !priority && !prefersReducedMotion;

  return (
    <motion.div
      ref={containerRef}
      initial={
        shouldAnimateMask
          ? { clipPath: "inset(8% 0% 8% 0%)", opacity: 0.85 }
          : false
      }
      whileInView={
        shouldAnimateMask
          ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }
          : undefined
      }
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: isMobile ? 0.6 : 0.85,
        ease: MOTION_EASE,
      }}
      className={`relative overflow-hidden bg-[#111827] ${containerClassName}`}
    >
      <motion.div
        style={{
          y: activeParallax ? yOffset : 0,
          scale: activeParallax ? 1.06 : 1,
        }}
        className="w-full h-full"
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isLoaded ? "scale-100 opacity-100" : "scale-[1.04] opacity-90"
          } ${
            hoverScale
              ? "group-hover:scale-[1.02] group-hover:duration-300"
              : ""
          } ${className}`}
        />
      </motion.div>
    </motion.div>
  );
};
