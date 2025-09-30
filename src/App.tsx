import Layout from "./components/Layout"
import Title from "./components/Title"
import Controls from "./components/Controls"
import TodoList from "./components/TodoList"
import { useState } from "react"

function App() {
  const [list, setList] = useState([{
    id: 1,
    text: 'hello',
    completed: false,
  }])
  return (
    <div>
      <Layout>
        <Title />
        <Controls />
        <TodoList data={list} />
      </Layout>
    </div>
  )
}

export default App
