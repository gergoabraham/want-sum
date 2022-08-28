export type Table = number[][];
export type Step = number[][];
export type Solutions = { [key in number]: number };

export const solve = (table: Table, maxStepCount = 10) => {
  const solutions: Solutions = {};

  const recursive = (table: Table, stepCount = 0) => {
    if (stepCount > maxStepCount) return;

    if (hasReachFinalState(table)) {
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

export const performStep = (table: Table, step: Step) => {
  const sum = getSum(table, step);

  const newTable = table.map((row) => [...row]);

  for (let row = step[0][0]; row <= step[1][0]; row++) {
    for (let col = step[0][1]; col <= step[1][1]; col++) {
      newTable[row][col] = sum;
    }
  }

  return newTable;
};

const getSum = (table: Table, step: Step) => {
  let sum = 0;
  for (let row = step[0][0]; row <= step[1][0]; row++) {
    for (let col = step[0][1]; col <= step[1][1]; col++) {
      sum += table[row][col];
    }
  }

  return sum;
};

const hasReachFinalState = (table: Table) => {
  const first = table[0][0];

  return table.reduce(
    (prev, currRow) =>
      prev && currRow.reduce((prev, cell) => prev && cell === first, true),
    true
  );
};
