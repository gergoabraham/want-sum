import { useEffect, useState } from 'react';
import { performStep as applyStepOnTable } from './core/solver';

import styled from 'styled-components';
import { useCallback } from 'react';
import Cell from './components/Cell';
import {
  generateRandomTableWithSolutions,
  isStepValid,
  isTargetReached,
} from './core/helper';
import { Step, Table } from './core/types';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  box-sizing: border-box;
  touch-action: none;
`;

const Title = styled.div`
  font-size: 2em;
  font-weight: 700;
`;

const TableComponent = styled.div`
  width: min(60vw, 40vh);
  height: min(60vw, 40vh);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;

  text-align: center;
  font-size: 2em;
`;

const TargetComponent = styled.div`
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  width: 100vw;
  display: flex;
  gap: 5px;
  justify-content: center;
`;

const Button = styled.button`
  height: 5em;
  width: 5em;

  font-size: 1em;

  border: none;
  background-color: lightgreen;

  cursor: pointer;
`;

const GameStateContainer = styled.div`
  font-size: 2em;
  height: 3em;
`;

function App() {
  const [initialTable, setInitialTable] = useState<Table>([]);
  const [table, setTable] = useState<Table>([]);
  const [target, setTarget] = useState<Target>({ value: 0, minSteps: 0 });
  const [gameState, setGameState] = useState(GameState.InProgress);

  const generateNewGame = () => {
    const { table, target } = generateRandomTableWithSolutions(SIZE, MAX_STEPS);

    setInitialTable(table);
    setTable(table);
    setTarget(target);
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

      if (isStepValid(startCoordinates, endCoordinates)) {
        const step: Step = [startCoordinates, endCoordinates].sort(
          (a, b) => a[0] - b[0] || a[1] - b[1]
        );

        const newTable = applyStepOnTable(table, step);
        const largestNumber = newTable
          .flat()
          .reduce((prev, num) => Math.max(prev, num));

        if (isTargetReached(newTable, target.value)) {
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
    <Container style={{ height: window.innerHeight }}>
      <Title>want sum?</Title>

      <ButtonContainer>
        <Button onClick={handleNewGame}>new</Button>
        <Button onClick={handleReset}>reset</Button>
      </ButtonContainer>

      <TargetComponent>target: {target.value}</TargetComponent>

      <TableComponent
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
      </TableComponent>

      <GameStateContainer>
        {gameState === GameState.Won && <div>you won</div>}
        {gameState === GameState.GameOver && <div>you lost</div>}
      </GameStateContainer>
    </Container>
  );
}

export default App;
