"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for user reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    requestAnimationFrame(() => {
      setPrefersReducedMotion(mediaQuery.matches);
    });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    // Mobile check to prioritize performance and prevent downloading large files on mobile
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    requestAnimationFrame(() => {
      setIsMobile(mobileQuery.matches);
    });
    
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mobileQuery.addEventListener("change", handleMobileChange);

    // Setup intersection observer to pause video when out of viewport
    const videoElement = videoRef.current;
    if (!videoElement || mediaQuery.matches || mobileQuery.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(() => {});
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const shouldPlayVideo = !prefersReducedMotion && !isMobile;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#07111F]">
      {/* 1. Static Poster Image (rendered at the very bottom as a baseline fallback to prevent blank flashes) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 z-0"
        style={{
          backgroundImage: "url('/images/almi-it-hero-poster.webp')",
          backgroundColor: "#07111F"
        }}
        aria-hidden="true"
      />

      {/* 2. Video Player (rendered above poster, transitions from opacity-0 to opacity-35 when ready) */}
      {shouldPlayVideo && (
        <video
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-0 ${
            videoLoaded ? "opacity-35" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <source src="/videos/almi-it-hero.webm" type="video/webm" />
          <source src="/videos/almi-it-hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* 3. Dark Navy Centered Overlays and Brand Blue Glow */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(7, 17, 31, 0.68) 0%, rgba(7, 17, 31, 0.82) 45%, rgba(7, 17, 31, 0.92) 100%),
            radial-gradient(circle at center, rgba(7, 17, 31, 0.58) 0%, rgba(7, 17, 31, 0.82) 70%),
            radial-gradient(circle at center, rgba(47, 128, 237, 0.12) 0%, transparent 60%)
          `
        }}
      />

      {/* 4. Very Subtle Dotted Pattern Overlay above all filters */}
      <div 
        className="absolute inset-0 z-15 opacity-10" 
        style={{
          backgroundImage: "radial-gradient(rgba(148, 163, 184, 0.1) 1.2px, transparent 0)",
          backgroundSize: "28px 28px"
        }}
      />
    </div>
  );
}
