import styles from './Cell.module.css';

interface CellProps {
  rowIndex: number;
  columnIndex: number;
  value: number;
  isDimmed: boolean;
}

const Cell = ({ rowIndex, columnIndex, value, isDimmed }: CellProps) => {
  return (
    <div
      id={`${rowIndex}-${columnIndex}`}
      key={`${rowIndex}-${columnIndex}`}
      className={styles.cell}
      style={{ opacity: isDimmed ? 0.3 : 1 }}
      data-cell={true}
    >
      <div>{value}</div>
    </div>
  );
};

export default Cell;
