
'use client'
import React, { useEffect, useState, useRef } from 'react';
import hiragana from '../../constants/normal/hiragana.json';
import katakana from '../../constants/normal/katakana.json';

interface MatchingPair {
  kana: string;
  roumaji: string;
  type: string;
}

const Game = () => {
  const [leftColumnSelection, setLeftColumnSelection] = useState<any>();
  const [rightColumnSelection, setRightColumnSelection] = useState<any>();
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([]);
  const [correctMatch, setCorrectMatch] = useState<boolean>();
  const [comboStreak, setComboStreak] = useState<number>(0);
  const leftColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const rightColumnElements = useRef<(HTMLButtonElement | null)[]>([]);

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
  // theres some weird logic in place for new rows to appear... might come from batches of 5 and show only one
  // there should be delay for reappearing so that it incentivize the player matching other shown pairs
  // dont get a random pair that already is on the board

  const onLeftColumnButtonClick = (index: number, kana: string) => {
    setLeftColumnSelection({ index, selection: kana });
    applySelectButtonStyles(index, leftColumnElements)
  };

  const onRightColumnButtonClick = (index: number, roumaji: string) => {
    setRightColumnSelection({ index, selection: roumaji });
    applySelectButtonStyles(index, rightColumnElements)
  };

  const updateGameWithMatchAttempt = () => {
    if (leftColumnSelection && rightColumnSelection) {
      const matchResult = hiragana.some((hiragana) => hiragana.kana === leftColumnSelection.selection && hiragana.roumaji === rightColumnSelection.selection);
      setCorrectMatch(matchResult);

      if (matchResult) {
        setComboStreak((prevCombo) => prevCombo + 1)
        applyCorrectMatchStyles();
      } else {
        setComboStreak(0);
        applyIncorrectMatchStyles();
      }

      setLeftColumnSelection(undefined);
      setRightColumnSelection(undefined);
    }
  }

  const resetButtonStyles = (columnElementsRef: any) => {
    for (let key of Object.keys(columnElementsRef.current)) {
      columnElementsRef.current[key].className = `hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg`
    }
  }

  const applySelectButtonStyles = (index: number, columnElementsRef: any) => {
    resetButtonStyles(columnElementsRef)
    columnElementsRef.current[index].classList.add('border-blue-500', 'text-blue-500');
  };

  const applyCorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);
    leftColumnElements.current[leftColumnSelection.index]?.classList.add('border-green-500', 'text-green-500');
    rightColumnElements.current[rightColumnSelection.index]?.classList.add('border-green-500', 'text-green-500');
  }

  const applyIncorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);
    leftColumnElements.current[leftColumnSelection.index]?.classList.add('border-red-500', 'text-red-500');
    rightColumnElements.current[rightColumnSelection.index]?.classList.add('border-red-500', 'text-red-500');
  }

  useEffect(() => {
    setMatchingPairs([]);
    Array.from(Array(5).keys()).map(() => selectRandomPair());
  }, []);

  useEffect(() => {
    updateGameWithMatchAttempt();
  }, [leftColumnSelection, rightColumnSelection])

  return (
    <>
      <div className="flex justify-between gap-4">
        <p>Combo Streak: {comboStreak}</p>
        <div className="grid grid-cols-1 gap-4">
          {matchingPairs.map((matchingPair, index) => (
            <button
              ref={(element) => leftColumnElements.current[index] = element}
              onClick={() => onLeftColumnButtonClick(index, matchingPair.kana)}
              key={`${matchingPair.kana}-${index}`}
              className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg`}
            >
              <input className="hidden" type="radio" name="leftColumn" />
              <label>{matchingPair.kana}</label>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {matchingPairs.map((matchingPair, index) => (
            <button
              ref={(element) => rightColumnElements.current[index] = element}
              onClick={() => onRightColumnButtonClick(index, matchingPair.roumaji)}
              key={`${matchingPair.roumaji}-${index}`}
              className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg`}
            >
              <input className="hidden" type="radio" name="rightColumn" />
              <label>{matchingPair.roumaji}</label>
            </button>
          ))}
        </div>
      </div>
    </>

  )
}

export default Game;
