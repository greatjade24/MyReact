import Layout from "./components/Layout"
import Title from "./components/Title"
import Controls from "./components/Controls"
import TodoList from "./components/TodoList"
import { useRef, useState } from "react"

function App() {
  const idRef = useRef(0)
  const [list, setList] = useState([])
  const handleSubmit = (value: string) => {
    setList((prevList) =>
      prevList.concat({
        id: (idRef.current += 1),
        text: value,
        completed: false,
      })
    )
  }
  return (
    <div>
      <Layout>
        <Title />
        <Controls onSubmit={handleSubmit} />
        <TodoList data={list} />
      </Layout>
    </div>
  )
}

export default App
