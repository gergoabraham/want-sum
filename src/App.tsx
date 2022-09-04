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

function App() {
  const [initialTable, setInitialTable] = useState<Table>([]);
  const [table, setTable] = useState<Table>([]);
  const [target, setTarget] = useState<Target>();

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
            setTable((table) => performStep(table, step));
          }
        }

        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchend', handleTouchEnd);
    },
    []
  );

  const handleReset = () => {
    setTable(initialTable);
  };

  const handleNewGame = () => {
    generateNewGame();
  };

  return (
    <div className={styles.container} style={{ height: window.innerHeight }}>
      <div className={styles.title}>want sum?</div>
      <div className={styles.tableContainer}>
        <div className={styles.table} onTouchStart={handleTouchStart}>
          {table.map((line, li) =>
            line.map((cell, ci) => (
              <div
                id={`${li}-${ci}`}
                key={`${li}-${ci}`}
                className={styles.cell}
              >
                <div>{cell}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={styles.target}>target: {target?.value}</div>

      <div className={styles.buttonContainer}>
        <button onClick={handleNewGame} className={styles.button}>
          new
        </button>
        <button onClick={handleReset} className={styles.button}>
          reset
        </button>
      </div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);

export default App;
