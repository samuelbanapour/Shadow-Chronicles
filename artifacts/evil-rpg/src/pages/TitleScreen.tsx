import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, BookOpen, RotateCcw, MessageSquare } from 'lucide-react';
import { loadGame, clearSave } from '@/game/engine';
import type { GameState } from '@/game/types';
import FeedbackModal from '@/components/FeedbackModal';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: (state: GameState) => void;
}

const TITLE_GLYPHS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'];

export default function TitleScreen({ onNewGame, onContinue }: TitleScreenProps) {
  const [savedGame, setSavedGame] = useState<GameState | null>(null);
  const [glyphIndex, setGlyphIndex] = useState(0);
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    setSavedGame(saved);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlyphIndex(i => (i + 1) % TITLE_GLYPHS.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleNewGame = () => {
    if (savedGame && savedGame.gameStarted) {
      setShowConfirmNew(true);
    } else {
      onNewGame();
    }
  };

  const confirmNewGame = () => {
    clearSave();
    setSavedGame(null);
    setShowConfirmNew(false);
    onNewGame();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full"
            style={{
              background: `hsl(${Math.random() > 0.5 ? '0 60% 35%' : '30 80% 40%'})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">

        {/* Animated rune */}
        <motion.div
          className="text-6xl text-blood/60 font-mono"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {TITLE_GLYPHS[glyphIndex]}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="space-y-2"
        >
          <div className="text-xs tracking-[0.5em] text-muted-foreground uppercase font-sans">
            A Dark Fantasy
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-foreground leading-none tracking-tight">
            DARK
          </h1>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-blood leading-none tracking-tight animate-glow-pulse">
            SOVEREIGN
          </h1>
          <div className="text-xs tracking-[0.5em] text-muted-foreground uppercase font-sans mt-2">
            The Path of Absolute Power
          </div>
        </motion.div>

        {/* Divider */}
        <div className="rune-divider w-64 text-[0.6rem]">
          ᛗᛟᚱᚱᚤᛊ
        </div>

        {/* Lore excerpt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-lore italic text-muted-foreground max-w-md text-sm leading-relaxed"
        >
          "Power is not given. It is taken. Everything else is the story you tell yourself afterward."
          <span className="block mt-2 text-xs not-italic text-muted-foreground/60">— Inscription on the Obsidian Crown</span>
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <button
            data-testid="button-new-game"
            onClick={handleNewGame}
            className="group relative px-8 py-4 border border-blood/40 bg-card hover:border-blood hover:bg-blood/10 transition-all duration-300 font-sans text-sm tracking-widest uppercase text-foreground overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Skull className="w-4 h-4 text-blood" />
              Begin Your Reign
              <Skull className="w-4 h-4 text-blood" />
            </span>
            <div className="absolute inset-0 bg-blood/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {savedGame && savedGame.gameStarted && (
            <button
              data-testid="button-continue"
              onClick={() => onContinue(savedGame)}
              className="group px-8 py-3 border border-muted/40 bg-card/50 hover:border-accent/60 hover:bg-accent/10 transition-all duration-300 font-sans text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center justify-center gap-3">
                <BookOpen className="w-4 h-4 text-accent/60 group-hover:text-accent" />
                Continue ({savedGame.player.name})
              </span>
            </button>
          )}

          <button
            data-testid="button-feedback"
            onClick={() => setShowFeedback(true)}
            className="group px-8 py-2 border border-muted/20 bg-transparent hover:border-muted/50 hover:bg-muted/10 transition-all duration-300 font-sans text-xs tracking-widest uppercase text-muted-foreground/50 hover:text-muted-foreground"
          >
            <span className="flex items-center justify-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Share Feedback
            </span>
          </button>
        </motion.div>

        {/* Warning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2 }}
          className="text-[0.65rem] text-muted-foreground tracking-wider font-sans"
        >
          CONTAINS DARK THEMES · FOR MATURE AUDIENCES · CHOICES HAVE CONSEQUENCES
        </motion.p>
      </div>

      {/* Feedback modal */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
        )}
      </AnimatePresence>

      {/* Confirm new game dialog */}
      <AnimatePresence>
        {showConfirmNew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card-parchment p-8 max-w-sm w-full text-center space-y-6"
            >
              <h2 className="font-display text-xl text-blood">Abandon Your Current Path?</h2>
              <p className="font-lore text-sm text-muted-foreground italic">
                Your progress as {savedGame?.player.name} will be lost to the void. This cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  data-testid="button-confirm-new"
                  onClick={confirmNewGame}
                  className="flex-1 py-3 border border-blood/50 bg-blood/10 hover:bg-blood/20 text-sm font-sans tracking-wider uppercase text-blood transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Abandon
                </button>
                <button
                  data-testid="button-cancel-new"
                  onClick={() => setShowConfirmNew(false)}
                  className="flex-1 py-3 border border-muted/40 bg-muted/20 hover:bg-muted/40 text-sm font-sans tracking-wider uppercase text-muted-foreground transition-all"
                >
                  Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
