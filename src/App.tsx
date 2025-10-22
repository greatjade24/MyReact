import Layout from "./components/Layout"
import Title from "./components/Title"
import Controls from "./components/Controls"
import TodoList from "./components/TodoList"
import { useRef, useState } from "react"

function App() {
  const idRef = useRef(0)
  const [list, setList] = useState([])
  const handleSubmit = (value: string) => {
    setList((prevList: any) =>
      prevList.concat({
        id: (idRef.current += 1),
        text: value,
        completed: false,
      })
    )
  }

  const handleToggle = (id: string) => {
    setList((prevList: any) =>
      prevList.map((item: any) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed }
        }

        return item
      })
    )
  }

  return (
    <div>
      <Layout>
        <Title />
        <Controls onSubmit={handleSubmit} />
        <TodoList data={list} onToggle={handleToggle} />
      </Layout>
    </div>
  )
}

export default App
