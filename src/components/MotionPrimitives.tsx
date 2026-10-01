import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * K H Plumbing Supply Inc. — Intentional Motion Specification
 * Primary Easing: cubic-bezier(0.22, 1, 0.36, 1)
 *
 * 1. PAGE LOAD ORCHESTRATION (Trigger: Initial Mount)
 *    - Navigation Bar:     y: -12px -> 0, opacity: 0 -> 1 | duration: 500ms | delay: 0ms
 *    - Hero Backdrop:      scale: 1.05 -> 1, opacity: 0.85 -> 1 | duration: 900ms | delay: 0ms
 *    - Hero Label:         y: 16px -> 0, opacity: 0 -> 1 | duration: 500ms | delay: 100ms
 *    - Hero Headline:      y: 28px -> 0, opacity: 0 -> 1 | duration: 700ms | delay: 150ms
 *    - Hero Supporting:    y: 20px -> 0, opacity: 0 -> 1 | duration: 600ms | delay: 250ms
 *    - Hero CTA Group:     y: 16px -> 0, opacity: 0 -> 1 | duration: 500ms | delay: 350ms
 *    - Hero Micro-Copy:    y: 10px -> 0, opacity: 0 -> 1 | duration: 500ms | delay: 450ms
 *
 * 2. SCROLL REVEALS (Trigger: Viewport Entry, once: true)
 *    - Section Labels:     y: 12px -> 0, opacity: 0 -> 1 | duration: 450ms | delay: 0ms
 *    - Section Headlines:  y: 24px -> 0, opacity: 0 -> 1 | duration: 650ms | delay: 60ms
 *    - Staggered Rows:     y: 20px -> 0, opacity: 0 -> 1 | duration: 550ms | stagger: 70ms
 *    - Hairline Dividers:  scaleX: 0 -> 1 (origin-left)  | duration: 700ms | delay: 50ms
 *    - Image Mask Reveal:  clipPath inset(8% 0 8% 0) -> inset(0), scale 1.04 -> 1 | duration: 850ms (600ms mobile)
 *
 * 3. HOVER & INTERACTION (Trigger: Pointer Hover / Focus / Click)
 *    - Product Row Hover:  translateX: 0 -> 6px, arrow reveal, image scale 1.02 | duration: 300ms
 *    - Button Hover:       translateX: 0 -> 2px, subtle brightness shift | duration: 200ms
 */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export function useMotionProfile() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return {
    prefersReducedMotion: Boolean(prefersReducedMotion),
    isMobile,
  };
}

interface RevealLabelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const RevealLabel: React.FC<RevealLabelProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  const { prefersReducedMotion, isMobile } = useMotionProfile();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 8 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: isMobile ? 0.38 : 0.45,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealHeadlineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}

export const RevealHeadline: React.FC<RevealHeadlineProps> = ({
  children,
  className = "",
  delay = 0.05,
  as = "h2",
}) => {
  const { prefersReducedMotion, isMobile } = useMotionProfile();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: isMobile ? 16 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: isMobile ? 0.5 : 0.65,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
}

export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 20,
  duration = 0.55,
}) => {
  const { prefersReducedMotion, isMobile } = useMotionProfile();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDistance = isMobile ? Math.round(distance * 0.6) : distance;
  const initialOffset = {
    x:
      direction === "left"
        ? effectiveDistance
        : direction === "right"
        ? -effectiveDistance
        : 0,
    y:
      direction === "up"
        ? effectiveDistance
        : direction === "down"
        ? -effectiveDistance
        : 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: isMobile ? Math.min(duration, 0.48) : duration,
        delay: isMobile ? delay * 0.7 : delay,
        ease: EASE_OUT_EXPO,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealRuleProps {
  className?: string;
  delay?: number;
}

export const RevealRule: React.FC<RevealRuleProps> = ({
  className = "border-t border-[#E5E7EB]",
  delay = 0,
}) => {
  const { prefersReducedMotion } = useMotionProfile();

  if (prefersReducedMotion) {
    return <div className={className} />;
  }

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0.4 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: EASE_OUT_EXPO,
      }}
      className={`origin-left ${className}`}
    />
  );
};
