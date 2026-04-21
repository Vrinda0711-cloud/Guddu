import React, { useState, useRef } from 'react';
import { Upload, X, Download, Maximize2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ImageEditorProps {
  image: string | null;
  onUpload: (file: File) => void;
  onClear: () => void;
  isProcessing: boolean;
  history: { type: 'user' | 'ai', text: string }[];
}

export default function ImageEditor({ image, onUpload, onClear, isProcessing, history }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'snapclean-export.png';
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#121212] overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center gap-6 text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-2xl">
              <Upload className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Clean up your product photos</h1>
              <p className="text-zinc-500 text-sm">
                Upload a photo and tell the AI to remove backgrounds, objects, or adjust lighting.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
            >
              Select Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center gap-6 relative"
          >
            {/* Toolbar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 z-10 shadow-xl">
              <button 
                onClick={onClear}
                className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                title="Clear Image"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-px h-4 bg-zinc-700 mx-2" />
              <button 
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="text-xs font-mono text-zinc-500 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                +
              </button>
              <div className="w-px h-4 bg-zinc-700 mx-2" />
              <button 
                onClick={handleDownload}
                className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
                title="Download Result"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Area */}
            <div 
              className={cn(
                "relative group overflow-hidden rounded-xl bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-zinc-900 border border-zinc-800 transition-all shadow-2xl max-w-full max-h-full",
                isProcessing && "animate-pulse brightness-75"
              )}
              style={{ transform: `scale(${zoom})` }}
            >
              <img 
                src={image} 
                alt="Product" 
                className="max-w-[80vw] max-h-[70vh] object-contain block select-none pointer-events-none"
              />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"
                  />
                  <span className="text-white text-xs font-medium tracking-widest uppercase">Processing</span>
                </div>
              )}
            </div>

            {/* History Summary Tooltip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
               {isProcessing && (
                 <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="bg-amber-500 text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                 >
                   <Layers className="w-4 h-4 animate-bounce" />
                   AI is Retouching...
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
