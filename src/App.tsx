import { useRef, useState } from "react"

function FocusInput() {
  const inputRef = useRef(null)

  const handleClick = () => {
    inputRef.current.focus()
  }
  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>Focus</button>
    </div>
  )
}

function App() {
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)

  const handleStart = () => {
    if (timerRef.current) return

    timerRef.current = setInterval(() => {
      setSeconds((pre) => pre + 1)
    }, 1000)
  }
  const handleEnd = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
  }
  return (
    <div>
      {/* <h1>Timer: {seconds}</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleEnd}>End</button> */}
      <FocusInput />
    </div>
  )
}

export default App
