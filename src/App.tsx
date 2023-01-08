import { useEffect, useState } from 'react';
import {
  performStep as applyStepOnTable,
  solve,
  Step,
  Table,
} from './core/solver';

import styles from './App.module.css';
import { useCallback } from 'react';
import Cell from './components/Cell';

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

  const performStep = useCallback(
    (startCoordinates: number[], endElement: Element | null | undefined) => {
      if (!endElement) {
        return;
      }

      const endCoordinates = endElement?.id.split('-').map((x) => Number(x));

      const isStepValid =
        (startCoordinates[0] === endCoordinates[0] &&
          startCoordinates[1] !== endCoordinates[1]) ||
        (startCoordinates[1] === endCoordinates[1] &&
          startCoordinates[0] !== endCoordinates[0]);

      if (isStepValid) {
        const step: Step = [startCoordinates, endCoordinates].sort(
          (a, b) => a[0] - b[0] || a[1] - b[1]
        );

        const newTable = applyStepOnTable(table, step);
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
    },
    [table, target.value]
  );

  const getStartCoordinates = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const startElement = (event.target as HTMLElement).closest(
      '[data-cell="true"]'
    );
    if (!startElement) {
      return null;
    }

    const startCoordinates = startElement.id.split('-').map((x) => Number(x));

    return startCoordinates;
  };

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const startCoordinates = getStartCoordinates(event);
      if (!startCoordinates) {
        return;
      }

      const handleTouchEnd = (event: TouchEvent) => {
        window.removeEventListener('touchend', handleTouchEnd);

        const changedTouch = event.changedTouches.item(0);
        if (!changedTouch) return;

        const element = document.elementFromPoint(
          changedTouch.clientX,
          changedTouch.clientY
        );
        const endElement = element?.closest?.('[data-cell="true"]');

        performStep(startCoordinates, endElement);
      };

      window.addEventListener('touchend', handleTouchEnd);
    },
    [performStep]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const startCoordinates = getStartCoordinates(event);
      if (!startCoordinates) {
        return;
      }

      const handleMouseUp = (event: MouseEvent) => {
        window.removeEventListener('mouseup', handleMouseUp);

        const endElement = (event.target as HTMLElement)?.closest?.(
          '[data-cell="true"]'
        );

        performStep(startCoordinates, endElement);
      };

      window.addEventListener('mouseup', handleMouseUp);
    },
    [performStep]
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

      <div className={styles.buttonContainer}>
        <button onClick={handleNewGame} className={styles.button}>
          new
        </button>
        <button onClick={handleReset} className={styles.button}>
          reset
        </button>
      </div>

      <div className={styles.target}>target: {target.value}</div>

      <div
        className={styles.table}
        onMouseDown={
          gameState === GameState.InProgress ? handleMouseDown : undefined
        }
        onTouchStart={
          gameState === GameState.InProgress ? handleTouchStart : undefined
        }
      >
        {table.map((line, rowIndex) =>
          line.map((cellValue, columnIndex) => (
            <Cell
              key={`${rowIndex}-${columnIndex}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              isDimmed={gameState !== GameState.InProgress}
              value={cellValue}
            />
          ))
        )}
      </div>

      <div className={styles.gameStateContainer}>
        {gameState === GameState.Won && <div>you won</div>}
        {gameState === GameState.GameOver && <div>you lost</div>}
      </div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);

export default App;
