/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  MapPin,
  Mail,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  Copy,
  Check,
  Clock,
  Menu,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  BUSINESS_INFO,
  IMAGES,
  GALLERY_ITEMS,
  MATERIALS_SHOWCASE,
  QUICK_CATEGORIES,
  PRODUCT_CATEGORIES,
  PRODUCT_STRIP_ITEMS,
  WHY_KH_POINTS,
  CONFIRMED_BRANDS,
  COUNTER_HOURS,
} from "./data/supplyData";
import { ResilientImage } from "./components/ResilientImage";
import {
  EASE_OUT_EXPO,
  useMotionProfile,
  RevealLabel,
  RevealHeadline,
  RevealBlock,
  RevealRule,
} from "./components/MotionPrimitives";

const NAV_LINKS = [
  { number: "01", label: "Products", href: "#products", id: "products" },
  {
    number: "02",
    label: "Hard-to-Find",
    href: "#hard-to-find",
    id: "hard-to-find",
  },
  { number: "03", label: "Materials", href: "#materials", id: "materials" },
  { number: "04", label: "About", href: "#about", id: "about" },
  { number: "05", label: "Gallery", href: "#gallery", id: "gallery" },
  { number: "06", label: "Visit", href: "#visit", id: "visit" },
];

export default function App() {
  const { prefersReducedMotion, isMobile } = useMotionProfile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string>("01");
  const [activeCounterMethod, setActiveCounterMethod] = useState<number>(0);
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number>(0);
  const [galleryFilter, setGalleryFilter] = useState<
    "All" | "Counter" | "Parts" | "Interior"
  >("All");
  const [activeRouteTab, setActiveRouteTab] = useState<
    "us101" | "i280" | "third"
  >("us101");
  const [visitTopic, setVisitTopic] = useState<string>("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Page-wide scroll progress bar
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  // Hero subtle parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(
    heroScrollProgress,
    [0, 1],
    [0, prefersReducedMotion || isMobile ? 0 : 56]
  );

  // Horizontal scroll rail ref for Materials section
  const materialsRailRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress: materialsScrollX } = useScroll({
    container: materialsRailRef,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Resolve the canonical URL for the current deployment host.
    const canonicalUrl = window.location.origin + window.location.pathname;
    let canonicalLink = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    let ogUrlMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement("meta");
      ogUrlMeta.setAttribute("property", "og:url");
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.setAttribute("content", canonicalUrl);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section IntersectionObserver for smooth nav indicator
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-28% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const scrollToVisitSection = (topic?: string) => {
    setDrawerOpen(false);
    if (topic) {
      setVisitTopic(topic);
    }
    const el = document.getElementById("visit");
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setDrawerOpen(false);
    const targetId = href.replace("#", "");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const handleQuickCategoryClick = (targetNumber: string) => {
    setExpandedCategory(targetNumber);
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  const scrollMaterialsRail = (direction: "prev" | "next") => {
    const rail = materialsRailRef.current;
    if (!rail) return;
    const scrollAmount = Math.round(rail.clientWidth * 0.72);
    rail.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.fullAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    } catch {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2200);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.phoneDisplay);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    } catch {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2200);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.emailDisplay);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const counterMethods = [
    {
      index: "01",
      title: "Bring the Old Part",
      summary:
        "Walk the worn stem, cartridge, valve, or fitting right up to the counter.",
      detail:
        "Matching an existing part in person is the fastest way to verify stem length, spline count, seat threads, and exact connection geometry.",
    },
    {
      index: "02",
      title: "Bring a Photo & Measurement",
      summary:
        "Can't remove the valve body? Take a clear photo and measure the pipe.",
      detail:
        "Snap a straight-on photo of the rough-in body behind the trim plate and measure outside diameter or center-to-center spacing.",
    },
    {
      index: "03",
      title: "Bring the Model or Brand",
      summary:
        "Share the fixture manufacturer, model stamp, or casting number.",
      detail:
        "Look for stamped numbers on the brass cartridge body, flush valve cover, or inside the toilet tank lid to pinpoint the replacement part.",
    },
  ];

  const routeDirections = {
    us101: {
      label: "From US-101 / Bayshore",
      summary: "2 minutes east of US-101 Silver Ave / Bayshore Blvd exit.",
      steps: [
        "Exit US-101 at Silver Ave / Bayshore Blvd head southeast toward Industrial St.",
        "Continue onto Industrial St / Oakdale Ave toward the Bayview supply corridor.",
        "Turn onto Shafter Ave — 2272 Shafter Ave is between Loomis St and the Industrial/Toland corridor.",
      ],
    },
    i280: {
      label: "From I-280 / Industrial St",
      summary:
        "Direct commercial access from I-280 Alemany Blvd / Industrial St exit.",
      steps: [
        "Take exit 52B for Alemany Blvd / Industrial St off I-280.",
        "Follow Industrial St east into the Bayview industrial district.",
        "Turn right onto Shafter Ave to reach the counter at 2272 Shafter Ave.",
      ],
    },
    third: {
      label: "From 3rd St Corridor",
      summary: "Quick cross-street access from 3rd Street in Bayview.",
      steps: [
        "Head west off 3rd Street onto Shafter Ave or Oakdale Ave.",
        "Follow Shafter Ave west toward the industrial supply blocks.",
        "Arrive at 2272 Shafter Ave on the north side of the block.",
      ],
    },
  };

  return (
    <div id="top" className="min-h-screen bg-white text-[#111827] pb-14 md:pb-0">
      {/* 1. NAVIGATION — Page-Load Downward Reveal (500ms, delay 0ms, cubic-bezier(0.22, 1, 0.36, 1)) */}
      <motion.header
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0, ease: EASE_OUT_EXPO }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xs border-b border-[#E5E7EB]"
            : "bg-white border-b border-[#E5E7EB]"
        }`}
      >
        <div
          className={`max-w-[1280px] mx-auto px-4 sm:px-8 flex items-center justify-between transition-transform duration-300 ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => handleNavClick(e, "#top")}
            className="text-sm sm:text-base font-semibold tracking-tight text-[#111827] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
          >
            K H Plumbing Supply
          </a>

          {/* Zone 2: Clean text navigation links with active section indicator */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#667085]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative py-1 transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-[#111827] font-semibold"
                      : "hover:text-[#111827]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeNavUnderline"
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#155EEF]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions + Mobile/Tablet Hamburger Button */}
          <div className="flex items-center gap-2.5">
            <a
              href="#visit"
              onClick={(e) => {
                e.preventDefault();
                scrollToVisitSection();
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111827] border border-[#E5E7EB] hover:border-[#111827] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <span>Visit Counter</span>
            </a>

            <a
              href={BUSINESS_INFO.phoneHref}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#155EEF] text-white text-xs font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Us</span>
            </a>

            {/* Hamburger Trigger — Mobile & Tablet (lg:hidden) */}
            <button
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-expanded={drawerOpen}
              aria-controls="mobile-tablet-drawer"
              aria-label={
                drawerOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111827] transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
            >
              {drawerOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Subtle Compositor-Only Top Scroll Progress Hairline */}
        {!prefersReducedMotion && (
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="origin-left h-[2px] bg-[#155EEF] w-full"
          />
        )}
      </motion.header>

      {/* SLIDE-IN NAVIGATION DRAWER FOR MOBILE & TABLET */}
      <AnimatePresence>
        {drawerOpen && (
          <div
            id="mobile-tablet-drawer"
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation drawer"
          >
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#111827]/60 backdrop-blur-xs"
            />

            {/* Slide-In Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white border-l border-[#E5E7EB] flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                {/* Drawer Top Bar */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-[#E5E7EB]">
                  <span className="text-sm font-semibold tracking-tight text-[#111827]">
                    K H Plumbing Supply
                  </span>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center justify-center w-10 h-10 border border-[#E5E7EB] text-[#111827] hover:border-[#111827] transition-colors duration-150"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staggered Drawer Links */}
                <nav
                  aria-label="Drawer navigation"
                  className="divide-y divide-[#E5E7EB] border-b border-[#E5E7EB]"
                >
                  {NAV_LINKS.map((link, idx) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, x: 16 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05 + idx * 0.04,
                        ease: EASE_OUT_EXPO,
                      }}
                      className="group flex items-center justify-between px-6 py-4 text-base font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-colors duration-150"
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="text-xs font-mono tabular-nums text-[#155EEF]">
                          {link.number}
                        </span>
                        <span className="group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all duration-200">
                          {link.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all duration-200" />
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer Contact Info & Actions */}
              <div className="p-6 bg-[#F5F7FA] border-t border-[#E5E7EB] space-y-5">
                <div>
                  <div className="text-xs font-semibold text-[#155EEF] mb-1">
                    San Francisco Counter · Walk-In
                  </div>
                  <div className="text-sm font-semibold text-[#111827] font-mono tabular-nums">
                    {BUSINESS_INFO.addressLine1}, {BUSINESS_INFO.addressLine2}
                  </div>
                  <div className="text-xs text-[#667085] mt-1">
                    No booking required — visit, call, or email.
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    onClick={() => setDrawerOpen(false)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#155EEF] text-white text-xs font-semibold hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Us</span>
                  </a>

                  <a
                    href="#visit"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToVisitSection();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#111827] text-[#111827] text-xs font-semibold hover:bg-[#111827] hover:text-white transition-colors whitespace-nowrap"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Visit Counter & Hours</span>
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="pt-16">
        {/* 2. HERO SECTION — Choreographed Load Sequence + Subtle Scroll Parallax */}
        <section
          ref={heroRef}
          className="relative w-full min-h-[580px] lg:min-h-[680px] flex items-end bg-[#111827] overflow-hidden"
        >
          {/* Full-width supply house photograph with subtle scroll parallax */}
          <motion.div
            style={{ y: heroParallaxY }}
            className="absolute inset-0"
          >
            <ResilientImage
              src={IMAGES.hero}
              alt="Organized brass valves, copper pipe fittings, and industrial shelving at K H Plumbing Supply Counter in San Francisco"
              containerClassName="w-full h-full"
              priority={true}
              maskReveal={false}
            />
            {/* Measured contrast scrim for guaranteed WCAG AA legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/70 to-[#111827]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/85 via-[#111827]/45 to-transparent" />
          </motion.div>

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pt-24 pb-14 sm:pb-20">
            <div className="max-w-3xl">
              {/* Hero label — Fade upward 16px, duration 500ms, delay 100ms */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 10 : 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: isMobile ? 0.45 : 0.5,
                  delay: 0.1,
                  ease: EASE_OUT_EXPO,
                }}
                className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/85 mb-5"
              >
                <span>San Francisco</span>
                <span aria-hidden="true">·</span>
                <span>Plumbing Supply</span>
              </motion.div>

              {/* Hero headline — Fade upward 28px, duration 700ms, delay 150ms */}
              <motion.h1
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 18 : 28 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: isMobile ? 0.55 : 0.7,
                  delay: 0.15,
                  ease: EASE_OUT_EXPO,
                }}
                className="headline-display text-white mb-6 max-w-2xl"
              >
                Find the right part.
              </motion.h1>

              {/* Hero body — Fade upward 20px, duration 600ms, delay 250ms */}
              <motion.p
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 14 : 20 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: isMobile ? 0.5 : 0.6,
                  delay: 0.25,
                  ease: EASE_OUT_EXPO,
                }}
                className="body-lg text-gray-200 max-w-xl mb-8"
              >
                Plumbing supplies, fittings, fixtures, and hard-to-find parts.
              </motion.p>

              {/* Hero CTAs — Fade upward 16px, duration 500ms, delay 350ms */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: isMobile ? 12 : 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: isMobile ? 0.45 : 0.5,
                  delay: 0.35,
                  ease: EASE_OUT_EXPO,
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10"
              >
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#155EEF] text-white text-sm font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call the Counter</span>
                </a>

                <a
                  href="#visit"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToVisitSection();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-semibold hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </motion.div>

              {/* Hero Micro Copy */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.45,
                  ease: EASE_OUT_EXPO,
                }}
                className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-300 tracking-[0.01em]"
              >
                <div className="flex items-center gap-2.5 font-medium">
                  <span>Contractors</span>
                  <span aria-hidden="true">·</span>
                  <span>Pros</span>
                  <span aria-hidden="true">·</span>
                  <span>Homeowners</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 font-mono tabular-nums">
                  <span>2272 Shafter Ave, SF</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. QUICK ACCESS STRIP (Staggered Entrance + Hover Hairline Sweep) */}
        <section
          aria-label="Quick product categories"
          className="border-b border-[#E5E7EB] bg-[#F5F7FA]"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
              {QUICK_CATEGORIES.map((cat, idx) => (
                <RevealBlock
                  key={cat.id}
                  delay={idx * 0.06}
                  distance={14}
                  duration={0.5}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickCategoryClick(cat.targetCategoryNumber)
                    }
                    className="group relative w-full flex items-center justify-between px-6 py-5 text-left bg-[#F5F7FA] hover:bg-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#155EEF] overflow-hidden"
                  >
                    <div className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                      <div className="text-xs font-mono tabular-nums text-[#667085] mb-1">
                        {cat.targetCategoryNumber}
                      </div>
                      <div className="text-sm font-semibold tracking-tight text-[#111827] group-hover:text-[#155EEF] transition-colors duration-200">
                        {cat.label}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0" />
                    {/* Bottom hover accent sweep */}
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#155EEF] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  </button>
                </RevealBlock>
              ))}
            </div>
          </div>
        </section>

        {/* 4. MAIN VALUE SECTION — "THE SUPPLY HOUSE" (Sticky Left Editorial Column on Desktop) */}
        <section className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Pinned/Sticky Core Editorial Message */}
              <div className="lg:col-span-6 lg:sticky lg:top-28">
                <RevealLabel className="section-kicker text-[#155EEF] mb-4">
                  The Supply House
                </RevealLabel>

                <RevealHeadline className="headline-lg text-[#111827] mb-6">
                  Less searching.
                  <br />
                  More solving.
                </RevealHeadline>

                <RevealBlock delay={0.1} distance={18}>
                  <p className="body-lg text-[#667085] max-w-md mb-8">
                    Bring us the part, a photo, or the details. We&apos;ll help
                    you find the right solution.
                  </p>
                </RevealBlock>

                <RevealRule className="border-t border-[#E5E7EB] mb-6" />

                <RevealBlock
                  delay={0.16}
                  distance={14}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-[#111827]">
                      Need the right plumbing part? Start here.
                    </div>
                    <div className="text-xs text-[#667085] mt-0.5">
                      No booking needed — walk in, call, or email the counter.
                    </div>
                  </div>

                  <a
                    href="#visit"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToVisitSection("Counter Part Identification");
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#111827] text-xs font-semibold text-[#111827] hover:bg-[#111827] hover:text-white hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    <span>Visit or Contact KH</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </RevealBlock>
              </div>

              {/* Right Column: Interactive Counter Workflow Panel */}
              <RevealBlock
                delay={0.12}
                distance={24}
                className="lg:col-span-6"
              >
                <div className="border border-[#E5E7EB] bg-[#F5F7FA] p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7EB]">
                    <span className="text-xs font-semibold text-[#111827]">
                      How the Counter Helps You Match Parts
                    </span>
                    <span className="text-xs font-mono tabular-nums text-[#667085]">
                      Walk-In · No Appointment
                    </span>
                  </div>

                  {/* Interactive 3-method selector with smooth AnimatePresence expansion */}
                  <div className="divide-y divide-[#E5E7EB] border-t border-b border-[#E5E7EB] bg-white">
                    {counterMethods.map((method, idx) => {
                      const isActive = activeCounterMethod === idx;
                      return (
                        <div key={method.index}>
                          <button
                            type="button"
                            onClick={() => setActiveCounterMethod(idx)}
                            className="group w-full flex items-start justify-between gap-4 p-4 sm:p-5 text-left hover:bg-[#F5F7FA]/60 transition-colors duration-200"
                          >
                            <div className="flex items-start gap-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                              <span
                                className={`text-xs font-mono tabular-nums font-semibold mt-0.5 ${
                                  isActive ? "text-[#155EEF]" : "text-[#667085]"
                                }`}
                              >
                                {method.index}.
                              </span>
                              <div>
                                <div className="text-sm font-semibold text-[#111827]">
                                  {method.title}
                                </div>
                                <div className="text-xs text-[#667085] mt-1">
                                  {method.summary}
                                </div>
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-[#667085] shrink-0 mt-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                isActive ? "rotate-180 text-[#155EEF]" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.32,
                                  ease: EASE_OUT_EXPO,
                                }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 sm:px-5 pb-5 pl-11 text-xs text-[#667085] leading-relaxed border-t border-[#E5E7EB]/60 pt-3 bg-[#F5F7FA]/40">
                                  {method.detail}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
                    <span>Questions before driving over?</span>
                    <a
                      href="#visit"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToVisitSection();
                      }}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#155EEF] hover:text-[#111827] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <span>Visit, Call, or Email Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>

        {/* VISUAL SECTION 1 — "INSIDE THE COUNTER" (Mask Reveal + Subtle Parallax) */}
        <section
          id="counter-floor"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-[#F5F7FA] scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  Inside the Counter
                </RevealLabel>
                <RevealHeadline className="headline-lg text-[#111827]">
                  Stocked for the job.
                </RevealHeadline>
              </div>

              <RevealBlock delay={0.1}>
                <a
                  href="#visit"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToVisitSection("Counter Stock");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111827] hover:text-[#155EEF] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                >
                  <span>2272 Shafter Ave</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </RevealBlock>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Wide Warehouse Aisle Photograph with Subtle Parallax */}
              <RevealBlock
                delay={0.05}
                distance={24}
                className="lg:col-span-8"
              >
                <a
                  href="#visit"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToVisitSection("Pipe & Shelving Stock");
                  }}
                  className="group block h-full border border-[#E5E7EB] bg-white p-2.5 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                >
                  <ResilientImage
                    src={IMAGES.shelvingAisle}
                    alt="Organized industrial steel racks stocked with copper tubing, fittings, and valve bins at K H Plumbing Supply"
                    containerClassName="aspect-16/9 w-full"
                    fallbackTitle="Supply House Shelving"
                    hoverScale={true}
                    enableParallax={true}
                    parallaxIntensity={18}
                  />
                  <div className="flex items-center justify-between px-2 pt-3 pb-1 text-xs">
                    <span className="font-semibold text-[#111827] group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      01 · Organized Parts Bins & Pipe Racks
                    </span>
                    <span className="font-mono tabular-nums text-[#667085] group-hover:text-[#155EEF] transition-colors">
                      Walk-In Counter →
                    </span>
                  </div>
                </a>
              </RevealBlock>

              {/* Brass Valves Close-Up Photograph */}
              <RevealBlock
                delay={0.14}
                distance={24}
                className="lg:col-span-4"
              >
                <a
                  href="#visit"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToVisitSection("Valves & Brass Components");
                  }}
                  className="group flex flex-col justify-between h-full border border-[#E5E7EB] bg-white p-2.5 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                >
                  <ResilientImage
                    src={IMAGES.brassValves}
                    alt="Forged solid brass ball valves and pressure regulators on steel supply counter"
                    containerClassName="aspect-4/3 lg:aspect-auto lg:h-full w-full min-h-[240px]"
                    fallbackTitle="Forged Brass Valves"
                    hoverScale={true}
                    enableParallax={true}
                    parallaxIntensity={14}
                  />
                  <div className="flex items-center justify-between px-2 pt-3 pb-1 text-xs">
                    <span className="font-semibold text-[#111827] group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      02 · Forged Brass & Valves
                    </span>
                    <span className="font-mono tabular-nums text-[#667085] group-hover:text-[#155EEF] transition-colors">
                      Visit →
                    </span>
                  </div>
                </a>
              </RevealBlock>
            </div>
          </div>
        </section>

        {/* 5. PRODUCTS SECTION ("WHAT WE CARRY") + PRODUCT DETAIL STRIP */}
        <section
          id="products"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-white scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
              <div>
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  What We Carry
                </RevealLabel>
                <RevealHeadline className="headline-lg text-[#111827]">
                  Plumbing, covered.
                </RevealHeadline>
              </div>

              <RevealBlock delay={0.1}>
                <p className="body-md text-[#667085] max-w-sm">
                  Select any counter department below to inspect stocked
                  fittings, components, and sizing notes.
                </p>
              </RevealBlock>
            </div>

            {/* Six Numbered Supply Counter Rows — Stagger 70ms, Y: 20px -> 0, Duration: 550ms */}
            <RevealRule className="border-t border-[#E5E7EB]" />
            <div>
              {PRODUCT_CATEGORIES.map((category, index) => {
                const isExpanded = expandedCategory === category.number;
                return (
                  <RevealBlock
                    key={category.number}
                    delay={index * 0.07}
                    distance={20}
                    duration={0.55}
                    className="border-b border-[#E5E7EB]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategory(
                          isExpanded ? "" : category.number
                        )
                      }
                      aria-expanded={isExpanded}
                      className="group relative w-full py-6 sm:py-7 px-2 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-[#F5F7FA] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                    >
                      <div className="flex items-baseline gap-5 sm:gap-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                        <span
                          className={`text-sm font-mono tabular-nums font-semibold transition-colors duration-200 ${
                            isExpanded ? "text-[#155EEF]" : "text-[#667085]"
                          }`}
                        >
                          {category.number}
                        </span>
                        <h3 className="headline-md text-[#111827] group-hover:text-[#155EEF] transition-colors duration-300">
                          {category.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 pl-9 sm:pl-0">
                        <span className="body-md text-[#667085]">
                          {category.description}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111827] group-hover:text-[#155EEF] whitespace-nowrap shrink-0">
                          <span className="hidden md:inline group-hover:underline underline-offset-4">
                            {isExpanded ? "Close" : "Counter Specs"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                              isExpanded ? "rotate-180 text-[#155EEF]" : ""
                            }`}
                          />
                        </span>
                      </div>
                    </button>

                    {/* Smooth Expandable Counter Spec Sheet */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.38,
                            ease: EASE_OUT_EXPO,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="bg-[#F5F7FA] border-t border-[#E5E7EB] px-4 sm:px-14 py-6 sm:py-8">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                              <div className="lg:col-span-7">
                                <div className="text-xs font-semibold text-[#111827] mb-3">
                                  Commonly Stocked at the Counter
                                </div>
                                <ul className="space-y-2 mb-5">
                                  {category.stockedItems.map((item, idx) => (
                                    <motion.li
                                      key={idx}
                                      initial={
                                        prefersReducedMotion
                                          ? false
                                          : { opacity: 0, x: -8 }
                                      }
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: idx * 0.05,
                                        ease: EASE_OUT_EXPO,
                                      }}
                                      className="flex items-start gap-2.5 text-sm text-[#111827]"
                                    >
                                      <span className="font-mono tabular-nums text-xs text-[#155EEF] mt-0.5 shrink-0">
                                        0{idx + 1}
                                      </span>
                                      <span>{item}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                                <div className="text-xs font-mono tabular-nums text-[#667085] pt-3 border-t border-[#E5E7EB]">
                                  {category.materialsAndSpecs}
                                </div>
                              </div>

                              <div className="lg:col-span-5 bg-white border border-[#E5E7EB] p-5">
                                <div className="text-xs font-semibold text-[#111827] mb-1.5">
                                  Counter Identification Note
                                </div>
                                <p className="text-xs text-[#667085] leading-relaxed mb-5">
                                  {category.counterTip}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                  <a
                                    href={BUSINESS_INFO.phoneHref}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#155EEF] text-white text-xs font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Call Us</span>
                                  </a>
                                  <a
                                    href="#visit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      scrollToVisitSection(category.title);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#E5E7EB] hover:border-[#111827] hover:translate-x-0.5 text-xs font-semibold text-[#111827] transition-all duration-200 whitespace-nowrap shrink-0"
                                  >
                                    <span>Visit KH Counter</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </RevealBlock>
                );
              })}
            </div>

            {/* PRODUCT DETAIL STRIP — Three large editorial images: FITTINGS, FIXTURES, REPAIR PARTS */}
            <div className="mt-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PRODUCT_STRIP_ITEMS.map((item, idx) => (
                  <RevealBlock
                    key={item.id}
                    delay={idx * 0.08}
                    distance={22}
                    duration={0.6}
                  >
                    <a
                      href="#visit"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToVisitSection(item.title);
                      }}
                      className="group block border border-[#E5E7EB] bg-white focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#111827]">
                        <ResilientImage
                          src={item.image}
                          alt={`${item.title} stocked at K H Plumbing Supply San Francisco`}
                          containerClassName="w-full h-full"
                          fallbackTitle={item.title}
                          hoverScale={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 via-[#111827]/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between text-white">
                          <div className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                            <div className="text-xs font-mono tabular-nums text-gray-300 mb-1">
                              {item.categoryNumber}
                            </div>
                            <h3 className="text-xl font-semibold tracking-tight text-white">
                              {item.title}
                            </h3>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] whitespace-nowrap shrink-0">
                            <span className="underline-offset-4 group-hover:underline">
                              Explore
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </a>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. HARD-TO-FIND PARTS SECTION (Parallax Close-Up + Sticky Counter Callout) */}
        <section
          id="hard-to-find"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-[#F5F7FA] scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Visual Column: Close-up photograph with scroll parallax */}
              <RevealBlock
                delay={0.05}
                distance={24}
                className="lg:col-span-7"
              >
                <div className="border border-[#E5E7EB] bg-white p-2 sm:p-3">
                  <ResilientImage
                    src={IMAGES.hardToFind}
                    alt="Close-up of an old tarnished brass valve stem matched next to a precision-machined replacement part and calipers on the K H Plumbing Supply counter"
                    containerClassName="aspect-4/3 w-full"
                    fallbackTitle="Hard-to-Find Replacement Parts"
                    enableParallax={true}
                    parallaxIntensity={20}
                  />
                  <div className="flex items-center justify-between px-2 pt-3 pb-1 text-xs text-[#667085]">
                    <span>
                      Counter Part Identification · Stems, Cartridges & Unions
                    </span>
                    <span className="font-mono tabular-nums">
                      2272 Shafter Ave
                    </span>
                  </div>
                </div>
              </RevealBlock>

              {/* Editorial Copy Column — Sticky on Desktop */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  Replacement & Identification
                </RevealLabel>

                <RevealHeadline className="headline-lg text-[#111827] mb-3">
                  Can&apos;t find the part?
                </RevealHeadline>

                <RevealBlock delay={0.1} distance={16}>
                  <div className="headline-md text-[#155EEF] mb-6">
                    Bring it in.
                  </div>

                  <p className="body-lg text-[#667085] mb-8">
                    Photos, measurements, model numbers, or the old part can
                    help us identify what you need.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#155EEF] text-white text-sm font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Us</span>
                    </a>

                    <a
                      href="#visit"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToVisitSection(
                          "Hard-to-Find Part Identification"
                        );
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#111827] text-[#111827] text-sm font-semibold hover:bg-[#111827] hover:text-white hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <span>Visit the Counter</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </RevealBlock>
              </div>
            </div>
          </div>
        </section>

        {/* VISUAL SECTION 2 — "MATERIALS & CONNECTIONS" (Horizontal Scroll Filmstrip + Progress Bar) */}
        <section
          id="materials"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-white scroll-mt-14 overflow-hidden"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  Materials
                </RevealLabel>
                <RevealHeadline className="headline-lg text-[#111827]">
                  Built to hold.
                </RevealHeadline>
              </div>

              {/* Horizontal Rail Controls & Material Metadata */}
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-xs font-mono tabular-nums text-[#667085]">
                  Copper · Cast Iron · Brass · Stainless
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollMaterialsRail("prev")}
                    aria-label="Scroll materials left"
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111827] transition-colors duration-150"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollMaterialsRail("next")}
                    aria-label="Scroll materials right"
                    className="inline-flex items-center justify-center w-9 h-9 border border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111827] transition-colors duration-150"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Scroll Filmstrip Rail */}
            <div
              ref={materialsRailRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {MATERIALS_SHOWCASE.map((mat, idx) => (
                <RevealBlock
                  key={mat.index}
                  delay={idx * 0.07}
                  distance={20}
                  duration={0.55}
                  className="min-w-[82vw] sm:min-w-[340px] lg:min-w-[360px] flex-1 snap-start"
                >
                  <a
                    href="#visit"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToVisitSection(mat.title);
                    }}
                    className="group block border border-[#E5E7EB] bg-[#F5F7FA] p-2.5 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                  >
                    <ResilientImage
                      src={mat.image}
                      alt={`${mat.title} plumbing fittings and components at K H Plumbing Supply`}
                      containerClassName="aspect-4/3 w-full"
                      fallbackTitle={mat.title}
                      hoverScale={true}
                    />
                    <div className="pt-3.5 pb-1.5 px-1.5 flex items-end justify-between gap-2">
                      <div className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                        <div className="text-xs font-mono tabular-nums text-[#155EEF] mb-0.5">
                          {mat.index}
                        </div>
                        <h3 className="text-base font-semibold text-[#111827] tracking-tight">
                          {mat.title}
                        </h3>
                        <div className="text-xs text-[#667085] mt-0.5">
                          {mat.shortSpec}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 mb-0.5" />
                    </div>
                  </a>
                </RevealBlock>
              ))}
            </div>

            {/* Horizontal Rail Progress Hairline */}
            <div className="mt-2 h-[2px] w-full bg-[#E5E7EB] overflow-hidden">
              <motion.div
                style={{ scaleX: materialsScrollX }}
                className="origin-left h-full bg-[#155EEF] w-full"
              />
            </div>
          </div>
        </section>

        {/* 7. PROFESSIONALS SECTION (Dark Background Transition) */}
        <section className="py-20 lg:py-28 bg-[#111827] text-white tracking-[0.01em]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-7">
                <RevealLabel className="section-kicker text-[#155EEF] mb-4">
                  Built for the Job
                </RevealLabel>

                <RevealHeadline className="headline-lg text-white mb-6">
                  Get in.
                  <br />
                  Get what you need.
                  <br />
                  Get back to work.
                </RevealHeadline>

                <RevealBlock delay={0.12} distance={18}>
                  <p className="body-lg text-gray-300 max-w-xl">
                    Straightforward plumbing supply for contractors, maintenance
                    teams, and working professionals.
                  </p>
                </RevealBlock>
              </div>

              <div className="lg:col-span-5">
                <div className="border border-white/15 bg-white/5 p-6 sm:p-8 space-y-5">
                  {[
                    {
                      num: "01 · Direct Counter Service",
                      text: "Walk straight up to the counter at 2272 Shafter Ave — no booking required",
                    },
                    {
                      num: "02 · San Francisco Building Stock",
                      text: "Fittings, valves, and repair internals for older and modern SF systems",
                    },
                    {
                      num: "03 · Fast Corridor Access",
                      text: "Minutes off US-101, I-280, and 3rd Street in Bayview",
                    },
                  ].map((item, idx) => (
                    <RevealBlock
                      key={item.num}
                      delay={0.08 + idx * 0.07}
                      distance={16}
                      className={
                        idx < 2 ? "pb-4 border-b border-white/15" : ""
                      }
                    >
                      <div className="text-xs font-mono tabular-nums text-gray-400 mb-1">
                        {item.num}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {item.text}
                      </div>
                    </RevealBlock>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. HOMEOWNER SECTION (White Background) */}
        <section className="py-20 lg:py-24 border-b border-[#E5E7EB] bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="max-w-3xl">
              <RevealHeadline className="headline-lg text-[#111827] mb-4">
                Not a plumber?
              </RevealHeadline>

              <RevealBlock delay={0.08} distance={18}>
                <p className="body-lg text-[#667085] max-w-xl mb-8">
                  That&apos;s okay. Bring the old part or a photo. We&apos;ll
                  help you identify what you need.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href="#visit"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToVisitSection("Homeowner Part Identification");
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111827] text-white text-sm font-semibold hover:bg-[#155EEF] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <span>Ask the Counter</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border border-[#E5E7EB] hover:border-[#111827] hover:translate-x-0.5 text-[#111827] text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4 text-[#155EEF]" />
                    <span>Call Us</span>
                  </a>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>

        {/* 9. WHY KH SECTION (Staggered 4-Point Grid) */}
        <section className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-[#F5F7FA]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <RevealHeadline className="headline-lg text-[#111827] mb-12">
              Why KH?
            </RevealHeadline>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E5E7EB] bg-white">
              {WHY_KH_POINTS.map((point, idx) => (
                <RevealBlock
                  key={point.index}
                  delay={idx * 0.07}
                  distance={20}
                  duration={0.55}
                  className="group p-6 sm:p-8 border-r border-b border-[#E5E7EB] flex flex-col justify-between hover:bg-[#F5F7FA]/60 transition-colors duration-300"
                >
                  <div>
                    <div className="text-xs font-mono tabular-nums text-[#155EEF] font-semibold mb-4">
                      {point.index}
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#111827] mb-2 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                      {point.title}
                    </h3>
                    <p className="text-base font-medium text-[#111827] mb-3">
                      {point.description}
                    </p>
                  </div>
                  <p className="text-xs text-[#667085] leading-relaxed pt-4 border-t border-[#E5E7EB]">
                    {point.detail}
                  </p>
                </RevealBlock>
              ))}
            </div>
          </div>
        </section>

        {/* 10. ABOUT + BRANDS SECTION */}
        <section
          id="about"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-white scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: About KH */}
              <div className="lg:col-span-6">
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  About KH
                </RevealLabel>

                <RevealHeadline className="headline-lg text-[#111827] mb-6">
                  A practical supply house
                  <br />
                  for San Francisco.
                </RevealHeadline>

                <RevealBlock delay={0.1} distance={18}>
                  <p className="body-lg text-[#667085] max-w-lg mb-8">
                    K H Plumbing Supply Inc. serves contractors, professionals,
                    and customers looking for the right plumbing parts and
                    supplies.
                  </p>

                  <RevealRule className="border-t border-[#E5E7EB] mb-6" />

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#667085] font-mono tabular-nums">
                    <span>Established 2006</span>
                    <span aria-hidden="true">·</span>
                    <span>2272 Shafter Ave, San Francisco</span>
                    <span aria-hidden="true">·</span>
                    <span>CA Corp</span>
                  </div>
                </RevealBlock>
              </div>

              {/* Right Column: Brands We Carry */}
              <RevealBlock
                delay={0.14}
                distance={22}
                className="lg:col-span-6"
              >
                <div className="border border-[#E5E7EB] bg-[#F5F7FA] p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7EB]">
                    <span className="section-kicker text-[#111827]">
                      Brands Commonly Sourced at KH
                    </span>
                    <span className="text-xs text-[#667085]">
                      Select to view parts focus
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
                    {CONFIRMED_BRANDS.map((brand, idx) => {
                      const isSelected = selectedBrandIndex === idx;
                      return (
                        <button
                          key={brand.name}
                          type="button"
                          onClick={() => setSelectedBrandIndex(idx)}
                          className={`px-3 py-3 text-sm font-semibold border text-center transition-colors duration-200 whitespace-nowrap shrink-0 ${
                            isSelected
                              ? "border-[#155EEF] bg-[#111827] text-white"
                              : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111827]"
                          }`}
                        >
                          {brand.name}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={CONFIRMED_BRANDS[selectedBrandIndex].name}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                      className="bg-white border border-[#E5E7EB] p-5 mb-4"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-[#111827]">
                          {CONFIRMED_BRANDS[selectedBrandIndex].name}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-[#155EEF]">
                          Fixtures & Replacement Parts
                        </span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed">
                        {CONFIRMED_BRANDS[selectedBrandIndex].focus}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <p className="text-xs text-[#667085] leading-relaxed">
                    Current stock varies by series and model number. Visit
                    2272 Shafter Ave, call the counter, or email us to confirm
                    availability.
                  </p>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION — Masonry Grid with Smooth Layout & Filter Transitions */}
        <section
          id="gallery"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-[#F5F7FA] scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                  Gallery
                </RevealLabel>
                <RevealHeadline className="headline-lg text-[#111827]">
                  At the supply house.
                </RevealHeadline>
              </div>

              {/* Clean Segmented Filter Controls */}
              <RevealBlock delay={0.1}>
                <div
                  role="group"
                  aria-label="Filter gallery photos"
                  className="flex flex-wrap items-center gap-1 p-1 bg-white border border-[#E5E7EB] self-start md:self-auto"
                >
                  {(["All", "Counter", "Parts", "Interior"] as const).map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setGalleryFilter(filter)}
                        className={`px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 whitespace-nowrap shrink-0 ${
                          galleryFilter === filter
                            ? "bg-[#111827] text-white"
                            : "text-[#667085] hover:text-[#111827]"
                        }`}
                      >
                        {filter === "All"
                          ? "All Views"
                          : filter === "Counter"
                          ? "Counter Service"
                          : filter === "Parts"
                          ? "Shelf Parts"
                          : "Supply Interior"}
                      </button>
                    )
                  )}
                </div>
              </RevealBlock>
            </div>

            {/* Masonry Grid Layout with Animated Filter Transitions */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence mode="popLayout">
                {GALLERY_ITEMS.filter(
                  (item) =>
                    galleryFilter === "All" || item.category === galleryFilter
                ).map((item, idx) => (
                  <motion.a
                    layout
                    key={item.id}
                    href="#visit"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToVisitSection(item.title);
                    }}
                    initial={
                      prefersReducedMotion ? false : { opacity: 0, y: 18 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      duration: 0.45,
                      delay: idx * 0.05,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="group block break-inside-avoid border border-[#E5E7EB] bg-white p-2.5 focus-visible:outline-2 focus-visible:outline-[#155EEF]"
                  >
                    <ResilientImage
                      src={item.image}
                      alt={`${item.title} — ${item.caption}`}
                      containerClassName={`${item.aspectClass} w-full`}
                      fallbackTitle={item.title}
                      hoverScale={true}
                    />
                    <div className="pt-3.5 pb-1.5 px-1.5">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-[#667085]">
                          <span className="text-[#155EEF] font-semibold">
                            {item.index}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#667085] group-hover:text-[#155EEF] group-hover:translate-x-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#111827] tracking-tight group-hover:translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 11. LOCATION & HOURS SECTION ("VISIT KH") */}
        <section
          id="visit"
          className="py-20 lg:py-28 border-b border-[#E5E7EB] bg-white scroll-mt-14"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="mb-10">
              <RevealLabel className="section-kicker text-[#155EEF] mb-3">
                Visit KH
              </RevealLabel>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <RevealHeadline className="headline-lg text-[#111827]">
                  Come by the counter.
                </RevealHeadline>

                <RevealBlock delay={0.1}>
                  <p className="body-md text-[#667085] max-w-md">
                    No online booking or appointment needed. Walk right in with
                    your part, call the counter directly, or email us your
                    details.
                  </p>
                </RevealBlock>
              </div>

              <AnimatePresence>
                {visitTopic && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    className="mt-6 p-4 bg-[#F5F7FA] border-l-4 border-[#155EEF] flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="text-sm text-[#111827]">
                      <span className="font-semibold">
                        Inquiring about {visitTopic}:
                      </span>{" "}
                      <span className="text-[#667085]">
                        No booking required — bring your part or photo to{" "}
                        <span className="font-mono tabular-nums text-[#111827]">
                          2272 Shafter Ave
                        </span>
                        , call{" "}
                        <span className="font-mono tabular-nums text-[#111827]">
                          {BUSINESS_INFO.phoneDisplay}
                        </span>
                        , or email{" "}
                        <span className="font-mono text-[#111827]">
                          {BUSINESS_INFO.emailDisplay}
                        </span>
                        .
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVisitTopic("")}
                      className="text-xs font-semibold text-[#667085] hover:text-[#111827] whitespace-nowrap shrink-0"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Direct Contact Channels (Visit, Call, Email) + Hours */}
              <RevealBlock
                delay={0.06}
                distance={22}
                className="lg:col-span-5 space-y-8"
              >
                <div className="border border-[#E5E7EB] p-6 sm:p-8 bg-[#F5F7FA]">
                  <div className="pb-5 mb-5 border-b border-[#E5E7EB]">
                    <div className="text-xs font-semibold text-[#155EEF] mb-1">
                      Direct Counter Contact · Walk-Ins Welcome
                    </div>
                    <p className="text-xs text-[#667085] leading-relaxed">
                      Visit us in person, call the counter for immediate stock
                      checks, or email part photos and specifications. No
                      appointment or booking is needed.
                    </p>
                  </div>

                  <div className="space-y-6 pb-6 border-b border-[#E5E7EB]">
                    {/* 1. Visit Address */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold text-[#667085] mb-1">
                          01 · Visit the Counter
                        </div>
                        <address className="not-italic text-base font-semibold text-[#111827] font-mono tabular-nums leading-snug">
                          {BUSINESS_INFO.addressLine1}
                          <br />
                          {BUSINESS_INFO.addressLine2}
                        </address>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:border-[#111827] transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedAddress ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#155EEF]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Address</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 2. Call Phone */}
                    <div className="flex items-start justify-between gap-4 pt-5 border-t border-[#E5E7EB]">
                      <div>
                        <div className="text-xs font-semibold text-[#667085] mb-1">
                          02 · Call the Counter
                        </div>
                        <a
                          href={BUSINESS_INFO.phoneHref}
                          className="text-base font-semibold text-[#111827] hover:text-[#155EEF] transition-colors font-mono tabular-nums"
                        >
                          {BUSINESS_INFO.phoneDisplay}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPhone}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:border-[#111827] transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedPhone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#155EEF]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Phone</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 3. Email Contact */}
                    <div className="flex items-start justify-between gap-4 pt-5 border-t border-[#E5E7EB]">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#667085] mb-1">
                          03 · Email Part Photos or Questions
                        </div>
                        <a
                          href={BUSINESS_INFO.emailHref}
                          className="text-sm sm:text-base font-semibold text-[#111827] hover:text-[#155EEF] transition-colors font-mono break-all"
                        >
                          {BUSINESS_INFO.emailDisplay}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] hover:border-[#111827] transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#155EEF]" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Primary, Secondary & Email CTAs */}
                  <div className="pt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                    <a
                      href={BUSINESS_INFO.directionsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#155EEF] text-white text-sm font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Get Directions</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#111827] text-[#111827] text-sm font-semibold hover:bg-[#111827] hover:text-white hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Us</span>
                    </a>

                    <a
                      href={BUSINESS_INFO.emailHref}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-[#E5E7EB] text-[#111827] text-sm font-semibold hover:border-[#111827] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                    >
                      <Mail className="w-4 h-4 text-[#155EEF]" />
                      <span>Email Us</span>
                    </a>
                  </div>
                </div>

                {/* Hours Block */}
                <div className="border border-[#E5E7EB] p-6 sm:p-8 bg-white">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#155EEF]" />
                      <h3 className="text-sm font-semibold text-[#111827]">
                        Hours
                      </h3>
                    </div>
                    <span className="text-xs text-[#667085]">
                      Walk-In Counter Schedule
                    </span>
                  </div>

                  <div className="divide-y divide-[#E5E7EB]">
                    {COUNTER_HOURS.map((row) => (
                      <div
                        key={row.days}
                        className="py-3 flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-[#111827]">
                          {row.days}
                        </span>
                        <span className="font-mono tabular-nums text-[#667085]">
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 pt-4 border-t border-[#E5E7EB] text-xs text-[#667085] leading-relaxed">
                    Note: Closing times can vary by schedule or holiday. Please
                    call{" "}
                    <a
                      href={BUSINESS_INFO.phoneHref}
                      className="font-mono tabular-nums font-semibold text-[#111827] underline underline-offset-2"
                    >
                      {BUSINESS_INFO.phoneDisplay}
                    </a>{" "}
                    to verify same-day counter hours before visiting.
                  </p>
                </div>
              </RevealBlock>

              {/* Right Column: Interactive Bayview Industrial Corridor Diagram & Route Guide */}
              <RevealBlock
                delay={0.14}
                distance={24}
                className="lg:col-span-7 border border-[#E5E7EB] bg-[#F5F7FA] p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E5E7EB]">
                  <div>
                    <div className="text-xs font-mono tabular-nums text-[#667085]">
                      37.7329° N, 122.3982° W · ZIP 94124
                    </div>
                    <h3 className="text-lg font-semibold text-[#111827]">
                      Bayview Supply Counter Locator
                    </h3>
                  </div>

                  <a
                    href={BUSINESS_INFO.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#155EEF] hover:text-[#111827] hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Architectural Street Grid Schematic of 2272 Shafter Ave */}
                <div className="relative bg-[#111827] text-white p-6 sm:p-8 border border-[#111827] mb-6 overflow-hidden">
                  <svg
                    viewBox="0 0 600 260"
                    className="w-full h-auto block"
                    role="img"
                    aria-label="Street schematic showing 2272 Shafter Ave between Industrial Street, Bayshore Blvd, Oakdale Ave, and 3rd Street in San Francisco"
                  >
                    {/* Subtle Grid Lines */}
                    <g stroke="#1F2937" strokeWidth="1">
                      <line x1="0" y1="40" x2="600" y2="40" />
                      <line x1="0" y1="90" x2="600" y2="90" />
                      <line x1="0" y1="190" x2="600" y2="190" />
                      <line x1="0" y1="230" x2="600" y2="230" />
                      <line x1="110" y1="0" x2="110" y2="260" />
                      <line x1="250" y1="0" x2="250" y2="260" />
                      <line x1="420" y1="0" x2="420" y2="260" />
                      <line x1="530" y1="0" x2="530" y2="260" />
                    </g>

                    {/* Major Arterials */}
                    <path
                      d="M 40 0 L 95 260"
                      stroke="#374151"
                      strokeWidth="10"
                      fill="none"
                    />
                    <path
                      d="M 0 65 L 440 260"
                      stroke="#374151"
                      strokeWidth="6"
                      fill="none"
                    />
                    <line
                      x1="80"
                      y1="90"
                      x2="560"
                      y2="90"
                      stroke="#4B5563"
                      strokeWidth="3"
                    />
                    {/* Shafter Ave (Highlighted Street) */}
                    <line
                      x1="90"
                      y1="145"
                      x2="560"
                      y2="145"
                      stroke="#155EEF"
                      strokeWidth="5"
                    />
                    <line
                      x1="530"
                      y1="0"
                      x2="530"
                      y2="260"
                      stroke="#4B5563"
                      strokeWidth="8"
                    />

                    {/* Street Labels */}
                    <text
                      x="18"
                      y="30"
                      fill="#9CA3AF"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      US-101 / BAYSHORE
                    </text>
                    <text
                      x="300"
                      y="82"
                      fill="#9CA3AF"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      OAKDALE AVE
                    </text>
                    <text
                      x="300"
                      y="135"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      SHAFTER AVE
                    </text>
                    <text
                      x="135"
                      y="218"
                      fill="#9CA3AF"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      INDUSTRIAL ST (TO I-280)
                    </text>
                    <text
                      x="465"
                      y="245"
                      fill="#9CA3AF"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      3RD ST
                    </text>

                    {/* 2272 Shafter Ave Marker Pin */}
                    <circle
                      cx="285"
                      cy="145"
                      r="14"
                      fill="#155EEF"
                      fillOpacity="0.28"
                    />
                    <circle
                      cx="285"
                      cy="145"
                      r="7"
                      fill="#155EEF"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Callout Box inside SVG */}
                    <rect
                      x="185"
                      y="164"
                      width="205"
                      height="44"
                      fill="#111827"
                      stroke="#155EEF"
                      strokeWidth="1.5"
                    />
                    <text
                      x="197"
                      y="182"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      K H PLUMBING SUPPLY
                    </text>
                    <text
                      x="197"
                      y="198"
                      fill="#9CA3AF"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      2272 Shafter Ave · SF 94124
                    </text>
                  </svg>
                </div>

                {/* Interactive Corridor Route Selector */}
                <div>
                  <div className="text-xs font-semibold text-[#111827] mb-3">
                    Quick Driving Approach
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(
                      [
                        { key: "us101", label: "From US-101" },
                        { key: "i280", label: "From I-280" },
                        { key: "third", label: "From 3rd St" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveRouteTab(tab.key)}
                        className={`px-3.5 py-2 text-xs font-semibold border transition-colors duration-200 whitespace-nowrap shrink-0 ${
                          activeRouteTab === tab.key
                            ? "border-[#155EEF] bg-[#155EEF] text-white"
                            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-[#111827]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeRouteTab}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                      className="bg-white border border-[#E5E7EB] p-5"
                    >
                      <div className="text-xs font-semibold text-[#111827] mb-2">
                        {routeDirections[activeRouteTab].summary}
                      </div>
                      <ol className="space-y-2">
                        {routeDirections[activeRouteTab].steps.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-xs text-[#667085]"
                          >
                            <span className="font-mono tabular-nums text-[#155EEF] font-semibold shrink-0">
                              0{i + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>

        {/* 12. FINAL CTA SECTION (Dark Full-Width) */}
        <section className="py-24 lg:py-32 bg-[#111827] text-white tracking-[0.01em]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
            <div className="max-w-2xl">
              <RevealLabel className="section-kicker text-[#155EEF] mb-4">
                Need a Part?
              </RevealLabel>

              <RevealHeadline className="headline-display text-white mb-6">
                Let&apos;s find it.
              </RevealHeadline>

              <RevealBlock delay={0.1} distance={18}>
                <p className="body-lg text-gray-300 mb-10">
                  Call the counter, email us, or stop by 2272 Shafter Ave — no
                  booking needed.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
                  <a
                    href={BUSINESS_INFO.phoneHref}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#155EEF] text-white text-sm font-semibold hover:brightness-110 hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call the Counter</span>
                  </a>

                  <a
                    href={BUSINESS_INFO.directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-sm font-semibold hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>

                  <a
                    href={BUSINESS_INFO.emailHref}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-white/10 text-white border border-white/25 text-sm font-semibold hover:translate-x-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Counter</span>
                  </a>
                </div>
              </RevealBlock>
            </div>
          </div>
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer className="bg-[#111827] text-gray-400 border-t border-white/15 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
            <div>
              <div className="text-sm font-semibold text-white tracking-tight mb-2">
                K H Plumbing Supply Inc.
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono tabular-nums text-gray-400">
                <span>2272 Shafter Ave, San Francisco, CA 94124</span>
                <span aria-hidden="true">·</span>
                <a
                  href={BUSINESS_INFO.phoneHref}
                  className="text-white hover:text-[#155EEF] transition-colors"
                >
                  (415) 970-9718
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={BUSINESS_INFO.emailHref}
                  className="text-white hover:text-[#155EEF] transition-colors"
                >
                  {BUSINESS_INFO.emailDisplay}
                </a>
              </div>
            </div>

            <nav
              aria-label="Footer navigation"
              className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-300"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-400">
            <div>© K H Plumbing Supply Inc.</div>
            <div>Plumbing Supply San Francisco · Walk-In Counter Service</div>
          </div>
        </div>
      </footer>

      {/* FIXED MOBILE ACTION BAR (CALL / DIRECTIONS) — <= 15% viewport height */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#111827] border-t border-white/20 grid grid-cols-2 h-12">
        <a
          href={BUSINESS_INFO.phoneHref}
          className="flex items-center justify-center gap-2 bg-[#155EEF] text-white text-xs font-semibold whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call</span>
        </a>
        <a
          href={BUSINESS_INFO.directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#111827] text-white text-xs font-semibold whitespace-nowrap"
        >
          <MapPin className="w-3.5 h-3.5 text-[#155EEF]" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
}
