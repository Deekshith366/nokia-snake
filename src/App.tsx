/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Cpu, Zap, Radio, Globe } from 'lucide-react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* City grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
      </div>
      
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[150px] rounded-full"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-neon-pink/5 blur-[100px] rounded-full"></div>

      {/* CRT Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

const Header = () => {
  return (
    <header className="relative z-10 w-full py-8 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center neon-border">
          <Zap className="w-5 h-5 text-neon-purple fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
            Neon<span className="neon-text-purple">Groove</span>
          </h1>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
            <span className="flex items-center gap-1"><Radio className="w-2 h-2" /> Live_Feed</span>
            <span className="w-1 h-1 bg-neon-green rounded-full animate-ping"></span>
            <span>OS_v2.0.4</span>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-12 text-xs font-mono uppercase tracking-[0.2em] text-white/40">
        <a href="#" className="hover:text-neon-purple transition-colors flex items-center gap-2">
            <Cpu className="w-3 h-3" /> Hardware
        </a>
        <a href="#" className="hover:text-neon-blue transition-colors flex items-center gap-2">
            <Globe className="w-3 h-3" /> Network
        </a>
        <div className="px-4 py-2 border border-white/10 rounded-full glass-panel">
            User: <span className="text-white">Admin_Root</span>
        </div>
      </nav>
    </header>
  );
};

export default function App() {
  return (
    <div className="min-height-screen w-full relative flex flex-col">
      <Background />
      <Header />

      <main className="flex-1 relative z-10 container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
        
        {/* Left Side: Music Player */}
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[400px] flex justify-center"
        >
            <MusicPlayer />
        </motion.div>

        {/* Center/Right Side: Game Window */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full max-w-[600px] flex justify-center"
        >
            <SnakeGame />
        </motion.div>

        {/* Global Stats / Decorative sidebar (desktop only) */}
        <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden xl:flex flex-col gap-6 w-48 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]"
        >
            <div className="glass-panel p-4 space-y-4">
                <div>
                    <p className="text-white/60 mb-2">System Load</p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[42%] h-full bg-neon-blue"></div>
                    </div>
                </div>
                <div>
                    <p className="text-white/60 mb-2">Latency</p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 1, 2, 3].map((_, i) => (
                            <div key={i} className={`flex-1 h-3 rounded-sm ${i < 4 ? 'bg-neon-green/40' : 'bg-white/5'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                    <p className="text-neon-purple animate-pulse">Encryption_Active</p>
                </div>
            </div>

            <div className="mt-auto space-y-2 opacity-50">
                <p>© 2026 NEON_GROOVE</p>
                <p>NEURAL_LINK_ESTABLISHED</p>
            </div>
        </motion.div>
      </main>

      <footer className="relative z-10 w-full py-6 px-6 text-center border-t border-white/5">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">
          End of Line / Transmission Complete
        </p>
      </footer>
    </div>
  );
}

