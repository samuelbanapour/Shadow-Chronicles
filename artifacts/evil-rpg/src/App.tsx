import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TitleScreen from '@/pages/TitleScreen';
import CharacterCreation from '@/pages/CharacterCreation';
import GameScreen from '@/pages/GameScreen';
import { createInitialState, loadGame, clearSave } from '@/game/engine';
import type { GameState } from '@/game/types';

const queryClient = new QueryClient();

type AppView = 'title' | 'character-creation' | 'game';

export default function App() {
  const [view, setView] = useState<AppView>('title');
  const [gameState, setGameState] = useState<GameState | null>(null);

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
  };

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const handleGameEnd = () => {
    setView('title');
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
      </div>
    </QueryClientProvider>
  );
}
