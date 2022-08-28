import { useEffect, useState } from 'react';
import { Table } from './core/solver';

const SIZE = 2;

function App() {
  const [initialTable, setInitialTable] = useState<Table>([]);

  useEffect(() => {
    const table: Table = [];

    for (let i = 0; i < SIZE; i++) {
      table[i] = [];
      for (let j = 0; j < SIZE; j++) {
        table[i][j] = getRandom(1, 4);
      }
    }

    setInitialTable(table);
  }, []);

  return (
    <div>
      <div>want sum?</div>
      <div>{initialTable}</div>
    </div>
  );
}

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + 1);

export default App;
