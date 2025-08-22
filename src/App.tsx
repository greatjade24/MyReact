function HelloWorld() {
  return (
    <>
      <h1>Hello world!</h1>
    </>
  )
}

function Message() {
  const name = "Taemin"
  return <h1>Hello {name}</h1>
}

function App() {
  return (
    <div>
      <HelloWorld />
      <Message />
    </div>
  )
}

export default App