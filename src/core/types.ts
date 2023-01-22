export type GameTable = number[][];
export type Step = number[][];
export type Solutions = { [key in number]: number };

export enum GameState {
  InProgress,
  GameOver,
  Won,
}
