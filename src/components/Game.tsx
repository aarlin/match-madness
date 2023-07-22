
'use client'
import React, { useEffect, useState } from 'react';
import hiragana from '../../constants/hiragana.json';
import katakana from '../../constants/katakana.json';

interface MatchingPair {
  kana: string;
  roumaji: string;
  type: string;
}

const Game = () => {
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);

  const selectRandomPair = () => {
    const matchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];
    setMatchingPairs((prevMatchingPairs) => [...prevMatchingPairs, matchingPair]);
  }

  useEffect(() => {
    selectRandomPair();
    selectRandomPair();
    selectRandomPair();
    selectRandomPair();
    selectRandomPair();
  }, []);



  return (
    <div className="flex justify-between gap-4">
      <div className="grid grid-cols-1 gap-4">
        {matchingPairs.map((matchingPair) => (
          <button key={matchingPair.kana} className="hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg">
            {matchingPair.kana}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {matchingPairs.map((matchingPair) => (
          <button key={matchingPair.roumaji} className="hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg">
            {matchingPair.roumaji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Game;
