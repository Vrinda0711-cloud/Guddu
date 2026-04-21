import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const PLAYLIST = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthGen-AI v2.4",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff",
    bpm: 124
  },
  {
    id: 2,
    title: "Digital Drift",
    artist: "PulseEngine-7",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
    bpm: 128
  },
  {
    id: 3,
    title: "Cyber City",
    artist: "NeuralBeats v1.1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
    bpm: 115
  }
];

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = PLAYLIST[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentIndex((currentIndex + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentIndex((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-zinc-900 shadow-2xl rounded-3xl border border-zinc-800 p-6 flex flex-col gap-6 relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center border transition-all duration-500 shadow-lg"
          style={{ 
            borderColor: `${currentTrack.color}40`, 
            background: `${currentTrack.color}10`,
            boxShadow: isPlaying ? `0 0 20px ${currentTrack.color}20` : 'none'
          }}
        >
          <Music className="w-6 h-6" style={{ color: currentTrack.color }} />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">AI Generated Track</span>
          </div>
          <h3 className="text-lg font-display text-white truncate leading-tight">{currentTrack.title}</h3>
          <p className="text-xs text-zinc-500 font-mono tracking-tighter truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-zinc-850 rounded-full cursor-pointer group/bar overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: currentTrack.color, boxShadow: `0 0 10px ${currentTrack.color}` }}
          />
        </div>

        {/* Visualizer Mock */}
        <div className="flex items-end justify-center gap-1 h-8 px-2 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? [
                  Math.random() * 20 + 4, 
                  Math.random() * 30 + 4, 
                  Math.random() * 15 + 4
                ] : 4 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5 + Math.random(), 
                ease: "easeInOut" 
              }}
              className="w-1 rounded-t-full opacity-50"
              style={{ backgroundColor: currentTrack.color }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <button onClick={prevTrack} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white text-black hover:scale-105 active:scale-95 shadow-xl"
            style={{ 
              boxShadow: isPlaying ? `0 0 30px ${currentTrack.color}40` : 'none',
              background: isPlaying ? '#fff' : currentTrack.color
            }}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button onClick={nextTrack} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        className="hidden"
      />
      
      <div className="flex items-center justify-between px-2 pt-2 border-t border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3 h-3 text-zinc-600" />
          <div className="w-16 h-1 bg-zinc-800 rounded-full">
            <div className="w-2/3 h-full bg-zinc-600 rounded-full" />
          </div>
        </div>
        <div className="text-[10px] text-zinc-700 font-mono">BPM: {currentTrack.bpm}</div>
      </div>
    </div>
  );
}
