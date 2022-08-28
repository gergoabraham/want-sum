import { useEffect, useState } from 'react';
import { solve, Table } from './core/solver';

import styles from './App.module.css';

const SIZE = 2;
const MAX_STEPS = 5;

type Target = {
  value: number;
  minSteps: number;
};

function App() {
  const [initialTable, setInitialTable] = useState<Table>([]);
  const [target, setTarget] = useState<Target>();

  useEffect(() => {
    const table: Table = [];

    for (let i = 0; i < SIZE; i++) {
      table[i] = [];
      for (let j = 0; j < SIZE; j++) {
        table[i][j] = getRandom(1, 4);
      }
    }

    setInitialTable(table);

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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>want sum?</div>
      <div className={styles.table}>
        {initialTable.map((line, li) =>
          line.map((cell, ci) => (
            <div key={`${li}-${ci}`} className={styles.cell}>
              <div>{cell}</div>
            </div>
          ))
        )}
      </div>
      <div className={styles.target}>target: {target?.value}</div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);

export default App;
