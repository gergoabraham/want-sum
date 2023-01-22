import { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  box-sizing: border-box;
  touch-action: none;
`;

interface FullScreenContainerProps {
  children: ReactNode;
}

export const FullScreenContainer = ({ children }: FullScreenContainerProps) => {
  return (
    <Container style={{ height: window.innerHeight }}>{children}</Container>
  );
};
