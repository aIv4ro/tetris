export type Board = Array<Array<0 | 1 | 2>>
export type Shape = Array<Array<0 | 1>>
export type Move = { dir: 'rotate' } | { dir: 'left' | 'right' | 'down', steps: 1 }
export interface Piece { x: number, y: number, shape: Shape }
export type State = 'not-started' | 'playing' | 'pause' | 'over'
