'use client'
import { GameMode, useGameModeStore } from '../lib/store';

export const GameModeSelection = () => {
  const setGameMode = useGameModeStore((state) => state.setGameMode);

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
      <button onClick={() => setGameMode(GameMode.CUSTOM_GAME)}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Custom Game
      </button>
    </>
  )
}
