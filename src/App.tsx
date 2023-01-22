import { useEffect, useState } from 'react';
import { performStep } from './core/solver';

import styled from 'styled-components';
import { useCallback } from 'react';
import {
  generateRandomTableWithSolutions,
  isStepValid,
  isTargetReached,
} from './core/helper';
import { Step, GameTable, GameState } from './core/types';
import { Table } from './components/Table';
import { Button, FullScreenContainer, Title } from './components/UI';
import { GameStateDisplay } from './components/GameStateDisplay';

const SIZE = 2;
const MAX_STEPS = 5;

type Target = {
  value: number;
  minSteps: number;
};

const TargetComponent = styled.div`
  font-weight: 700;
`;

const ButtonContainer = styled.div`
  width: 100vw;
  display: flex;
  gap: 5px;
  justify-content: center;
`;

function App() {
  const [initialTable, setInitialTable] = useState<GameTable>([]);
  const [table, setTable] = useState<GameTable>([]);
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

  const handleStepEntered = useCallback(
    (startCoordinates: number[], endCoordinates: number[]) => {
      if (isStepValid(startCoordinates, endCoordinates)) {
        const step: Step = [startCoordinates, endCoordinates].sort(
          (a, b) => a[0] - b[0] || a[1] - b[1]
        );

        const newTable = performStep(table, step);
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

  const handleReset = () => {
    setTable(initialTable);
    setGameState(GameState.InProgress);
  };

  const handleNewGame = () => {
    generateNewGame();
  };

  return (
    <FullScreenContainer>
      <Title>want sum?</Title>

      <ButtonContainer>
        <Button onClick={handleNewGame}>new</Button>
        <Button onClick={handleReset}>reset</Button>
      </ButtonContainer>

      <TargetComponent>target: {target.value}</TargetComponent>

      <Table
        table={table}
        isDisabled={gameState !== GameState.InProgress}
        onStepEntered={handleStepEntered}
      />

      <GameStateDisplay gameState={gameState} />
    </FullScreenContainer>
  );
}

export default App;
