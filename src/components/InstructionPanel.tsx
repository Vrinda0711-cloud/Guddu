import React, { useState } from 'react';
import { Send, Loader2, Sparkles, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface InstructionPanelProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  history: { type: 'user' | 'ai', text: string }[];
}

export default function InstructionPanel({ onSend, isLoading, history }: InstructionPanelProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 text-zinc-100">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h2 className="font-display font-semibold text-sm tracking-tight uppercase opacity-80">Snap Retouch</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {history.length === 0 && (
          <div className="text-zinc-500 text-sm italic text-center mt-8">
            Tell the AI how to clean up your photo.<br/>
            e.g., "Remove the background" or "Make it brighter"
          </div>
        )}
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-3 rounded-lg text-sm",
                item.type === 'user' ? "bg-zinc-800 ml-4" : "bg-zinc-700/30 mr-4 border border-zinc-700"
              )}
            >
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-500 text-xs animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing instructions...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-950/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type instructions..."
            className="w-full bg-zinc-800 border-none rounded-full py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-amber-500/50 placeholder-zinc-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-amber-400 transition-colors disabled:opacity-30"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
