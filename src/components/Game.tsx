
'use client'
import React, { useEffect, useState } from 'react';
import hiragana from '../../constants/normal/hiragana.json';
import katakana from '../../constants/normal/katakana.json';

interface MatchingPair {
  kana: string;
  roumaji: string;
  type: string;
}

const Game = () => {
  const [leftColumnSelection, setLeftColumnSelection] = useState<string>();
  const [rightColumnSelection, setRightColumnSelection] = useState<string>();
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);
  const [correctMatch, setCorrectMatch] = useState<boolean>();

  const selectRandomPair = () => {
    const matchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];
    setMatchingPairs((prevMatchingPairs) => [...prevMatchingPairs, matchingPair]);
  }

  // 5 random pairs
  // if left column selected, highlight blue -- reselect is unselect
  // if right column selected, highlight blue -- reselect is unselect
  // if left && right, check if match -- if it is highlight that selection green else red
  // make it disappear gradually and add new random pair in place after delay
  // ideally these placements are delayed so that someone cant keep clicking the same place
  // there should be delay for reappearing so that it incentivize the player matching other shown pairs
  // dont get a random pair that already is on the board

  const onLeftColumnButtonClick = (e) => {
    leftColumnSelection ? setLeftColumnSelection(undefined) : setLeftColumnSelection(e);
  }

  const onRightColumnButtonClick = (e) => {
    rightColumnSelection ? setRightColumnSelection(undefined) : setRightColumnSelection(e);
  }

  const setButtonStyle = (buttonSelection: string | undefined, comparedTo: string): string => {
    if (buttonSelection && buttonSelection === comparedTo) {
      if (correctMatch) {
        return 'border-green-400 text-green-400'
      }
      return 'border-blue-400 text-blue-400';
    }

    return '';
  }

  useEffect(() => {
    if (leftColumnSelection && rightColumnSelection) {
      setTimeout(() => {
        const matchResult = hiragana.some((hiragana) => hiragana.kana === leftColumnSelection && hiragana.roumaji === rightColumnSelection);
        setCorrectMatch(matchResult);
        setLeftColumnSelection(undefined)
        setRightColumnSelection(undefined)
      }, 300)
    }
  }, [leftColumnSelection, rightColumnSelection])

  useEffect(() => {
    Array.from(Array(5).keys()).map(() => selectRandomPair());
  }, []);

  return (
    <div className="flex justify-between gap-4">
      <div className="grid grid-cols-1 gap-4">
        {matchingPairs.map((matchingPair, index) => (
          <button
            onClick={() => onLeftColumnButtonClick(matchingPair.kana)}
            key={`${matchingPair.kana}-${index}`}
            className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg ${setButtonStyle(leftColumnSelection, matchingPair.kana)}}`}
          >
            <input className="hidden" type="radio" name="leftColumn" />
            <label>{matchingPair.kana}</label>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {matchingPairs.map((matchingPair, index) => (
          <button
            onClick={() => onRightColumnButtonClick(matchingPair.roumaji)}
            key={`${matchingPair.roumaji}-${index}`}
            className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg ${setButtonStyle(rightColumnSelection, matchingPair.roumaji)}}`}
          >
            <input className="hidden" type="radio" name="rightColumn" />
            <label>{matchingPair.roumaji}</label>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Game;
