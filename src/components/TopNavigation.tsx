'use client'
import { GameMode, useCustomGameStore, useGameModeStore } from '@/utils/store';
import { useRouter } from 'next/navigation'

export const TopNavigation = () => {
  const setGameMode = useGameModeStore((state) => state.setGameMode);
  const setShowModal = useCustomGameStore((state) => state.setShowModal);
  const router = useRouter();

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg"
        onClick={() => {
          setGameMode(GameMode.HIRAGANA)
          router.push('/');
        }}>
        Hiragana
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg"
        onClick={() => {
          setGameMode(GameMode.KATAKANA)
          router.push('/');
        }}>
        Katakana
      </button>
      <button onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Custom Game
      </button>
      <button onClick={() => router.push('/community')}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-lg">
        Community
      </button>
    </>
  )
}
