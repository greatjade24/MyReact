// import Container from "./Container"
// import Destination from "./Destination"
// import Fruits from "./Fruits"
// import Item from "./Item"
// import Mailbox from "./Mailbox"
import { useState } from "react"
// import Alert from "./Alert"
// import Form from "./Form"
// import Propagation from "./Propagation"
// import List, { FilteredList } from "./List"

// function HelloWorld() {
//   return (
//     <>
//       <h1>Hello world!</h1>
//     </>
//   )
// }

// function Message() {
//   const name = "Taemin"
//   return <h1>Hello {name}</h1>
// }

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      State: {count}
      <button
        onClick={() => {
          // setCount((pre) => pre + 1)
          // setCount((pre) => pre + 1)
          // setCount((pre) => pre + 1)
          setCount(count + 1)
          setTimeout(() => {
            // 0, State는 Snapshot처럼 동작하기 때문
            alert(count)
          }, 1000)
        }}
      >
        Update
      </button>
    </div>
  )
}

function App() {
  // const destination = [
  //   {
  //     place: '강릉',
  //     description: '재밌었던 여행'
  //   }
  // ]
  // const fruits = ['바나나', '사과']
  const [count, setCount] = useState(0)
  const handleUpdate = () => {
    setCount(count + 1)
  }
  return (
    <div>
      State: {count}
      <button onClick={handleUpdate}>Update</button>
    </div>
  )
}

export default App
