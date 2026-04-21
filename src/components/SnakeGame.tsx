import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10], [10, 11], [10, 12]];
const INITIAL_DIRECTION = [0, -1]; // UP

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(150);

  const moveSnake = useCallback(() => {
    if (isGameOver || !gameStarted) return;

    const newSnake = [...snake];
    const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

    // Wall collision
    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    // Self collision
    if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
      setIsGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Food collision
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore(s => s + 10);
      spawnFood(newSnake);
      setSpeed(prev => Math.max(70, prev - 2));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, gameStarted]);

  const spawnFood = (currentSnake: number[][]) => {
    let newFood;
    while (true) {
      newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
      if (!currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
        break;
      }
    }
    setFood(newFood);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction[1] !== 1) setDirection([0, -1]); break;
      case 'ArrowDown': if (direction[1] !== -1) setDirection([0, 1]); break;
      case 'ArrowLeft': if (direction[0] !== 1) setDirection([-1, 0]); break;
      case 'ArrowRight': if (direction[0] !== -1) setDirection([1, 0]); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00f3ff' : '#00a3ab';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f3ff';
      ctx.fillRect(segment[0] * size + 1, segment[1] * size + 1, size - 2, size - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(food[0] * size + size / 2, food[1] * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    if (score > highScore) setHighScore(score);
    setScore(0);
    setGameStarted(true);
    setSpeed(150);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-glow-cyan">
      <div className="flex justify-between w-full max-w-[400px] font-display">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Score</span>
          <span className="text-2xl text-neon-cyan glow-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-2xl text-amber-400">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg bg-black border border-zinc-800 transition-all group-hover:border-neon-cyan/30"
        />
        
        <AnimatePresence>
          {!gameStarted && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              <h2 className="text-4xl font-display text-neon-cyan glow-cyan mb-8">SNAKE.OS</h2>
              <button
                onClick={() => setGameStarted(true)}
                className="flex items-center gap-3 px-8 py-3 bg-neon-cyan text-black font-display font-bold rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                INITIATE
              </button>
              <p className="mt-8 text-zinc-500 text-xs font-mono">USE ARROW KEYS TO NAVIGATE</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-lg"
            >
              <h2 className="text-4xl font-display text-neon-magenta glow-magenta mb-4 tracking-tighter">GAME_OVER</h2>
              <div className="text-zinc-400 uppercase tracking-[0.3em] text-xs mb-8 italic">Final Score: {score}</div>
              <button
                onClick={resetGame}
                className="flex items-center gap-3 px-8 py-3 border-2 border-neon-magenta text-neon-magenta font-display font-bold rounded-full hover:bg-neon-magenta hover:text-white transition-all border-glow-magenta"
              >
                <RefreshCw className="w-5 h-5" />
                REBOOT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
