
'use client'
import React, { useEffect, useState, useRef } from 'react';
import hiragana from '../../constants/normal/hiragana.json';
import katakana from '../../constants/normal/katakana.json';
import { motion, useAnimationControls } from 'framer-motion';

interface MatchingPair {
  kana: string;
  roumaji: string;
  type: string;
}

interface GameStatePairs {
  leftColumn: string[];
  rightColumn: string[];
}

type NextGameStatePairs = GameStatePairs & { pairLength: number; }


const Game = () => {
  const [leftColumnSelection, setLeftColumnSelection] = useState<any>();
  const [rightColumnSelection, setRightColumnSelection] = useState<any>();
  const [currentGameStatePairs, setCurrentGameStatePairs] = useState<GameStatePairs>({ leftColumn: [], rightColumn: [] });
  const [nextGameStatePairs, setNextGameStatePairs] = useState<NextGameStatePairs>({ leftColumn: [], rightColumn: [], pairLength: 0 });
  const [correctMatch, setCorrectMatch] = useState<boolean>();
  const [comboStreak, setComboStreak] = useState<number>(0);
  const leftColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const rightColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const grayscaleControls = useAnimationControls();

  const selectInitialRandomPairs = () => {
    let leftColumn = [];
    let rightColumn = [];

    for (let i = 0; i < 5; i++) {
      let matchingPair: MatchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];

      while (currentGameStatePairs.leftColumn.includes(matchingPair.kana)) {
        matchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];
      }

      leftColumn.push(matchingPair.kana);
      rightColumn.push(matchingPair.roumaji);
    }

    leftColumn.sort((a: string, b: string) => 0.5 - Math.random());
    rightColumn.sort((a: string, b: string) => 0.5 - Math.random());

    setCurrentGameStatePairs({ leftColumn, rightColumn });
  }

  const animateGrayscale = async () => {
    while (true) {
      // Grayscale from 0 to 100
      await grayscaleControls.start({ filter: 'grayscale(100%)' });
      // Delay for a short period
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Grayscale from 100 back to 0
      await grayscaleControls.start({ filter: 'grayscale(0%)' });
      // Delay for a short period before restarting the loop
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const selectNextRandomPair = () => {
    const newNextGameStatePairs: NextGameStatePairs = { leftColumn: [], rightColumn: [], pairLength: 0 }
    for (let i = 0; i < 2; i++) {
      let matchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];

      while (currentGameStatePairs.leftColumn.includes(matchingPair.kana)
        && nextGameStatePairs.leftColumn.includes(matchingPair.kana)) {
        matchingPair = hiragana[Math.floor(Math.random() * hiragana.length)];
      }
      newNextGameStatePairs.leftColumn.push(matchingPair.kana);
      newNextGameStatePairs.rightColumn.push(matchingPair.roumaji);
      newNextGameStatePairs.pairLength++;
    }
    setNextGameStatePairs((prevNextGameStatePairs) => newNextGameStatePairs);
  }

  const onLeftColumnButtonClick = (index: number, kana: string) => {
    setLeftColumnSelection({ index, selection: kana });
    applySelectButtonStyles(index, leftColumnElements)
  };

  const onRightColumnButtonClick = (index: number, roumaji: string) => {
    setRightColumnSelection({ index, selection: roumaji });
    applySelectButtonStyles(index, rightColumnElements)
  };

  const updateGameStateWithMatchAttempt = () => {
    if (leftColumnSelection && rightColumnSelection) {
      const matchResult = hiragana.some((hiragana) => hiragana.kana === leftColumnSelection.selection && hiragana.roumaji === rightColumnSelection.selection);
      setCorrectMatch(matchResult);

      if (matchResult) {
        setComboStreak((prevCombo) => prevCombo + 1)
        applyCorrectMatchStyles();
        replaceMatchedPair();
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
    columnElementsRef.current[index]?.classList.add('border-blue-500', 'text-blue-500');
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

  const pickNextMismatchedPair = () => {
    const randomIndex = Math.round(Math.random());

    let newLeftElementToAdd;
    let newRightElementToAdd;

    if (randomIndex === 0 && nextGameStatePairs.pairLength > 1) {
      newLeftElementToAdd = nextGameStatePairs.leftColumn[0];
      newRightElementToAdd = nextGameStatePairs.rightColumn[1];
      nextGameStatePairs.leftColumn.splice(0, 1);
      nextGameStatePairs.rightColumn.splice(1);
      nextGameStatePairs.pairLength--;
    } else if (randomIndex === 1 && nextGameStatePairs.pairLength > 1) {
      newLeftElementToAdd = nextGameStatePairs.leftColumn[1];
      newRightElementToAdd = nextGameStatePairs.rightColumn[0];
      nextGameStatePairs.leftColumn.splice(1);
      nextGameStatePairs.rightColumn.splice(0, 1);
      nextGameStatePairs.pairLength--;
    } else {
      newLeftElementToAdd = nextGameStatePairs.leftColumn[0];
      newRightElementToAdd = nextGameStatePairs.rightColumn[0];
      nextGameStatePairs.leftColumn.splice(0);
      nextGameStatePairs.rightColumn.splice(0);
      nextGameStatePairs.pairLength--;
    }

    if (nextGameStatePairs.pairLength === 0) {
      // Exhausted next game pair options. Generate new pairs
      selectNextRandomPair();
    }

    return { newLeftElementToAdd, newRightElementToAdd}
  }

  const replaceMatchedPair = () => {
    const foundLeftColumnIndex = currentGameStatePairs.leftColumn.indexOf(leftColumnSelection.selection);
    const foundRightColumnIndex = currentGameStatePairs.rightColumn.indexOf(rightColumnSelection.selection);

    const { newLeftElementToAdd, newRightElementToAdd } = pickNextMismatchedPair();

    const newCurrentGameStatePairs = structuredClone(currentGameStatePairs)

    newCurrentGameStatePairs.leftColumn[foundLeftColumnIndex] = newLeftElementToAdd;
    newCurrentGameStatePairs.rightColumn[foundRightColumnIndex] = newRightElementToAdd;

    setCurrentGameStatePairs((prevCurrentGameStatePairs) => newCurrentGameStatePairs);
  }

  useEffect(() => {
    setCurrentGameStatePairs({ leftColumn: [], rightColumn: [] });
    selectInitialRandomPairs();
    selectNextRandomPair();
  }, []);

  useEffect(() => {
    updateGameStateWithMatchAttempt();
  }, [leftColumnSelection, rightColumnSelection])

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
              className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg`}
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
              className={`hover:bg-gray-200 text-black font-bold py-2 px-4 border-2 border-b-4 border-gray-300 rounded-lg`}
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
