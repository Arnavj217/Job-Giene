import React, { useEffect, useState } from "react";

interface GenieLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  animate?: boolean;
  isSpeaking?: boolean;
  expression?: "friendly" | "talking" | "thinking";
}

export default function GenieLogo({ 
  size = "md", 
  animate = true, 
  isSpeaking = false,
  expression = "friendly" 
}: GenieLogoProps) {
  // Eye coordinates for subtle automated movement
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      // Small random eye darting coordinates
      const randomX = (Math.random() - 0.5) * 3;
      const randomY = (Math.random() - 0.5) * 1.5;
      setEyeOffset({ x: randomX, y: randomY });
      
      // Reset after a short delay
      setTimeout(() => {
        setEyeOffset({ x: 0, y: 0 });
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, [animate]);

  // Sizing definitions
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    xxl: "w-36 h-36"
  };

  const dimClass = dimensions[size] || dimensions.md;

  return (
    <div className={`relative flex items-center justify-center select-none group transition-all duration-300 ${animate ? "hover:scale-110 active:scale-95" : ""}`}>
      {/* Absolute Speaking sound waves rings */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <span className="absolute w-full h-full rounded-full border-2 border-indigo-500/80 animate-ping opacity-75" />
          <span className="absolute w-[130%] h-[130%] rounded-full border border-cyan-400/60 animate-pulse opacity-40 [animation-duration:1.5s]" />
          <span className="absolute w-[160%] h-[160%] rounded-full border-2 border-purple-500/30 animate-ping opacity-25 [animation-duration:2.5s]" />
        </div>
      )}

      {/* Dynamic Glowing cyan/violet aura in the background */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 via-cyan-400/15 to-blue-500/25 blur-xl transition-all duration-500 ${
        isSpeaking ? "opacity-100 scale-135" : "opacity-70 group-hover:opacity-100 group-hover:scale-125"
      } ${animate ? "animate-pulse" : ""}`} />

      {/* Primary SVG Vector */}
      <svg
        className={`${dimClass} transition-transform duration-500 relative z-10 ${
          isSpeaking 
            ? "animate-[bounce_1.5s_infinite]" 
            : animate 
              ? "animate-[bounce_3s_infinite]" 
              : ""
        }`}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Genie Skin Gradient */}
          <linearGradient id="genieSkin" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" /> {/* Vibrant Purple */}
            <stop offset="50%" stopColor="#6366F1" /> {/* Indigo */}
            <stop offset="100%" stopColor="#3B82F6" /> {/* Electric Blue */}
          </linearGradient>

          {/* Business Costume Gradient */}
          <linearGradient id="suitCollar" x1="60" y1="140" x2="140" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" /> {/* Dark Slate Suit */}
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Tie or Accessory Gradient */}
          <linearGradient id="goldGradient" x1="90" y1="140" x2="110" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" /> {/* Bright Gold */}
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="neonShieldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. MAGICAL VAPOR BASE (Genie tail connection with cyan sparks) */}
        <path
          d="M60 160 C 50 180, 80 195, 100 195 C 120 195, 150 180, 140 160 C 130 150, 70 150, 60 160 Z"
          fill="#22D3EE"
          fillOpacity={isSpeaking ? "0.6" : "0.4"}
          filter="url(#neonShieldGlow)"
        />
        <path
          d="M80 165 C 75 175, 95 185, 100 185 C 105 185, 125 175, 120 165 Z"
          fill="#22D3EE"
          fillOpacity="0.75"
        />

        {/* 2. CHIC BUSINESS COLLAR & SUIT JACKET (Career Mentor representation) */}
        <path d="M45 155 L155 155 L165 195 L35 195 Z" fill="url(#suitCollar)" />
        {/* Collared White Shirt underlay */}
        <path d="M75 155 L125 155 L100 178 Z" fill="#F8FAFC" />
        {/* Professional Gold Silk Necktie */}
        <path d="M94 158 L106 158 L108 188 L100 195 L92 188 Z" fill="url(#goldGradient)" />

        {/* 3. MAIN GENIE EAR PAIRS */}
        {/* Left Genie Ear with Gold Hoop */}
        <path d="M45 90 C15 80, 20 110, 48 105 Z" fill="url(#genieSkin)" />
        <circle cx="28" cy="98" r="8" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />
        
        {/* Right Genie Ear with Gold Hoop */}
        <path d="M155 90 C185 80, 180 110, 115 105 Z" fill="url(#genieSkin)" className="hidden" />
        <path d="M152 105 C180 110, 185 80, 155 90 Z" fill="url(#genieSkin)" />
        <circle cx="172" cy="98" r="8" stroke="url(#goldGradient)" strokeWidth="3" fill="none" />

        {/* 4. GENIE HEAD & PROFILE CHIN */}
        <circle cx="100" cy="95" r="56" fill="url(#genieSkin)" />

        {/* Cute iconic topknot hairdo element */}
        <path d="M85 41 C88 20, 112 20, 115 41 Z" fill="#1E293B" />
        <rect x="86" y="36" width="28" height="6" rx="3" fill="url(#goldGradient)" />

        {/* 5. INDIVIDUAL EYE LAYERS & CLASSY INTELLIGENT EYEGLASSES */}
        {/* Adjust coordinates using Darting eyeOffset state dynamically */}
        <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
          {/* Left eye */}
          <path d="M70 94 C77 88, 87 90, 89 97" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="80" cy="98" r="3" fill="#1E293B" />

          {/* Right eye */}
          <path d="M111 97 C113 90, 123 88, 130 94" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="120" cy="98" r="3" fill="#1E293B" />
        </g>

        {/* Classy Round Spectacles (Smart career AI appearance) */}
        <circle cx="78" cy="96" r="16" stroke="url(#goldGradient)" strokeWidth="3" fill="#06B6D4" fillOpacity="0.15" />
        <circle cx="122" cy="96" r="16" stroke="url(#goldGradient)" strokeWidth="3" fill="#06B6D4" fillOpacity="0.15" />
        <path d="M94 96 L106 96" stroke="url(#goldGradient)" strokeWidth="3" />

        {/* 6. FRIENDLY SMILING MOUTH WITH SOFT ROSY CHEEKS */}
        {/* If Genie is speaking, draw an oscillating open ellipse, or high-vibrancy vocal track! */}
        {isSpeaking || expression === "talking" ? (
          /* Animated Speaking mouth */
          <ellipse cx="100" cy="122" rx="10" ry="7" fill="#1E293B">
            <animate attributeName="ry" values="4;10;4;12;4" dur="0.8s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          /* Joyful smiling mouth arc */
          <>
            <path d="M85 120 C92 135, 108 135, 115 120" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M90 122 C95 130, 105 130, 110 122 Z" fill="#FDA4AF" fillOpacity="0.7" />
          </>
        )}

        {/* Soft Rosy cheek circles */}
        <circle cx="56" cy="110" r="6" fill="#F43F5E" fillOpacity="0.25" />
        <circle cx="144" cy="110" r="6" fill="#F43F5E" fillOpacity="0.25" />

        {/* Smart eyebrows */}
        <path d="M66 75 C72 70, 78 72, 84 76" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M116 76 C122 72, 128 70, 134 75" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}
