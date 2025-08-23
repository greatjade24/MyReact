// import Container from "./Container"
// import Destination from "./Destination"
// import Fruits from "./Fruits"
// import Item from "./Item"
// import Mailbox from "./Mailbox"
import Alert from "./Alert"
import Form from "./Form"
import Propagation from "./Propagation"
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

function App() {
  // const destination = [
  //   {
  //     place: '강릉',
  //     description: '재밌었던 여행'
  //   }
  // ]
  // const fruits = ['바나나', '사과']
  return (
    <div>
      {/* SyntheticEvent */}
      <Alert onAlert={() => alert("world")} />
      <Form />
      <Propagation />
    </div>
  )
}

export default App
