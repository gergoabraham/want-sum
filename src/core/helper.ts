import { solve } from './solver';
import { Table } from './types';

export const isStepValid = (
  startCoordinates: number[],
  endCoordinates: number[]
) => {
  return (
    (startCoordinates[0] === endCoordinates[0] &&
      startCoordinates[1] !== endCoordinates[1]) ||
    (startCoordinates[1] === endCoordinates[1] &&
      startCoordinates[0] !== endCoordinates[0])
  );
};

export const isTargetReached = (table: Table, target: number) =>
  table.flat().every((num) => num === target);

export const generateRandomTableWithSolutions = (
  size: number,
  maxSteps: number
) => {
  const table: Table = [];

  for (let i = 0; i < size; i++) {
    table[i] = [];
    for (let j = 0; j < size; j++) {
      table[i][j] = getRandom(1, 4);
    }
  }

  const solutions = solve(table, maxSteps);
  const possibleTargets: number[] = Object.keys(solutions).map((x) =>
    Number(x)
  );
  const targetIndex = getRandom(0, possibleTargets.length - 1);
  const target = possibleTargets[targetIndex];
  const targetObject = {
    value: target,
    minSteps: solutions[target],
  };

  return { table, target: targetObject };
};

const getRandom = (min: number, max: number) =>
  Math.floor((max - min + 1) * Math.random() + min);
