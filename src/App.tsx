
import Container from "./Container"
import Destination from "./Destination"

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

function App() {
  const destination = [
    {
      place: '강릉',
      description: '재밌었던 여행'
    }
  ]
  return (
    <div className="container">
      <Container>여행 지역</Container>
      <Destination {...destination[0]} />
      <Destination />
    </div>
  )
}

export default App