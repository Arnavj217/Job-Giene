import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Cpu, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GenieLogo from "./GenieLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeExit, setFadeExit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth loading progress increment
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeExit(true);
            setTimeout(onComplete, 800); // Wait for transition animation to complete
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Floating Particle Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
    }> = [];

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Create initial particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2, // Drifts slightly up
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Abstract background gradients
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      grad.addColorStop(0, "rgba(79, 70, 229, 0.08)"); // Indigo glow
      grad.addColorStop(1, "rgba(15, 23, 42, 1)");     // Slate deep dark
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render & move particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundaries reset
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`; // Light indigo particles
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimatePresence>
      {!fadeExit && (
        <motion.div
          id="splash-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-slate-900 select-none"
        >
          {/* Animated Interactive Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Interactive Core Logo Branding Containment */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Pulsating Glowing Logo Rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="relative w-32 h-32 flex items-center justify-center mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-indigo-600/20 border border-indigo-500/30 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 animate-spin [animation-duration:12s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GenieLogo size="xl" animate={true} />
              </div>
              <Sparkles className="absolute top-2 right-2 w-5 h-5 text-cyan-400 animate-bounce" />
            </motion.div>

            {/* Glowing Custom Title Typography */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black tracking-widest text-white uppercase font-sans">
                JOB<span className="text-indigo-400">GIENE</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-[0.25em] uppercase font-bold mt-2 font-mono">
                AI Career Architect & Resume Analyzer
              </p>
            </motion.div>

            {/* Linear Premium Progress Bar */}
            <div className="w-64 h-1 bg-slate-800 rounded-full mt-10 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Dynamic Interactive Text Actions */}
            <div className="h-6 mt-3">
              <p className="text-[10px] text-slate-500 tracking-wider font-mono">
                {progress < 30 && "Securing cloud database state..."}
                {progress >= 30 && progress < 70 && "Pre-matching recruitment listings..."}
                {progress >= 70 && progress < 100 && "Bootstrapping learning recommendations..."}
                {progress >= 100 && "Opening workspace dashboard..."}
              </p>
            </div>

          </div>

          {/* Copyright/Privacy Watermark footer */}
          <div className="absolute bottom-8 left-0 right-0 text-center z-10">
            <span className="text-[9px] text-slate-600 tracking-wider font-mono">
              SECURE PLATFORM ENVELOPE • VERSION 1.4 ONLINE
            </span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
