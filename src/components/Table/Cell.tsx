import styled from 'styled-components';

interface CellProps {
  rowIndex: number;
  columnIndex: number;
  value: number;
  isDimmed: boolean;
}

interface StyledCellProps {
  isDimmed: boolean;
}

const StyledCell = styled.div<StyledCellProps>`
  border: 1px gray solid;
  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
  cursor: pointer;

  opacity: ${({ isDimmed }) => (isDimmed ? 0.3 : 1)};
`;

export const Cell = ({ rowIndex, columnIndex, value, isDimmed }: CellProps) => {
  return (
    <StyledCell
      id={`${rowIndex}-${columnIndex}`}
      key={`${rowIndex}-${columnIndex}`}
      data-cell={true}
      isDimmed={isDimmed}
    >
      <div>{value}</div>
    </StyledCell>
  );
};
