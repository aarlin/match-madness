
'use client'
import React, { useEffect, useState, useRef } from 'react';
import hiragana from '../../constants/normal/hiragana.json';
import katakana from '../../constants/normal/katakana.json';
import { motion, useAnimationControls } from 'framer-motion';
import { QueueConstants } from '@/app/constants/queue-constants';
import { GameConstants } from '@/app/constants/game-constants';
import { Queue, useQueue } from '@/lib/Queue';
import { delayedFunctionExecution } from '../utils/utils';


interface MatchingPair {
  kana: string;
  roumaji: string;
  type?: string;
}

interface GameStatePairs {
  leftColumn: string[];
  rightColumn: string[];
}


const Game = () => {
  const [leftColumnSelection, setLeftColumnSelection] = useState<any>();
  const [rightColumnSelection, setRightColumnSelection] = useState<any>();
  const [currentGameStatePairs, setCurrentGameStatePairs] = useState<GameStatePairs>({ leftColumn: [], rightColumn: [] });
  const [comboStreak, setComboStreak] = useState<number>(0);
  const leftColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const rightColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const gamePairQueue = useQueue<MatchingPair>();

  const selectInitialRandomPairs = () => {
    let leftColumn = [];
    let rightColumn = [];

    for (let i = 0; i < GameConstants.MAX_ROWS_DISPLAYED; i++) {
      const randomIndex = Math.floor(Math.random() * hiragana.length);
      let matchingPair = hiragana[randomIndex];

      while (currentGameStatePairs.leftColumn.includes(matchingPair.kana)
        && currentGameStatePairs.rightColumn.includes(matchingPair.roumaji)) {
        matchingPair = hiragana[randomIndex];
      }

      console.log('matchingPair: ', matchingPair)

      leftColumn.push(matchingPair.kana);
      rightColumn.push(matchingPair.roumaji);
    }

    leftColumn.sort((a: string, b: string) => 0.5 - Math.random());
    rightColumn.sort((a: string, b: string) => 0.5 - Math.random());

    setCurrentGameStatePairs({ leftColumn, rightColumn });
  }

  const enqueueNextRandomPairs = () => {
    for (let i = 0; i < QueueConstants.MAX_QUEUE_SIZE; i++) {
      // grab two pairings, swap in place, add to queue
      const firstRandomIndex = Math.floor(Math.random() * hiragana.length);
      const secondRandomIndex = Math.floor(Math.random() * hiragana.length);
      let firstMatchingPair = { ...hiragana[firstRandomIndex]};
      let secondMatchingPair = { ...hiragana[secondRandomIndex]};

      while (currentGameStatePairs.leftColumn.includes(firstMatchingPair.kana)
        && currentGameStatePairs.leftColumn.includes(secondMatchingPair.kana)
        && (firstMatchingPair.kana === secondMatchingPair.kana)) {
        firstMatchingPair = {...hiragana[firstRandomIndex]};
        secondMatchingPair = {...hiragana[secondRandomIndex]};
      }
      // swap the values around
      const temporaryKana = firstMatchingPair['kana'];
      firstMatchingPair['kana'] = secondMatchingPair['kana'];
      secondMatchingPair['kana'] = temporaryKana;

      gamePairQueue.enqueue(firstMatchingPair);
      gamePairQueue.enqueue(secondMatchingPair);
    }
    console.log(gamePairQueue.getQueue())
  }

  const onLeftColumnButtonClick = (index: number, kana: string) => {
    setLeftColumnSelection({ index, selection: kana });
    applySelectButtonStyles(index, leftColumnElements)
  };

  const onRightColumnButtonClick = (index: number, roumaji: string) => {
    setRightColumnSelection({ index, selection: roumaji });
    applySelectButtonStyles(index, rightColumnElements)
  };

  const updateGameStateWithMatchAttempt = async () => {
    if (leftColumnSelection && rightColumnSelection) {
      const matchResult = hiragana.some((hiragana) => hiragana.kana === leftColumnSelection.selection && hiragana.roumaji === rightColumnSelection.selection);

      if (matchResult) {
        setComboStreak((prevCombo) => prevCombo + 1)
        applyCorrectMatchStyles();
        await delayedFunctionExecution(() => {
          replaceMatchedPair();
          checkQueueSize();
          console.log(gamePairQueue.getQueue())
        }, 1000);

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
      columnElementsRef.current[key].className = `hover:bg-gray-300 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-400 rounded-lg`
    }
  }

  const applySelectButtonStyles = (index: number, columnElementsRef: any) => {
    resetButtonStyles(columnElementsRef)
    columnElementsRef.current[index]?.classList.add('border-blue-500', 'text-blue-500');
  };

  const applyCorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);
    leftColumnElements.current[leftColumnSelection.index]?.classList.add('border-green-500', 'text-green-500', 'transition-animation');
    rightColumnElements.current[rightColumnSelection.index]?.classList.add('border-green-500', 'text-green-500', 'transition-animation');
  }

  const applyIncorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);
    leftColumnElements.current[leftColumnSelection.index]?.classList.add('border-red-500', 'text-red-500');
    rightColumnElements.current[rightColumnSelection.index]?.classList.add('border-red-500', 'text-red-500');
  }

  const replaceMatchedPair = () => {
    const newGamePair = gamePairQueue.dequeue();

    if (newGamePair) {
      const foundLeftColumnIndex = currentGameStatePairs.leftColumn.indexOf(leftColumnSelection.selection);
      const foundRightColumnIndex = currentGameStatePairs.rightColumn.indexOf(rightColumnSelection.selection);

      const newCurrentGameStatePairs = structuredClone(currentGameStatePairs)

      console.log(newCurrentGameStatePairs)

      newCurrentGameStatePairs.leftColumn[foundLeftColumnIndex] = newGamePair.kana;
      newCurrentGameStatePairs.rightColumn[foundRightColumnIndex] = newGamePair.roumaji;

      console.log('newCurrentGameStatePairs' + JSON.stringify(newCurrentGameStatePairs, null, 2))

      setCurrentGameStatePairs(newCurrentGameStatePairs);

    }
  }

  const checkQueueSize = () => {
    console.log(gamePairQueue.size)
    if (gamePairQueue.getQueue().length < 5) {
      console.log('enqueue more random pairs: ' + gamePairQueue.getQueue().length)
      enqueueNextRandomPairs();
    }
  }

  useEffect(() => {
    gamePairQueue.clear();
    setCurrentGameStatePairs({ leftColumn: [], rightColumn: [] });
    selectInitialRandomPairs();
    checkQueueSize();
  }, []);

  useEffect(() => {
    updateGameStateWithMatchAttempt();
  }, [leftColumnSelection, rightColumnSelection]);

  return (
    <>
      <div className="flex justify-between gap-4">
        <p>Combo Streak: {comboStreak}</p>
        <div className="grid grid-cols-1 gap-4">
          {currentGameStatePairs.leftColumn.map((kana, index) => (
            <motion.button
              ref={(element) => leftColumnElements.current[index] = element}
              onClick={() => onLeftColumnButtonClick(index, kana)}
              key={`${kana}-${index}`}
              className={`hover:bg-gray-300 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-400 rounded-lg`}
            >
              <input className="hidden" type="radio" name="leftColumn" />
              <label>{kana}</label>
            </motion.button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {currentGameStatePairs.rightColumn.map((roumaji, index) => (
            <motion.button
              ref={(element) => rightColumnElements.current[index] = element}
              onClick={() => onRightColumnButtonClick(index, roumaji)}
              key={`${roumaji}-${index}`}
              className={`hover:bg-gray-300 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-400 rounded-lg`}
            >
              <input className="hidden" type="radio" name="rightColumn" />
              <label>{roumaji}</label>
            </motion.button>
          ))}
        </div>
      </div>
    </>

  )
}

export default Game;
