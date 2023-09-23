import { useCallback, useEffect, useState } from 'react'
import { type Board, type Move, type Piece } from '../types/types'
import { getInitialBoard, getRandomPiece, updatePieceInBoard, willCollide } from '../utils/utils'
import { boardWidth } from '../constants/constants'

const initialPiece = getRandomPiece()
const initialBoard = getInitialBoard()

export function useTetris () {
  const [board, setBoard] = useState(initialBoard)
  const [piece, setPiece] = useState<Piece | null>(initialPiece)

  const move = useCallback((move: Move) => {
    if (piece == null) return
    const { dir } = move
    const multiplier = dir === 'left' ? -1 : 1
    let newPiece: Piece
    if (dir === 'rotate') {
      const newShape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index]).reverse())
      newPiece = {
        ...piece,
        shape: newShape
      }
    } else {
      newPiece = {
        ...piece,
        x: dir === 'left' || dir === 'right' ? piece.x + move.steps * multiplier : piece.x,
        y: dir === 'down' ? piece.y + move.steps * multiplier : piece.y
      }
    }
    if (willCollide({ piece: newPiece, board })) {
      if (dir === 'down') {
        const newBoard: Board = board.map(row => row.map(cell => cell === 2 ? 1 : cell))
        for (let i = 0; i < newBoard.length; i++) {
          const row = newBoard[i]
          if (row.every(cell => cell === 1)) {
            newBoard.splice(i, 1)
            newBoard.unshift(Array(boardWidth).fill(0))
          }
        }
        const nextPiece = getRandomPiece()
        if (willCollide({ piece: nextPiece, board })) {
          // gameOver
          setPiece(null)
        } else {
          const nextPiece = getRandomPiece()
          setPiece(nextPiece)
          updatePieceInBoard({ piece: nextPiece, board: newBoard })
        }
        setBoard(newBoard)
      }
    } else {
      setPiece(newPiece)
      setBoard(prev => {
        const boardCopy: Board = prev.map(row => row.map(cell => cell === 2 ? 0 : cell))
        return updatePieceInBoard({ piece: newPiece, board: boardCopy })
      })
    }
  }, [piece, board])

  useEffect(() => {
    function onTick () {
      move({ dir: 'down', steps: 1 })
    }
    function handleKeyDown (e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') move({ dir: 'left', steps: 1 })
      if (e.key === 'ArrowRight') move({ dir: 'right', steps: 1 })
      if (e.key === 'ArrowDown') move({ dir: 'down', steps: 1 })
      if (e.key === 'ArrowUp') move({ dir: 'rotate' })
    }
    const tickId = setInterval(onTick, 1000)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearInterval(tickId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [move])

  function restartGame () {
    setBoard(getInitialBoard())
    setPiece(getRandomPiece())
  }

  return { board, isOver: piece == null, restartGame }
}
