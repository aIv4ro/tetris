import { boardHeight, boardWidth, shapes } from '../constants/constants'
import { type Shape, type Board, type Piece } from '../types/types'

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export const getRandomPiece = (): Piece => {
  const shape = rotateShape({
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    steps: getRandomInt(0, 4)
  })
  const x = getRandomInt(0, boardWidth - shape[0].length)
  return {
    x,
    y: 0,
    shape
  }
}

export const getInitialBoard = (): Board => {
  return Array(boardHeight)
    .fill(null)
    .map(() => Array(boardWidth).fill(0))
}

export function willCollide ({
  piece,
  board
}: {
  piece: Piece
  board: Board
}): boolean {
  const { shape, x, y } = piece
  return shape.find((row, rowIndex) => {
    return row.find((cell, colIndex) => {
      const boardY = y + rowIndex
      const boardX = x + colIndex
      return boardY < 0 || boardY > boardHeight - 1 || boardX < 0 || boardX > boardWidth - 1 ||
        (cell !== 0 && board[boardY]?.[boardX] === 1)
    }) != null
  }) != null
}

export function updatePieceInBoard ({
  piece, board
}: {
  piece: Piece
  board: Board
}): Board {
  const { x, y, shape } = piece
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1) {
        const boardX = x + colIndex
        const boardY = y + rowIndex
        board[boardY][boardX] = 2
      }
    })
  })
  return board
}

export function solidifyPiece ({
  board
}: {
  board: Board
}): Board {
  board.forEach(row => {
    row.forEach((cell, x) => {
      if (cell === 2) row[x] = 1
    })
  })
  return board
}

export function rotateShape ({
  shape,
  steps
}: { shape: Shape, steps: number }): Shape {
  let result = shape
  for (let i = 0; i < steps; i++) result = shape[0].map((_, index) => shape.map(row => row[index]).reverse())
  return result
}
