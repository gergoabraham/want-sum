import { useEffect, useState } from 'react';
import { Solutions, solve, Table } from './core/solver';

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
    <div>
      <div>want sum?</div>
      <div>{initialTable}</div>
      <div>target: {target?.value}</div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + 1);

export default App;
