
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Volume2, Mic2 } from 'lucide-react';
import { Track } from '../types';

const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Cyber Voyager',
    coverUrl: 'https://picsum.photos/seed/cyber1/400/400',
    duration: 184,
  },
  {
    id: '2',
    title: 'Static Dreams',
    artist: 'Digital Echo',
    coverUrl: 'https://picsum.photos/seed/cyber2/400/400',
    duration: 212,
  },
  {
    id: '3',
    title: 'Electric Pulse',
    artist: 'Synth Overlord',
    coverUrl: 'https://picsum.photos/seed/cyber3/400/400',
    duration: 156,
  },
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentTrack = MOCK_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MOCK_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 w-full max-w-[350px]">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
          <Mic2 className="w-3 h-3 text-neon-purple" />
          Neural Audio Feed
        </h3>
        <ListMusic className="w-4 h-4 text-white/20 cursor-pointer hover:text-white transition-colors" />
      </div>

      <div className="relative group aspect-square rounded-xl overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        {isPlaying && (
            <div className="absolute bottom-4 left-4 flex gap-1 items-end h-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [8, 24, 12, 20, 8] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                        className="w-1 bg-neon-purple/80 rounded-full"
                    />
                ))}
            </div>
        )}
      </div>

      <div className="space-y-1">
        <motion.h2 
            key={`${currentTrack.id}-title`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold truncate"
        >
            {currentTrack.title}
        </motion.h2>
        <motion.p 
            key={`${currentTrack.id}-artist`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            className="text-sm font-mono text-white/60 truncate"
        >
            {currentTrack.artist}
        </motion.p>
      </div>

      <div className="space-y-2">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 1 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-wider">
          <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-6 mx-auto">
          <button onClick={handlePrev} className="text-white/40 hover:text-white transition-colors">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
          <button onClick={handleNext} className="text-white/40 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-white/20 px-2">
        <Volume2 className="w-4 h-4" />
        <div className="flex-1 h-[2px] bg-white/5 rounded-full">
            <div className="w-2/3 h-full bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
