import React from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-zinc-950 bg-grid selection:bg-neon-cyan/30">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-magenta/5 blur-[120px]" />
      </div>

      {/* Header / StatusBar */}
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-zinc-800 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
            <Cpu className="w-4 h-4 text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-[0.2em] text-white">NEON.CORE</h1>
            <p className="text-[10px] text-neon-cyan uppercase tracking-widest opacity-60">System Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:flex">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-neon-green" />
            <span>Encryption Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-neon-cyan" />
            <span>Port: 8080</span>
          </div>
          <div className="px-2 py-0.5 rounded border border-zinc-700">Ver 1.0.4-AI</div>
        </div>
      </header>

      <main className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 mt-16 pb-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full max-w-[450px]"
        >
          <SnakeGame />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-[400px] flex flex-col gap-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-white tracking-tighter glow-cyan">STATION.01</h2>
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Synthesized beats meet retro arcade logic. High-fidelity background audio calibrated for focus.
            </p>
          </div>
          
          <MusicPlayer />

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1 block">Network Status</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#39ff14]" />
                <span className="text-xs font-mono text-zinc-300">Synchronized</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1 block">Audio Engine</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-300">NEURAL_FLX</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="fixed bottom-0 w-full p-2 text-center text-[10px] text-zinc-800 font-mono tracking-widest hidden sm:block pointer-events-none">
        DESIGNED FOR THE DIGITAL FRONTIER // PROTOTYPE_X44
      </footer>
    </div>
  );
}
