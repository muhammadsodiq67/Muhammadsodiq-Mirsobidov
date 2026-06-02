import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw } from "lucide-react";

interface SlimeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function FallingKoala() {
  const [stage, setStage] = useState<"falling" | "bounce1" | "bounce2" | "bounce3" | "settled">("falling");
  const [isSlimeSquashed, setIsSlimeSquashed] = useState(false);
  const [particles, setParticles] = useState<SlimeParticle[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [key, setKey] = useState(0); // For resetting animation

  const triggerReset = () => {
    setKey(prev => prev + 1);
    setStage("falling");
    setIsSlimeSquashed(false);
    setParticles([]);
    setShowBubble(false);
  };

  // Generate Minecraft cubic slime particles on landing
  const createParticles = () => {
    const newParticles: SlimeParticle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = (Math.PI * (Math.random() * 120 + 30)) / 180; // Upwards spread
      const speed = Math.random() * 6 + 4;
      return {
        id: i,
        x: 0, // center
        y: 60, // slime surface
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 6, // Minecraft square size
      };
    });
    setParticles(newParticles);
  };

  // Animation timelines triggered manually or via delay to sync slime squish & sounds
  useEffect(() => {
    if (stage === "falling") {
      // It takes 900ms to hit bottom
      const t1 = setTimeout(() => {
        setStage("bounce1");
        setIsSlimeSquashed(true);
        createParticles();
        // Reset squish after rebound
        setTimeout(() => setIsSlimeSquashed(false), 200);
      }, 750);

      return () => clearTimeout(t1);
    }
  }, [stage, key]);

  useEffect(() => {
    if (stage === "bounce1") {
      const t = setTimeout(() => {
        setStage("bounce2");
      }, 500);
      return () => clearTimeout(t);
    }
    if (stage === "bounce2") {
      const t = setTimeout(() => {
        setStage("bounce3");
      }, 400);
      return () => clearTimeout(t);
    }
    if (stage === "bounce3") {
      const t = setTimeout(() => {
        setStage("settled");
        setShowBubble(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [stage]);

  // Handle particle animation in JS loop to make it look physics-based
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.4, // gravity
          }))
          .filter(p => p.y < 150) // discard out of bounds
      );
    }, 20);

    return () => clearInterval(interval);
  }, [particles]);

  // Framer Motion variants for Koala Squash and Stretch
  const koalaVariants = {
    falling: {
      y: -350,
      scaleY: 1.1,
      scaleX: 0.95,
      rotate: 5,
    },
    bounce1: {
      y: 10,
      scaleY: [0.5, 1.4, 0.9],
      scaleX: [1.5, 0.7, 1.1],
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      }
    },
    bounce2: {
      y: -60,
      scaleY: [1.2, 0.8, 1],
      scaleX: [0.85, 1.1, 1],
      rotate: -4,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      }
    },
    bounce3: {
      y: 0,
      scaleY: [0.85, 1.05, 1],
      scaleX: [1.1, 0.95, 1],
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      }
    },
    settled: {
      y: 15,
      scaleY: 1,
      scaleX: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div key={key} className="relative w-full py-8 mb-4 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-[2.5rem] border border-emerald-500/10 overflow-hidden flex flex-col items-center justify-end min-h-[360px] select-none">
      {/* Absolute Backdrop helper */}
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-extrabold uppercase">
          Minecraft Slime-Bounce Physics Enabled
        </span>
      </div>

      <button 
        onClick={triggerReset}
        className="absolute top-4 right-6 p-2 bg-emerald-50 hover:bg-emerald-100/85 border border-emerald-100 text-emerald-700 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-sm active:scale-95"
        title="Koalani qayta tushirish"
      >
        <RefreshCw size={12} className="animate-spin-slow" />
        <span>Qaytdan tushirish</span>
      </button>

      {/* Physics Interactive Zone */}
      <div className="relative w-full max-w-sm h-64 flex flex-col items-center justify-end">
        
        {/* Speeches dialogue on settlement */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-2 z-20 bg-slate-900 text-white font-black text-[11px] px-4 py-2.5 rounded-2xl shadow-xl flex flex-col items-center border border-slate-800"
            >
              <span className="text-emerald-400 text-center tracking-wide uppercase text-[9px] flex items-center gap-1">
                <Sparkles size={10} /> BOING! SLIME BOUNCE SUCCESSFUL
              </span>
              <span className="mt-1 text-center text-[10px] font-sans font-medium text-slate-200">
                Salom, o'quvchi! Men Articraft Edu koalasiman 🐨🎋
              </span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Falling Koala holding bamboo stick */}
        <motion.div
          variants={koalaVariants}
          animate={stage}
          className="absolute z-10 cursor-pointer pointer-events-auto"
          whileHover={{ rotate: [-2, 2, -2], transition: { repeat: Infinity, duration: 1.5 } }}
          onClick={() => {
            setStage("bounce2");
            createParticles();
            setTimeout(() => setStage("settled"), 500);
          }}
        >
          {/* Koala Vector Drawing in Web Art */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            
            {/* Bamboo branch (Holding diagonally) */}
            <div className="absolute top-4 -right-1 z-30 w-4 h-24 rotate-[25deg] origin-center flex flex-col items-center">
              {/* Bamboo Stem */}
              <div className="w-1.5 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full relative shadow-sm">
                {/* Segments */}
                <div className="absolute top-4 w-full h-[1px] bg-emerald-800 opacity-60" />
                <div className="absolute top-10 w-full h-[1px] bg-emerald-800 opacity-60" />
                <div className="absolute top-16 w-full h-[1px] bg-emerald-800 opacity-60" />
                
                {/* Leaves */}
                <div className="absolute top-2 -left-3 w-4 h-1.5 bg-emerald-500 rounded-tl-full rounded-br-full -rotate-[40deg]" />
                <div className="absolute top-8 -right-3.5 w-4.5 h-1.5 bg-emerald-500 rounded-tr-full rounded-bl-full rotate-[35deg]" />
                <div className="absolute top-14 -left-3.5 w-4.5 h-1.5 bg-emerald-400 rounded-tl-full rounded-br-full -rotate-[30deg]" />
                <div className="absolute top-19 -right-3 w-4 h-1.5 bg-emerald-400 rounded-tr-full rounded-bl-full rotate-[40deg]" />
              </div>
            </div>

            {/* Koala Body */}
            <div className="relative w-20 h-20 bg-slate-400 rounded-full shadow-lg flex flex-col justify-between p-1 border border-slate-300">
              
              {/* Big fluffy ears */}
              <div className="absolute -top-2 -left-4 w-8 h-8 bg-slate-400 rounded-full border border-slate-300 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 bg-pink-100 rounded-full" />
              </div>
              <div className="absolute -top-2 -right-4 w-8 h-8 bg-slate-400 rounded-full border border-slate-300 flex items-center justify-center shadow-inner">
                <div className="w-5 h-5 bg-pink-100 rounded-full" />
              </div>

              {/* Rosy cheeks */}
              <div className="absolute bottom-4 left-2.5 w-3.5 h-2 bg-pink-200 rounded-full opacity-60 blur-[0.5px]" />
              <div className="absolute bottom-4 right-2.5 w-3.5 h-2 bg-pink-200 rounded-full opacity-60 blur-[0.5px]" />

              {/* Face center area */}
              <div className="flex-1 flex flex-col justify-end items-center gap-1.5 pb-2">
                {/* Eyes */}
                <div className="flex justify-between w-11 px-1">
                  <div className="w-2.5 h-2.5 bg-slate-800 rounded-full flex items-start justify-end p-0.5 relative">
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                  <div className="w-2.5 h-2.5 bg-slate-800 rounded-full flex items-start justify-end p-0.5 relative">
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Big black Koala nose */}
                <div className="w-5 h-7 bg-slate-800 rounded-[0.7rem] relative shadow-md">
                  {/* shine */}
                  <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Happy little mouth */}
                <div className="w-3 h-1.5 border-b-2 border-slate-800 rounded-b-full -mt-0.5" />
              </div>

              {/* Hugging paws */}
              <div className="absolute bottom-1 -left-1 w-4.5 h-4.5 bg-slate-400 border border-slate-300 rounded-full shadow-md z-20" />
              <div className="absolute bottom-1 -right-1 w-4.5 h-4.5 bg-slate-400 border border-slate-300 rounded-full shadow-md z-20 flex items-center justify-center">
                {/* Thumb grasping bamboo */}
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
              </div>
            </div>

            {/* Little belly & shadow */}
            <div className="absolute -bottom-1.5 w-12 h-4 bg-slate-500/10 rounded-full" />
          </div>
        </motion.div>

        {/* Dynamic Slime Particle Burst */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-0">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute bg-emerald-400/90 border border-emerald-500/50 shadow-sm"
              style={{
                width: p.size,
                height: p.size,
                left: p.x,
                top: p.y,
                borderRadius: "2px", // Minecraft square style
              }}
            />
          ))}
        </div>

        {/* Translucent Green Minecraft Slime Block container */}
        <motion.div
          animate={{
            scaleY: isSlimeSquashed ? 0.6 : 1,
            scaleX: isSlimeSquashed ? 1.3 : 1,
            y: isSlimeSquashed ? 12 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="w-32 h-14 relative group z-0 cursor-pointer pointer-events-auto"
          onClick={() => {
            setIsSlimeSquashed(true);
            createParticles();
            setTimeout(() => {
              setIsSlimeSquashed(false);
              setStage("bounce2");
              setTimeout(() => setStage("settled"), 500);
            }, 180);
          }}
        >
          {/* Minecraft Slime Outer block style (translucent green, thick block) */}
          <div className="absolute inset-0 bg-emerald-500/55 rounded-xl border-4 border-emerald-400/70 shadow-lg shadow-emerald-500/15 backdrop-blur-xs flex items-center justify-center overflow-hidden">
            
            {/* Minecraft Slime Inner Core (smaller darker core) */}
            <div className="w-16 h-7 bg-emerald-600/90 rounded-md border-2 border-emerald-500 flex flex-col items-center justify-around p-0.5">
              {/* Slime face pixels */}
              <div className="flex justify-between w-9 px-1">
                <div className="w-2.5 h-2 bg-emerald-950 rounded-sm" />
                <div className="w-2.5 h-2 bg-emerald-950 rounded-sm" />
              </div>
              <div className="w-4 h-1.5 bg-emerald-950 rounded-sm" />
            </div>

            {/* Pixel gloss grids representing block textures */}
            <div className="absolute top-1 left-2 w-3 h-3 bg-white/20 rounded-sm" />
            <div className="absolute bottom-1 right-2 w-2.5 h-2 w bg-emerald-300/30 rounded-sm" />
          </div>

          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-emerald-600 font-mono select-none tracking-widest whitespace-nowrap group-hover:text-emerald-700">
            SLIME BLOCK
          </span>
        </motion.div>
      </div>
    </div>
  );
}
