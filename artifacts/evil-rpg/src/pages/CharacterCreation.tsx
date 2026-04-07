import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Swords, Skull, Shield, Zap } from 'lucide-react';
import { CLASSES } from '@/game/classes';
import type { ClassDefinition } from '@/game/types';

interface CharacterCreationProps {
  onComplete: (name: string, classId: 'shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor') => void;
  onBack: () => void;
}

const CLASS_ICONS: Record<string, React.ElementType> = {
  shadowblade: Swords,
  necromancer: Skull,
  warlord: Shield,
  'plague-doctor': Zap,
};

const RARITY_COLORS: Record<string, string> = {
  common: 'text-muted-foreground',
  rare: 'text-blue-400',
  legendary: 'text-gold',
  cursed: 'text-blood',
};

export default function CharacterCreation({ onComplete, onBack }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<ClassDefinition>(CLASSES[0]);
  const [nameError, setNameError] = useState('');
  const [step, setStep] = useState<'name' | 'class' | 'confirm'>('name');

  const handleNameContinue = () => {
    if (!name.trim()) {
      setNameError('A name is required. Even villains must be remembered.');
      return;
    }
    if (name.trim().length < 2) {
      setNameError('Too short. A sovereign deserves more than a syllable.');
      return;
    }
    setNameError('');
    setStep('class');
  };

  const handleComplete = () => {
    onComplete(name.trim(), selectedClass.id);
  };

  const Icon = CLASS_ICONS[selectedClass.id];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs tracking-[0.4em] text-muted-foreground uppercase">Chapter Prologue</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {step === 'name' && 'Who Are You?'}
            {step === 'class' && 'What Have You Become?'}
            {step === 'confirm' && 'Are You Certain?'}
          </h2>
        </div>

        <div className="rune-divider">ᚨᚱᚷᛊ</div>

        {/* Step: Name */}
        {step === 'name' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="font-lore italic text-muted-foreground text-center text-sm leading-relaxed">
              Before the darkness, there was a name. Before the Crown, there was a person.
              What do they call you? What will history curse?
            </p>
            <div className="space-y-3">
              <input
                data-testid="input-character-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNameContinue()}
                placeholder="Enter your name..."
                maxLength={24}
                className="w-full bg-card border border-border px-4 py-3 font-sans text-foreground text-center text-lg tracking-wider placeholder:text-muted-foreground/40 focus:outline-none focus:border-blood/60 transition-colors"
              />
              {nameError && (
                <p className="text-blood text-xs text-center font-lore italic">{nameError}</p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                data-testid="button-back-to-title"
                onClick={onBack}
                className="flex-1 py-3 border border-muted/30 text-muted-foreground hover:text-foreground hover:border-muted/60 transition-all text-sm font-sans tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                data-testid="button-name-continue"
                onClick={handleNameContinue}
                className="flex-2 flex-[2] py-3 border border-blood/40 bg-blood/5 hover:bg-blood/15 hover:border-blood/70 text-foreground transition-all text-sm font-sans tracking-wider uppercase flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step: Class */}
        {step === 'class' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <p className="font-lore italic text-muted-foreground text-center text-sm">
              {name} — what path has led you here?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {CLASSES.map(cls => {
                const ClsIcon = CLASS_ICONS[cls.id];
                const isSelected = selectedClass.id === cls.id;
                return (
                  <button
                    key={cls.id}
                    data-testid={`button-class-${cls.id}`}
                    onClick={() => setSelectedClass(cls)}
                    className={`card-parchment p-4 text-left transition-all duration-200 border ${
                      isSelected
                        ? 'border-blood/60 bg-blood/10'
                        : 'border-border/40 hover:border-border/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ClsIcon className={`w-4 h-4 ${isSelected ? 'text-blood' : 'text-muted-foreground'}`} />
                      <span className={`font-sans text-xs tracking-wider uppercase font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {cls.name}
                      </span>
                    </div>
                    <p className="text-[0.7rem] text-muted-foreground/70 font-lore italic leading-snug">
                      {cls.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected class details */}
            <motion.div
              key={selectedClass.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-parchment p-5 space-y-4 border border-blood/20"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-6 h-6 text-blood mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-bold tracking-wider text-foreground">{selectedClass.name}</h3>
                  <p className="font-lore italic text-xs text-muted-foreground leading-relaxed">{selectedClass.lore}</p>
                </div>
              </div>

              <div className="rune-divider text-[0.55rem]">ᚨᛒᛁᛚᛁᛏᚤ</div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-3 h-3 text-accent" />
                  <span className="text-xs font-sans font-bold tracking-wider text-accent">{selectedClass.ability}</span>
                </div>
                <p className="text-[0.7rem] text-muted-foreground/80 font-lore italic">{selectedClass.abilityDescription}</p>
              </div>

              <div className="rune-divider text-[0.55rem]">ᛊᛏᚨᚱᛏᛁᚾᚷ</div>

              <div>
                <div className="text-xs font-sans tracking-wider text-muted-foreground mb-1">Starting Item</div>
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-bold ${RARITY_COLORS[selectedClass.startingItem.rarity]}`}>
                    [{selectedClass.startingItem.rarity.toUpperCase()}]
                  </span>
                  <div>
                    <span className="text-xs font-sans text-foreground">{selectedClass.startingItem.name}</span>
                    <p className="text-[0.65rem] text-muted-foreground/70 font-lore italic mt-0.5">{selectedClass.startingItem.lore}</p>
                  </div>
                </div>
              </div>

              {/* Base stats mini-display */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'strength', label: 'STR', value: selectedClass.baseStats.strength ?? 12 },
                  { key: 'cunning', label: 'CUN', value: selectedClass.baseStats.cunning ?? 12 },
                  { key: 'darkness', label: 'DRK', value: selectedClass.baseStats.darkness ?? 0 },
                ].map(stat => (
                  <div key={stat.key} className="text-center p-2 bg-muted/20 border border-muted/20">
                    <div className="text-[0.6rem] tracking-wider text-muted-foreground/60 font-sans">{stat.label}</div>
                    <div className="text-sm font-bold text-foreground font-sans">{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex gap-4">
              <button
                data-testid="button-back-to-name"
                onClick={() => setStep('name')}
                className="flex-1 py-3 border border-muted/30 text-muted-foreground hover:text-foreground hover:border-muted/60 transition-all text-sm font-sans tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                data-testid="button-class-continue"
                onClick={() => setStep('confirm')}
                className="flex-[2] py-3 border border-blood/40 bg-blood/5 hover:bg-blood/15 hover:border-blood/70 text-foreground transition-all text-sm font-sans tracking-wider uppercase flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step: Confirm */}
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-parchment p-6 text-center space-y-4 border border-blood/30">
              <div className="text-4xl text-muted-foreground/20 font-mono">
                {TITLE_GLYPHS[Math.floor(Math.random() * TITLE_GLYPHS.length)]}
              </div>
              <h3 className="font-display text-2xl text-foreground">{name}</h3>
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-blood" />
                <span className="font-sans text-sm tracking-widest uppercase text-muted-foreground">{selectedClass.name}</span>
              </div>
              <div className="rune-divider" />
              <p className="font-lore italic text-muted-foreground text-sm leading-relaxed">
                "{selectedClass.lore}"
              </p>
              <div className="rune-divider" />
              <p className="text-[0.7rem] tracking-wider text-muted-foreground/50 font-sans uppercase">
                The path of darkness awaits. There is no return.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                data-testid="button-back-to-class"
                onClick={() => setStep('class')}
                className="flex-1 py-3 border border-muted/30 text-muted-foreground hover:text-foreground hover:border-muted/60 transition-all text-sm font-sans tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Reconsider
              </button>
              <button
                data-testid="button-begin-game"
                onClick={handleComplete}
                className="flex-[2] py-4 border border-blood bg-blood/10 hover:bg-blood/25 text-foreground transition-all text-sm font-sans tracking-widest uppercase font-bold animate-glow-pulse flex items-center justify-center gap-2"
              >
                <Skull className="w-4 h-4" />
                Embrace Darkness
                <Skull className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

const TITLE_GLYPHS = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'];
