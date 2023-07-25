'use client'
import { GameMode, useCustomGameStore, useGameModeStore } from '../lib/store';
import { redirect } from 'next/navigation';

export const TopNavigation = () => {
  const setGameMode = useGameModeStore((state) => state.setGameMode);
  const setShowModal = useCustomGameStore((state) => state.setShowModal);

  return (
    <>
      <button onClick={() => setGameMode(GameMode.HIRAGANA)}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Hiragana
      </button>
      <button onClick={() => setGameMode(GameMode.KATAKANA)}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Katakana
      </button>
      <button onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Custom Game
      </button>
      <button onClick={() => redirect('/community')}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Community
      </button>
    </>
  )
}
