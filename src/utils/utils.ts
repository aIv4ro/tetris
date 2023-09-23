import { boardHeight, boardWidth, shapes } from '../constants/constants'
import { type Board, type Piece } from '../types/types'

export const getRandomPiece = (): Piece => {
  return {
    x: Math.floor(boardWidth / 2),
    y: 0,
    shape: shapes[Math.floor(Math.random() * shapes.length)]
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
