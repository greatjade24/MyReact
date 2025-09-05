import { useEffect, useState } from "react"

function Basic() {
  useEffect(() => {
    console.log("mount")
  }, [])
  return <div>Hello World</div>
}

function Update() {
  const [state, setState] = useState(0)
  // 추적 대상으로 인해 리렌더링이 유발될 때
  useEffect(() => {
    console.log("update", state)
  }, state)

  return (
    <div>
      <h1>state: {state}</h1>
      <button onClick={() => setState((pre) => pre + 1)}>Click</button>
    </div>
  )
}

function CleanUp() {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds((pre) => pre + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])
  return <div>Seconds: {seconds}</div>
}

function App() {
  const [isShow, setIsShow] = useState(false)
  return (
    <div>
      <Basic />
      {isShow && <CleanUp />}
      <button onClick={() => setIsShow((pre) => !pre)}></button>
    </div>
  )
}

export default App
