import { useEffect, useState } from 'react';
import { performStep, solve, Step, Table } from './core/solver';

import styles from './App.module.css';
import { useCallback } from 'react';

const SIZE = 2;
const MAX_STEPS = 5;

type Target = {
  value: number;
  minSteps: number;
};

enum GameState {
  InProgress,
  GameOver,
  Won,
}

function App() {
  const [initialTable, setInitialTable] = useState<Table>([]);
  const [table, setTable] = useState<Table>([]);
  const [target, setTarget] = useState<Target>({ value: 0, minSteps: 0 });
  const [gameState, setGameState] = useState(GameState.InProgress);

  const generateNewGame = () => {
    const table: Table = [];

    for (let i = 0; i < SIZE; i++) {
      table[i] = [];
      for (let j = 0; j < SIZE; j++) {
        table[i][j] = getRandom(1, 4);
      }
    }

    setInitialTable(table);
    setTable(table);

    const solutions = solve(table, MAX_STEPS);
    const possibleTargets: number[] = Object.keys(solutions).map((x) =>
      Number(x)
    );
    const targetIndex = getRandom(0, possibleTargets.length - 1);
    const target = possibleTargets[targetIndex];

    setTarget({
      value: target,
      minSteps: solutions[target],
    });

    setGameState(GameState.InProgress);
  };

  useEffect(() => {
    generateNewGame();
  }, []);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const startElement = (event.target as HTMLElement).closest(
        `.${styles.cell}`
      );
      const startCoordinates = startElement!.id
        .split('-')
        .map((x) => Number(x));

      const handleTouchEnd = (event: TouchEvent) => {
        const changedTouch = event.changedTouches.item(0);
        if (!changedTouch) return;

        const element = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
        const endElement = element?.closest?.(`.${styles.cell}`);

        if (endElement) {
          const endCoordinates = endElement?.id
            .split('-')
            .map((x) => Number(x));

          const isStepValid =
            (startCoordinates[0] === endCoordinates[0] &&
              startCoordinates[1] !== endCoordinates[1]) ||
            (startCoordinates[1] === endCoordinates[1] &&
              startCoordinates[0] !== endCoordinates[0]);

          if (isStepValid) {
            const step: Step = [startCoordinates, endCoordinates].sort(
              (a, b) => 10 * (a[0] - b[0]) + a[1] - b[1]
            );

            const newTable = performStep(table, step);
            const largestNumber = newTable
              .flat()
              .reduce((prev, num) => Math.max(prev, num));
            const isTargetReached = newTable
              .flat()
              .every((num) => num === target.value);

            if (isTargetReached) {
              setGameState(GameState.Won);
            } else if (target.value && largestNumber > target.value) {
              setGameState(GameState.GameOver);
            }

            setTable(newTable);
          }
        }

        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchend', handleTouchEnd);
    },
    [table, target.value]
  );

  const handleReset = () => {
    setTable(initialTable);
    setGameState(GameState.InProgress);
  };

  const handleNewGame = () => {
    generateNewGame();
  };

  return (
    <div className={styles.container} style={{ height: window.innerHeight }}>
      <div className={styles.title}>want sum?</div>
      <div
        className={styles.table}
        onTouchStart={
          gameState === GameState.InProgress ? handleTouchStart : undefined
        }
      >
        {table.map((line, li) =>
          line.map((cell, ci) => (
            <div id={`${li}-${ci}`} key={`${li}-${ci}`} className={styles.cell}>
              <div>{cell}</div>
            </div>
          ))
        )}
      </div>
      <div className={styles.target}>target: {target.value}</div>

      <div className={styles.buttonContainer}>
        <button onClick={handleNewGame} className={styles.button}>
          new
        </button>
        <button onClick={handleReset} className={styles.button}>
          reset
        </button>
      </div>

      <div className={styles.gameStateContainer}>
        {gameState === GameState.Won && <div>You won!</div>}
        {gameState === GameState.GameOver && <div>You lose!</div>}
      </div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);

export default App;
