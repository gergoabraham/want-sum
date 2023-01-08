import { Solutions, Step, GameTable } from './types';

export const solve = (table: GameTable, maxStepCount = 10) => {
  const solutions: Solutions = {};

  const recursive = (table: GameTable, stepCount = 0) => {
    if (stepCount > maxStepCount) return;

    if (hasReachedAPossibleFinalState(table)) {
      const result = table[0][0];

      if (solutions[result]) {
        if (stepCount < solutions[result]) {
          solutions[result] = stepCount;
        } else {
          return;
        }
      } else {
        solutions[result] = stepCount;
      }
    }

    for (const step of steps(table.length, table[0].length)) {
      const tableWithStep = performStep(table, step);
      recursive(tableWithStep, stepCount + 1);
    }
  };

  recursive(table);

  return solutions;
};

const steps = function* (rows: number, columns = rows) {
  for (let startRow = 0; startRow < rows; startRow++) {
    for (let startCol = 0; startCol < columns; startCol++) {
      // columns
      for (let endCol = startCol + 1; endCol < columns; endCol++) {
        yield [
          [startRow, startCol],
          [startRow, endCol],
        ];
      }

      // rows
      for (let endRow = startRow + 1; endRow < rows; endRow++) {
        yield [
          [startRow, startCol],
          [endRow, startCol],
        ];
      }
    }
  }
};

export const performStep = (table: GameTable, step: Step) => {
  const sum = getSumForStep(table, step);

  const newTable = table.map((row) => [...row]);

  for (let row = step[0][0]; row <= step[1][0]; row++) {
    for (let col = step[0][1]; col <= step[1][1]; col++) {
      newTable[row][col] = sum;
    }
  }

  return newTable;
};

const getSumForStep = (table: GameTable, step: Step) => {
  let sum = 0;
  for (let row = step[0][0]; row <= step[1][0]; row++) {
    for (let col = step[0][1]; col <= step[1][1]; col++) {
      sum += table[row][col];
    }
  }

  return sum;
};

const hasReachedAPossibleFinalState = (table: GameTable) =>
  table.flat().every((num) => num === table[0][0]);
