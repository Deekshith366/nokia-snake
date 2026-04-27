
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        setDirection(nextDirection);
        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions (walls)
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [food, isGameOver, isPaused, nextDirection, generateFood, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw snake
    ctx.shadowBlur = 15;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#c026d3' : '#db2777';
      ctx.shadowColor = isHead ? '#c026d3' : '#db2777';
      
      const padding = 2;
      ctx.beginPath();
      ctx.roundRect(
          segment.x * size + padding,
          segment.y * size + padding,
          size - padding * 2,
          size - padding * 2,
          4
      );
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#22c55e';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] text-sm uppercase tracking-widest font-mono">
        <div className="flex items-center gap-2">
          <span className="text-white/40">Score</span>
          <span className="neon-text-purple font-bold text-lg">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-neon-blue" />
          <span className="text-white/40">Best</span>
          <span className="neon-text-blue font-bold text-lg">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass-panel overflow-hidden border-white/10 border p-1">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            id="snake-canvas"
            className="w-full max-w-full aspect-square"
          />
          
          <AnimatePresence>
            {(isGameOver || isPaused) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                {isGameOver ? (
                  <div className="text-center p-8">
                    <h2 className="text-4xl font-bold mb-2 neon-text-pink">GAME OVER</h2>
                    <p className="text-white/60 mb-8 font-mono">System Failure — Restart Required</p>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-3 px-8 py-3 bg-neon-purple hover:bg-neon-pink transition-all duration-300 rounded-full font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(192,38,211,0.5)]"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <h2 className="text-4xl font-bold mb-2 neon-text-blue">PAUSED</h2>
                    <p className="text-white/60 mb-8 font-mono">Waiting for User Execution...</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-3 px-8 py-3 bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-full font-bold uppercase tracking-widest border border-white/20"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Continue
                    </button>
                    <p className="mt-6 text-xs text-white/40 font-mono uppercase tracking-[0.2em]">Press SPACE to Toggle</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 text-xs font-mono text-white/30 uppercase tracking-[0.2em]">
        <span>WASD / ARROWS to Move</span>
        <span className="text-white/20">|</span>
        <span>SPACE to Pause</span>
      </div>
    </div>
  );
};
