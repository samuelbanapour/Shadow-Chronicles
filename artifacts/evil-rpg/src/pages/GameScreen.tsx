import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Heart, Zap, Coins, Shield, Eye, BookOpen, X, ChevronRight, AlertTriangle, Star, Trophy, LogIn, LogOut, Volume2, VolumeX } from 'lucide-react';
import type { GameState, Choice } from '@/game/types';
import {
  getCurrentScene,
  applyChoice,
  isChoiceLocked,
  getCorruptionLabel,
  getDarknessLabel,
  saveGame,
} from '@/game/engine';
import { playGames } from '@/services/playGames';
import { audioService } from '@/services/audioService';

interface GameScreenProps {
  state: GameState;
  onStateChange: (state: GameState) => void;
  onGameEnd: () => void;
  onRestart: () => void;
}

const MORALITY_COLORS: Record<string, string> = {
  evil: 'text-blood',
  dark: 'text-accent',
  neutral: 'text-muted-foreground',
  grey: 'text-blue-400',
};

const MORALITY_LABELS: Record<string, string> = {
  evil: 'Wicked',
  dark: 'Dark',
  neutral: 'Neutral',
  grey: 'Ambiguous',
};

const BACKGROUND_GRADIENTS: Record<string, string> = {
  tomb: 'radial-gradient(ellipse at center, hsl(220 20% 6%) 0%, hsl(12 15% 4%) 100%)',
  throne: 'radial-gradient(ellipse at top, hsl(0 30% 8%) 0%, hsl(12 15% 4%) 100%)',
  forest: 'radial-gradient(ellipse at center, hsl(120 15% 5%) 0%, hsl(12 15% 4%) 100%)',
  village: 'radial-gradient(ellipse at bottom, hsl(30 20% 6%) 0%, hsl(12 15% 4%) 100%)',
  dungeon: 'radial-gradient(ellipse at 20% 80%, hsl(0 20% 5%) 0%, hsl(12 15% 3%) 100%)',
  ritual: 'radial-gradient(ellipse at center, hsl(270 20% 7%) 0%, hsl(0 20% 4%) 100%)',
  battlefield: 'radial-gradient(ellipse at top, hsl(15 25% 6%) 0%, hsl(0 30% 3%) 100%)',
  tower: 'radial-gradient(ellipse at top, hsl(220 15% 6%) 0%, hsl(12 10% 4%) 100%)',
  abyss: 'radial-gradient(ellipse at center, hsl(270 30% 5%) 0%, hsl(0 10% 2%) 100%)',
};

const ENDING_TYPE_LABELS: Record<string, { label: string; color: string; description: string }> = {
  'bad': { label: 'Tragic End', color: 'text-muted-foreground', description: 'A story without redemption.' },
  'neutral': { label: 'Bittersweet Ending', color: 'text-blue-400', description: 'Something was gained. Something was lost.' },
  'dark-triumph': { label: 'Dark Triumph', color: 'text-blood', description: 'Power, at every cost.' },
  'true-evil': { label: 'True Evil Ending', color: 'text-blood', description: 'Beyond redemption. Beyond regret.' },
  'redemption': { label: 'Hidden Redemption', color: 'text-gold', description: 'The rarest ending. Found by those who looked.' },
};

export default function GameScreen({ state, onStateChange, onGameEnd, onRestart }: GameScreenProps) {
  const [showInventory, setShowInventory] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [consequenceText, setConsequenceText] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [showAllNarrative, setShowAllNarrative] = useState(false);
  const [achToast, setAchToast] = useState<string | null>(null);
  const [pgsSignedIn, setPgsSignedIn] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.isMuted());
  const narrativeRef = useRef<HTMLDivElement>(null);

  const scene = getCurrentScene(state);

  useEffect(() => {
    audioService.init();
    playGames.init((name) => {
      setAchToast(name);
      setTimeout(() => setAchToast(null), 3500);
    });
    playGames.trigger('game_start');
    setPgsSignedIn(playGames.isSignedIn());
    return () => {
      audioService.stopHeartbeat();
      audioService.stopAmbient();
    };
  }, []);

  useEffect(() => {
    setNarrativeIndex(0);
    setShowAllNarrative(false);
    setConsequenceText(null);
    setSelectedChoice(null);
  }, [state.currentScene]);

  useEffect(() => {
    if (scene) {
      audioService.playAmbient(scene.backgroundMood);
      const mood = scene.backgroundMood;
      if (mood === 'forest' || mood === 'village') {
        audioService.playSfx('crow');
      } else if (mood === 'ritual') {
        audioService.playSfx('thunder');
      } else if (mood === 'battlefield') {
        audioService.playSfx('sword');
      }
    }
  }, [state.currentScene, scene]);

  const highCorruption = state.player.stats.corruption > 70;
  useEffect(() => {
    if (highCorruption) {
      audioService.startHeartbeat();
    } else {
      audioService.stopHeartbeat();
    }
  }, [highCorruption]);

  useEffect(() => {
    if (!showAllNarrative && scene && narrativeIndex < scene.narrative.length - 1) {
      const timer = setTimeout(() => {
        setNarrativeIndex(i => i + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (narrativeIndex >= (scene?.narrative.length ?? 1) - 1) {
      setShowAllNarrative(true);
    }
  }, [narrativeIndex, scene, showAllNarrative]);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  if (!scene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground font-lore italic">The path is lost...</div>
      </div>
    );
  }

  const handleChoiceClick = (choice: Choice) => {
    const lockStatus = isChoiceLocked(choice, state.player.stats);
    if (lockStatus.locked) return;

    audioService.playSfx('choice');

    if (choice.combat) {
      audioService.playSfx('sword');
    } else if (choice.morality === 'evil' || choice.morality === 'dark') {
      audioService.playSfx('spell');
    }

    setSelectedChoice(choice);
    if (choice.consequence) {
      setConsequenceText(choice.consequence);
    } else {
      proceedWithChoice(choice);
    }
  };

  const proceedWithChoice = (choice: Choice) => {
    audioService.playSfx('transition');
    setIsTransitioning(true);
    setTimeout(() => {
      if (choice.nextScene === 'restart') {
        onRestart();
        return;
      }
      const newState = applyChoice(state, choice);

      // Chapter achievements
      if (newState.chapter !== state.chapter) {
        if (newState.chapter === 2) playGames.trigger('chapter_2');
        if (newState.chapter === 3) playGames.trigger('chapter_3');
        if (newState.chapter === 4) playGames.trigger('chapter_4');
      }

      // Corruption threshold achievements
      const prevCorruption = state.player.stats.corruption;
      const nextCorruption = newState.player.stats.corruption;
      if (prevCorruption < 50 && nextCorruption >= 50) playGames.trigger('corruption_50');
      if (prevCorruption < 80 && nextCorruption >= 80) playGames.trigger('corruption_80');

      // Level achievement
      if (newState.player.stats.level >= 5 && state.player.stats.level < 5) {
        playGames.trigger('level_5');
      }

      // Ending achievements
      const nextScene = newState.currentScene;
      if (nextScene.includes('ending')) {
        const endingMap: Record<string, string> = {
          bad: 'ending_bad',
          neutral: 'ending_neutral',
          'dark-triumph': 'ending_dark_triumph',
          'dark_triumph': 'ending_dark_triumph',
          'true-evil': 'ending_true_evil',
          'true_evil': 'ending_true_evil',
          redemption: 'ending_redemption',
        };
        for (const [key, trigger] of Object.entries(endingMap)) {
          if (nextScene.includes(key)) { playGames.trigger(trigger); break; }
        }
      }

      onStateChange(newState);
      setIsTransitioning(false);
    }, 600);
  };

  const confirmChoice = () => {
    if (!selectedChoice) return;
    proceedWithChoice(selectedChoice);
    setConsequenceText(null);
    setSelectedChoice(null);
  };

  const stats = state.player.stats;
  const healthPercent = (stats.health / stats.maxHealth) * 100;
  const manaPercent = (stats.mana / stats.maxMana) * 100;
  const corruptionPercent = stats.corruption;
  const expPercent = (stats.experience / stats.experienceToNext) * 100;

  const isEnding = scene.isEnding;
  const endingInfo = scene.endingType ? ENDING_TYPE_LABELS[scene.endingType] : null;

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden"
      style={{ background: BACKGROUND_GRADIENTS[scene.backgroundMood] }}
    >
      {/* Vignette */}
      <div className="vignette" />

      {/* Achievement toast */}
      <AnimatePresence>
        {achToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 right-4 z-[100] flex items-center gap-3 bg-black/90 border border-gold/40 rounded px-4 py-3 shadow-2xl"
          >
            <Trophy className="w-4 h-4 text-gold shrink-0" />
            <div>
              <div className="text-[0.6rem] text-gold/60 font-sans uppercase tracking-widest">Achievement Unlocked</div>
              <div className="text-sm font-display text-gold font-bold">{achToast}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT: SIDEBAR - Character Stats */}
      <div className="lg:w-72 shrink-0 p-4 lg:p-5 lg:border-r border-border/30 space-y-4 relative z-10">

        {/* Player header */}
        <div className="card-parchment p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-sm font-bold text-foreground tracking-wider">{state.player.name}</div>
              <div className="text-[0.65rem] text-muted-foreground/60 uppercase tracking-widest font-sans capitalize">
                {state.player.class.replace('-', ' ')} · Lv.{stats.level}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[0.6rem] text-muted-foreground/50 font-sans">CH.{state.chapter}</div>
              <div className="flex items-center gap-1 text-accent text-xs">
                <Coins className="w-3 h-3" />
                <span className="font-bold font-sans">{stats.gold}</span>
              </div>
            </div>
          </div>

          {/* Stats bars */}
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-[0.6rem] font-sans tracking-wider text-muted-foreground">HEALTH</span>
                </div>
                <span className="text-[0.6rem] font-bold text-red-400 font-sans">{stats.health}/{stats.maxHealth}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-red-600/80"
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-400" />
                  <span className="text-[0.6rem] font-sans tracking-wider text-muted-foreground">MANA</span>
                </div>
                <span className="text-[0.6rem] font-bold text-blue-400 font-sans">{stats.mana}/{stats.maxMana}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-blue-600/80"
                  style={{ width: `${manaPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blood" />
                  <span className="text-[0.6rem] font-sans tracking-wider text-muted-foreground">CORRUPTION</span>
                </div>
                <span className="text-[0.6rem] font-bold text-blood font-sans">{stats.corruption}%</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-blood/70"
                  style={{ width: `${corruptionPercent}%` }}
                />
              </div>
              <div className="text-[0.55rem] text-blood/60 font-lore italic">{getCorruptionLabel(stats.corruption)}</div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold" />
                  <span className="text-[0.6rem] font-sans tracking-wider text-muted-foreground">EXP</span>
                </div>
                <span className="text-[0.6rem] font-bold text-gold font-sans">{stats.experience}/{stats.experienceToNext}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${expPercent}%`, background: 'hsl(45 90% 55%)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core stats */}
        <div className="card-parchment p-3">
          <div className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/50 font-sans uppercase mb-2">Attributes</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: 'STR', value: stats.strength, color: 'text-orange-400' },
              { icon: Eye, label: 'CUN', value: stats.cunning, color: 'text-blue-400' },
              { icon: Skull, label: 'DRK', value: stats.darkness, color: 'text-blood' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`w-3.5 h-3.5 mx-auto mb-0.5 ${stat.color}`} />
                <div className={`text-sm font-bold font-sans ${stat.color}`}>{stat.value}</div>
                <div className="text-[0.55rem] text-muted-foreground/40 font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Darkness level */}
        {stats.darkness > 0 && (
          <div className="card-parchment p-3 border-blood/20">
            <div className="text-[0.6rem] text-blood/60 font-lore italic">{getDarknessLabel(stats.darkness)}</div>
          </div>
        )}

        {/* Notable stats */}
        {(state.player.killCount > 0 || state.player.betrayals > 0) && (
          <div className="card-parchment p-3 space-y-1.5">
            <div className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/50 font-sans uppercase mb-2">Chronicle</div>
            {state.player.killCount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] text-muted-foreground/60 font-lore italic">Fallen by your hand</span>
                <span className="text-[0.65rem] font-bold text-blood font-sans">{state.player.killCount}</span>
              </div>
            )}
            {state.player.betrayals > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[0.65rem] text-muted-foreground/60 font-lore italic">Betrayals committed</span>
                <span className="text-[0.65rem] font-bold text-accent font-sans">{state.player.betrayals}</span>
              </div>
            )}
          </div>
        )}

        {/* Inventory button */}
        <button
          data-testid="button-inventory"
          onClick={() => setShowInventory(true)}
          className="w-full card-parchment p-3 flex items-center justify-between hover:border-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
            <span className="text-xs font-sans tracking-wider text-muted-foreground group-hover:text-foreground uppercase">Inventory</span>
          </div>
          <span className="text-xs text-muted-foreground/60 font-sans">{state.player.inventory.length}</span>
        </button>

        {/* Audio mute toggle */}
        <button
          data-testid="button-audio-toggle"
          onClick={() => setIsMuted(audioService.toggleMute())}
          className="w-full card-parchment p-3 flex items-center justify-between hover:border-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            {isMuted
              ? <VolumeX className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
              : <Volume2 className="w-3.5 h-3.5 text-foreground" />
            }
            <span className="text-xs font-sans tracking-wider text-muted-foreground group-hover:text-foreground uppercase">
              {isMuted ? 'Unmute' : 'Sound On'}
            </span>
          </div>
        </button>

        {/* Play Games sign-in */}
        {playGames.isConfigured() && (
          <button
            onClick={async () => {
              if (pgsSignedIn) {
                playGames.signOut();
                setPgsSignedIn(false);
              } else {
                const ok = await playGames.signIn();
                setPgsSignedIn(ok);
              }
            }}
            className="w-full card-parchment p-3 flex items-center justify-between hover:border-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Trophy className={`w-3.5 h-3.5 ${pgsSignedIn ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <span className={`text-xs font-sans tracking-wider uppercase ${pgsSignedIn ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {pgsSignedIn ? 'Play Games' : 'Sign in'}
              </span>
            </div>
            {pgsSignedIn
              ? <LogOut className="w-3 h-3 text-muted-foreground/40" />
              : <LogIn className="w-3 h-3 text-muted-foreground/40" />
            }
          </button>
        )}
      </div>

      {/* RIGHT: Main game area */}
      <div className="flex-1 flex flex-col p-4 lg:p-8 relative z-10 max-w-3xl mx-auto w-full">

        {/* Chapter/Scene header */}
        <div className="mb-6 space-y-1">
          <div className="text-[0.6rem] tracking-[0.4em] text-muted-foreground/50 font-sans uppercase">
            Chapter {scene.chapter} · {scene.backgroundMood.charAt(0).toUpperCase() + scene.backgroundMood.slice(1)}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-wide">{scene.title}</h2>
          <div className="rune-divider" />
        </div>

        {/* Narrative */}
        <div
          ref={narrativeRef}
          className="space-y-4 mb-8 cursor-pointer"
          onClick={() => setShowAllNarrative(true)}
        >
          <AnimatePresence mode="sync">
            {scene.narrative.map((paragraph, index) => {
              if (!showAllNarrative && index > narrativeIndex) return null;
              return (
                <motion.p
                  key={`${state.currentScene}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`font-lore text-sm sm:text-base leading-relaxed ${
                    index === 0 || scene.narrative.length === 1
                      ? 'text-foreground'
                      : 'text-foreground/85'
                  }`}
                  data-testid={`text-narrative-${index}`}
                >
                  {paragraph}
                </motion.p>
              );
            })}
          </AnimatePresence>

          {!showAllNarrative && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[0.65rem] text-muted-foreground/40 font-sans tracking-wider text-center"
            >
              Click to reveal all...
            </motion.div>
          )}
        </div>

        {/* Consequence display */}
        <AnimatePresence>
          {consequenceText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 border border-accent/30 bg-accent/5"
            >
              <p className="font-lore italic text-accent text-sm leading-relaxed">{consequenceText}</p>
              <button
                data-testid="button-confirm-choice"
                onClick={confirmChoice}
                className="mt-3 w-full py-2 border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-sans tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
              >
                Continue <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choices */}
        {showAllNarrative && !consequenceText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {!isEnding && (
              <div className="text-[0.6rem] tracking-[0.4em] text-muted-foreground/40 font-sans uppercase mb-4">
                Your Path Diverges
              </div>
            )}

            {isEnding && endingInfo && (
              <div className="mb-6 p-4 border border-border/30 bg-card/40 space-y-2">
                <div className={`font-display text-lg font-bold ${endingInfo.color}`}>{endingInfo.label}</div>
                <p className="font-lore italic text-muted-foreground text-sm">{endingInfo.description}</p>
                <div className="rune-divider text-[0.55rem]">ᚠᛁᚾᛁᛊ</div>
              </div>
            )}

            {scene.choices.map((choice, idx) => {
              const lockStatus = isChoiceLocked(choice, state.player.stats);
              return (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  data-testid={`button-choice-${choice.id}`}
                  onClick={() => handleChoiceClick(choice)}
                  disabled={lockStatus.locked}
                  className={`choice-btn w-full text-left p-4 border transition-all ${
                    lockStatus.locked
                      ? 'border-muted/20 bg-muted/5 opacity-50 cursor-not-allowed'
                      : 'border-border/40 bg-card/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                      <span className="text-[0.6rem] text-muted-foreground/40 font-sans">{String.fromCharCode(65 + idx)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-lore text-foreground leading-snug">{choice.text}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[0.6rem] font-sans tracking-wider ${MORALITY_COLORS[choice.morality]}`}>
                          [{MORALITY_LABELS[choice.morality]}]
                        </span>
                        {lockStatus.locked && (
                          <span className="text-[0.6rem] text-muted-foreground/50 font-sans italic flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {lockStatus.reason}
                          </span>
                        )}
                        {choice.statChanges && !lockStatus.locked && (
                          <span className="text-[0.6rem] text-muted-foreground/40 font-sans italic">
                            {Object.entries(choice.statChanges)
                              .filter(([k]) => !['killCount', 'soulsConsumed', 'betrayals'].includes(k))
                              .slice(0, 3)
                              .map(([k, v]) => `${v && v > 0 ? '+' : ''}${v} ${k}`)
                              .join(' · ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${lockStatus.locked ? 'text-muted/20' : 'text-muted-foreground/40'}`} />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      {/* Inventory Panel */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card-parchment p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scroll-area space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-foreground">Inventory</h3>
                <button
                  data-testid="button-close-inventory"
                  onClick={() => setShowInventory(false)}
                  className="p-1.5 hover:bg-muted/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="rune-divider" />
              <div className="space-y-3">
                {state.player.inventory.length === 0 ? (
                  <p className="font-lore italic text-muted-foreground text-sm text-center py-4">
                    Your pockets are empty. Even shadows leave no weight.
                  </p>
                ) : (
                  state.player.inventory.map(item => (
                    <div
                      key={item.id}
                      data-testid={`item-${item.id}`}
                      className="p-3 border border-border/30 bg-card/40 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[0.65rem] font-bold font-sans ${
                          item.rarity === 'cursed' ? 'text-blood' :
                          item.rarity === 'legendary' ? 'text-gold' :
                          item.rarity === 'rare' ? 'text-blue-400' : 'text-muted-foreground'
                        }`}>
                          [{item.rarity.toUpperCase()}]
                        </span>
                        <span className="text-sm font-sans font-bold text-foreground">{item.name}</span>
                        <span className="text-[0.6rem] text-muted-foreground/50 font-sans capitalize">{item.type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/70 font-lore italic">{item.description}</p>
                      {item.lore && (
                        <p className="text-[0.65rem] text-muted-foreground/40 font-lore italic border-l border-blood/20 pl-2">
                          {item.lore}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
