import styled from 'styled-components';
import { GameState } from '../../core/types';

const GameStateContainer = styled.div`
  font-size: 2em;
  height: 3em;
`;

interface GameStateDisplayProps {
  gameState: GameState;
}

export const GameStateDisplay = ({ gameState }: GameStateDisplayProps) => {
  return (
    <GameStateContainer>
      {gameState === GameState.Won && <div>you won</div>}
      {gameState === GameState.GameOver && <div>you lost</div>}
    </GameStateContainer>
  );
};
