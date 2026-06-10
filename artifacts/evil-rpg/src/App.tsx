import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TitleScreen from '@/pages/TitleScreen';
import CharacterCreation from '@/pages/CharacterCreation';
import GameScreen from '@/pages/GameScreen';
import FeedbackModal from '@/components/FeedbackModal';
import { createInitialState, loadGame, clearSave } from '@/game/engine';
import type { GameState } from '@/game/types';
import { playGames } from '@/services/playGames';
import { showInterstitial } from '@/services/ads';
import { MessageSquare } from 'lucide-react';

const queryClient = new QueryClient();

type AppView = 'title' | 'character-creation' | 'game';

export default function App() {
  const [view, setView] = useState<AppView>('title');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (saved && saved.gameStarted) {
      // Don't auto-load; let user choose from title
    }
  }, []);

  const handleNewGame = () => {
    setView('character-creation');
  };

  const handleContinue = (state: GameState) => {
    setGameState(state);
    setView('game');
  };

  const handleCharacterCreated = (
    name: string,
    classId: 'shadowblade' | 'necromancer' | 'warlord' | 'plague-doctor'
  ) => {
    const state = createInitialState(name, classId);
    setGameState(state);
    setView('game');
    playGames.trigger(`class_${classId.replace('-', '_')}`);
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const handleGameEnd = () => {
    setView('title');
    // Natural break: show a full-screen ad over the title screen (native app only).
    void showInterstitial();
  };

  const handleRestart = () => {
    clearSave();
    setGameState(null);
    setView('title');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark scanlines">
        {view === 'title' && (
          <TitleScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}
          />
        )}
        {view === 'character-creation' && (
          <CharacterCreation
            onComplete={handleCharacterCreated}
            onBack={() => setView('title')}
          />
        )}
        {view === 'game' && gameState && (
          <GameScreen
            state={gameState}
            onStateChange={handleGameStateChange}
            onGameEnd={handleGameEnd}
            onRestart={handleRestart}
          />
        )}

        <button
          data-testid="feedback-float-btn"
          onClick={() => setFeedbackOpen(true)}
          title="Submit Feedback"
          className="fixed bottom-5 right-5 z-[150] flex items-center gap-2 px-4 py-2.5 border border-blood/50 bg-black/80 hover:bg-blood/20 hover:border-blood text-blood text-xs font-sans tracking-widest uppercase transition-all shadow-lg backdrop-blur-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Feedback
        </button>

        <FeedbackModal
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          chapter={gameState?.chapter}
          scene={gameState?.currentScene}
        />
      </div>
    </QueryClientProvider>
  );
}
