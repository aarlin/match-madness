
'use client'
import React, { useEffect, useState, useRef, startTransition } from 'react';
import { normalDifficultyHiragana } from '../assets/normal/hiragana';
import { normalDifficultyKatakana } from '../assets/normal/katakana';
import { motion, useAnimationControls, useAnimation } from 'framer-motion';
import { QueueConstants } from '@/app/constants/queue-constants';
import { GameConstants } from '@/app/constants/game-constants';
import { Queue, useQueue } from '@/utils/Queue';
import { defaultComposer } from 'default-composer';
import { gsap } from 'gsap';
import useSound from 'use-sound';
import { GameMode, useGameModeStore } from '@/utils/store';
import GameReferenceModal from './GameReferenceModal';

interface MatchingPair {
  kana: string;
  roumaji: string;
  type?: string;
}

interface GameStatePairs {
  leftColumn: string[];
  rightColumn: string[];
}

export const MatchMadnessGame = () => {
  const [leftColumnSelection, setLeftColumnSelection] = useState<any>();
  const [rightColumnSelection, setRightColumnSelection] = useState<any>();
  const [currentGameStatePairs, setCurrentGameStatePairs] = useState<GameStatePairs>({ leftColumn: [], rightColumn: [] });
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>();
  const leftColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const rightColumnElements = useRef<(HTMLButtonElement | null)[]>([]);
  const gamePairQueue = useQueue<MatchingPair>();
  const comboStreakControls = useAnimation();
  const [playCorrect] = useSound('/sounds/correct.mp3');
  const [playIncorrect] = useSound('/sounds/incorrect.mp3');
  const gameMode = useGameModeStore((state) => state.gameMode);
  const [gameFile, setGameFile] = useState<any[]>([]);

  const selectInitialRandomPairs = () => {
    let leftColumn = [];
    let rightColumn = [];

    console.log(gameFile)
    console.log(gameMode)

    for (let i = 0; i < GameConstants.MAX_ROWS_DISPLAYED; i++) {
      const randomIndex = Math.floor(Math.random() * gameFile.length);
      let matchingPair = gameFile[randomIndex];

      while (currentGameStatePairs.leftColumn.includes(matchingPair.kana)
        && currentGameStatePairs.rightColumn.includes(matchingPair.roumaji)) {
        matchingPair = gameFile[randomIndex];
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
      const firstRandomIndex = Math.floor(Math.random() * gameFile.length);
      const secondRandomIndex = Math.floor(Math.random() * gameFile.length);
      let firstMatchingPair = { ...gameFile[firstRandomIndex] };
      let secondMatchingPair = { ...gameFile[secondRandomIndex] };

      while (currentGameStatePairs.leftColumn.includes(firstMatchingPair.kana)
        && currentGameStatePairs.leftColumn.includes(secondMatchingPair.kana)
        && currentGameStatePairs.rightColumn.includes(firstMatchingPair.roumaji)
        && currentGameStatePairs.rightColumn.includes(secondMatchingPair.roumaji)
        && (firstMatchingPair.kana === secondMatchingPair.kana)) {
        firstMatchingPair = { ...gameFile[firstRandomIndex] };
        secondMatchingPair = { ...gameFile[secondRandomIndex] };
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

  const updateGameStateWithMatchAttempt = () => {
    if (leftColumnSelection && rightColumnSelection) {
      const matchResult = gameFile.some((gameData) => gameData.kana === leftColumnSelection.selection && gameData.roumaji === rightColumnSelection.selection);

      if (matchResult) {
        playCorrect();
        setComboStreak((prevCombo) => prevCombo + 1)
        applyCorrectMatchStyles();
        replaceMatchedPair();
        checkQueueSize();
      } else {
        playIncorrect();
        setComboStreak(0);
        applyIncorrectMatchStyles();
      }

      setLeftColumnSelection(undefined);
      setRightColumnSelection(undefined);
    }
  }

  const resetButtonStyles = (columnElementsRef: any) => {
    for (let key of Object.keys(columnElementsRef.current)) {
      columnElementsRef.current[key].className = GameConstants.DEFAULT_BUTTON_STYLES;
    }
  }

  const applySelectButtonStyles = (index: number, columnElementsRef: any) => {
    resetButtonStyles(columnElementsRef)
    columnElementsRef.current[index]?.classList.remove('border-gray-400');
    columnElementsRef.current[index]?.classList.add('border-blue-500', 'bg-blue-100', 'text-blue-500');
  };

  const applyCorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);

    const leftSelection = { ...leftColumnSelection };
    const rightSelection = { ...rightColumnSelection };

    leftColumnElements.current[leftSelection.index]?.classList.add('border-green-500', 'bg-green-100', 'text-green-500', 'transition-animation');
    rightColumnElements.current[rightSelection.index]?.classList.add('border-green-500', 'bg-green-100', 'text-green-500', 'transition-animation');

    gsap.fromTo(
      leftColumnElements.current[leftSelection.index],
      { opacity: 1 },
      { duration: 2, opacity: 0, ease: 'power1.out', stagger: 0.1 }
    );

    gsap.fromTo(
      rightColumnElements.current[rightSelection.index],
      { opacity: 1 },
      { duration: 2, opacity: 0, ease: 'power1.out', stagger: 0.1 } // Delay the right buttons' animation to create a swiping motion
    );

    gsap.to([...leftColumnElements.current, ...rightColumnElements.current], {
      duration: 2,
      opacity: 1,
      delay: 1.5, // Adjust this delay based on your needs
    });
  }

  const applyIncorrectMatchStyles = () => {
    resetButtonStyles(leftColumnElements)
    resetButtonStyles(rightColumnElements);
    leftColumnElements.current[leftColumnSelection.index]?.classList.add('border-red-500', 'bg-red-100', 'text-red-500');
    rightColumnElements.current[rightColumnSelection.index]?.classList.add('border-red-500', 'bg-red-100', 'text-red-500');

    setTimeout(() => {
      resetButtonStyles(leftColumnElements)
      resetButtonStyles(rightColumnElements);
    }, 400)
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

      console.log(defaultComposer(currentGameStatePairs, newCurrentGameStatePairs))

      setTimeout(() => {
        setCurrentGameStatePairs((prevGameStatePairs) => defaultComposer(prevGameStatePairs, newCurrentGameStatePairs));
      }, 600)

    }
  }

  const checkQueueSize = () => {
    console.log(gamePairQueue.size)
    if (gamePairQueue.getQueue().length < 5) {
      console.log('enqueue more random pairs: ' + gamePairQueue.getQueue().length)
      enqueueNextRandomPairs();
    }
  }

  const loadGameData = () => {
    console.log(gameMode, gameFile)
    console.log(normalDifficultyHiragana, normalDifficultyKatakana)
    switch (gameMode) {
      case GameMode.HIRAGANA:
        setGameFile((prevGameFile) => [...normalDifficultyHiragana]);
        break;
      case GameMode.KATAKANA:
        setGameFile((prevGameFile) => [...normalDifficultyKatakana]);
        break;
      case GameMode.CUSTOM_GAME:
        // TODO: Custom game files
        break;
    }
  }

  useEffect(() => {
    gamePairQueue.clear();
    loadGameData();
    setCurrentGameStatePairs({ leftColumn: [], rightColumn: [] });
  }, [gameMode]);

  useEffect(() => {
    console.log('gameFile ')
    if (gameFile.length > 0) {
      selectInitialRandomPairs();
      checkQueueSize();
    }
  }, [gameFile])

  useEffect(() => {
    setGameStarted(true);
    updateGameStateWithMatchAttempt();
  }, [leftColumnSelection, rightColumnSelection])

  useEffect(() => {
    if (comboStreak > 0) {
      comboStreakControls.start({
        y: 0,
        scale: [1, 1.2, 0.9, 1.1, 0.95, 1],
        transition: {
          duration: 0.5,
        },
      });
      comboStreakControls.start({
        y: 0,
        scale: [1, 1.5, 1],
        transition: {
          duration: 0.3,
        },
      });
    } else {
      // Animate the combo streak down to 0 when it's set to 0
      comboStreakControls.start({
        y: 50, // Move the combo div down to y position 100
        scale: [1, 0.6, 0.2, 0],
        transition: {
          duration: 0.5, // Adjust the duration as needed
        },
      });
    }
  }, [comboStreak])

  return (
    <>
      {/* <div>
        <div className="relative flex h-4 w-full overflow-hidden rounded-full bg-secondary-200">
          <div className="flex h-full bg-primary-500"></div>
        </div>

        <div className="space-y-1">
          <dl className="flex items-center justify-between">
            <dt className="font-medium text-secondary-700">Progress</dt>
            <dd className="text-sm text-secondary-500">35%</dd>
          </dl>
          <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-secondary-200">
            <div className="flex h-full items-center justify-center bg-primary-500 text-xs text-white"></div>
          </div>
        </div>

      </div> */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4">

          {/* Combo Streak Spanning Two Columns */}
          <div className="col-span-2 flex justify-center items-center mb-4">
            {(comboStreak > 0 || gameStarted) && (
              <motion.div
                className="combo-counter text-xl font-bold text-green-500"
                animate={comboStreakControls}
              >
                Combo x{comboStreak}
              </motion.div>
            )}
          </div>

          <div className="col-span-2 flex justify-center items-center mb-4">
            <GameReferenceModal/>
          </div>

          {/* Left Column */}
          <div className="grid grid-cols-1 gap-4">
            {currentGameStatePairs.leftColumn.map((kana, index) => (
              <motion.button
                ref={(element) => (leftColumnElements.current[index] = element)}
                onClick={() => onLeftColumnButtonClick(index, kana)}
                key={`${kana}-${index}`}
                className={GameConstants.DEFAULT_BUTTON_STYLES}
              >
                <input className="hidden" type="radio" name="leftColumn" />
                <label>{kana}</label>
              </motion.button>
            ))}
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-4">
            {currentGameStatePairs.rightColumn.map((roumaji, index) => (
              <motion.button
                ref={(element) => (rightColumnElements.current[index] = element)}
                onClick={() => onRightColumnButtonClick(index, roumaji)}
                key={`${roumaji}-${index}`}
                className={GameConstants.DEFAULT_BUTTON_STYLES}
              >
                <input className="hidden" type="radio" name="rightColumn" />
                <label>{roumaji}</label>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
