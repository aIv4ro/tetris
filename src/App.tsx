import './App.css'
import { boardWidth, boardHeight } from './constants/constants'
import { useTetris } from './hooks/useTetris'

function App () {
  const {
    board,
    score,
    level,
    state,
    restartGame,
    togglePause
  } = useTetris()

  return (
    <>
      <main className='h-screen grid place-content-center'>
        <div className='flex gap-5'>
          <div className='flex-col'>
            <header className='flex flex-col'>
              <h1 className='text-xl text-center font-semibold'>Tetris</h1>
              <button onClick={togglePause}>
                {state === 'playing' ? 'Stop' : 'Resume'}
              </button>
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
          <div className='flex flex-col px-5'>
            <h4 className='text-lg font-semibold'>Score: {score}</h4>
            <h4 className='text-lg font-semibold'>Level: {level}</h4>
          </div>
        </div>
      </main>
      {state === 'over' && <div className='absolute inset-0 grid place-content-center bg-zinc-800/70'>
        <h4 className='text-lg text-center font-semibold'>Game over</h4>
        <button onClick={restartGame} className='px-3 bg-slate-200 rounded'>Restart game</button>
      </div>}
      {state === 'not-started' && <div className='absolute inset-0 grid place-content-center bg-zinc-800/70'>
        <h4 className='text-lg text-center font-semibold'>Welcome to the tetris</h4>
        <button onClick={restartGame} className='px-3 bg-slate-200 rounded'>Start game</button>
      </div>}
    </>
  )
}

export default App
