import { GameTable } from '../../core/types';
import Cell from './Cell';
import styled from 'styled-components';
import { useCallback } from 'react';

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

interface TableProps {
  table: GameTable;
  isDisabled: boolean;

  onStepEntered: (startCoordinates: number[], endElement: number[]) => void;
}

const Table = ({ table, isDisabled, onStepEntered }: TableProps) => {
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

        if (!endElement) {
          return;
        }

        const endCoordinates = endElement?.id.split('-').map((x) => Number(x));

        onStepEntered(startCoordinates, endCoordinates);
      };

      window.addEventListener('touchend', handleTouchEnd);
    },
    [onStepEntered]
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

        if (!endElement) {
          return;
        }

        const endCoordinates = endElement?.id.split('-').map((x) => Number(x));

        onStepEntered(startCoordinates, endCoordinates);
      };

      window.addEventListener('mouseup', handleMouseUp);
    },
    [onStepEntered]
  );

  return (
    <TableComponent
      onMouseDown={isDisabled ? undefined : handleMouseDown}
      onTouchStart={isDisabled ? undefined : handleTouchStart}
    >
      {table.map((line, rowIndex) =>
        line.map((cellValue, columnIndex) => (
          <Cell
            key={`${rowIndex}-${columnIndex}`}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
            isDimmed={isDisabled}
            value={cellValue}
          />
        ))
      )}
    </TableComponent>
  );
};

export default Table;
