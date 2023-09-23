import './App.css'
import { boardWidth, boardHeight } from './constants/constants'
import { useTetris } from './hooks/useTetris'

function App () {
  const { board, isOver, restartGame } = useTetris()
  console.log('render')
  function handleRestartGame (): void {
    restartGame()
  }

  return (
    <div className='h-screen grid place-content-center'>
      <header className='flex flex-col'>
        <h1 className='text-xl text-center font-semibold'>Tetris</h1>
        {isOver == null && <>
          <h4 className='text-lg text-center'>Game over</h4>
          <button onClick={handleRestartGame} className='px-3 bg-slate-200 rounded'>Restart game</button>
        </>}
      </header>
      <div className='grid mt-3' style={{
        gridTemplateRows: `repeat(${boardHeight}, 22px)`,
        gridTemplateColumns: `repeat(${boardWidth}, 22px)`
      }}>
        {board.map((row, y) => {
          return row.map((cell, x) => {
            return (
              <div
                key={`${y}-${x}`}
                className={`w-[22px] h-[22px] border ${cell === 0 ? '' : cell === 1 ? 'bg-blue-300' : 'bg-yellow-300'}`}
              />
            )
          })
        })}
      </div>
    </div>
  )
}

export default App
