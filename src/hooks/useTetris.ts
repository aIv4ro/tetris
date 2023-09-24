import { useCallback, useEffect, useRef, useState } from 'react'
import { type Board, type Move, type Piece } from '../types/types'
import { getInitialBoard, getRandomPiece, solidifyPiece, updatePieceInBoard, willCollide } from '../utils/utils'
import { boardWidth } from '../constants/constants'

const initialPiece = getRandomPiece()
const initialBoard = getInitialBoard()

export function useTetris () {
  const [board, setBoard] = useState(initialBoard)
  const [isPaused, setIsPaused] = useState(true)
  const [piece, setPiece] = useState<Piece | null>(initialPiece)
  const [score, setScore] = useState(0)
  const moveCbRef = useRef<((move: Move) => void) | null>(null)
  const level = Math.max(1, Math.floor(score / (40 * 4)))
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
        const newBoard: Board = board.map(row => row.map(cell => cell))
        solidifyPiece({ board: newBoard })
        let deletedRows = 0
        for (let i = 0; i < newBoard.length; i++) {
          const row = newBoard[i]
          if (row.every(cell => cell === 1)) {
            deletedRows++
            newBoard.splice(i, 1)
            newBoard.unshift(Array(boardWidth).fill(0))
          }
        }
        setScore(prev => prev + deletedRows * 40)
        const nextPiece = getRandomPiece()
        updatePieceInBoard({ piece: nextPiece, board: newBoard })
        if (willCollide({ piece: nextPiece, board })) {
        // gameOver
          solidifyPiece({ board: newBoard })
          setPiece(null)
        } else {
          setPiece(nextPiece)
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

  moveCbRef.current = move

  useEffect(() => {
    if (isPaused) return
    function onTick () {
      moveCbRef.current?.({ dir: 'down', steps: 1 })
    }
    function handleKeyDown (e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') moveCbRef.current?.({ dir: 'left', steps: 1 })
      if (e.key === 'ArrowRight') moveCbRef.current?.({ dir: 'right', steps: 1 })
      if (e.key === 'ArrowDown') moveCbRef.current?.({ dir: 'down', steps: 1 })
      if (e.key === 'ArrowUp') moveCbRef.current?.({ dir: 'rotate' })
    }
    const tickId = setInterval(onTick, 1000 / level)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearInterval(tickId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [level, isPaused])

  function restartGame () {
    setBoard(getInitialBoard())
    setPiece(getRandomPiece())
  }

  function toggleIsPaused () {
    setIsPaused(prev => !prev)
  }

  return { board, isOver: piece == null, score, level, isPaused, restartGame, toggleIsPaused }
}
