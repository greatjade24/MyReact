
import Container from "./Container"
import Destination from "./Destination"
import Fruits from "./Fruits"
import Item from "./Item"
import Mailbox from "./Mailbox"

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
  const fruits = ['바나나', '사과']
  return (
    <div>
      <Item isDone={true} />
      <Item isDone={false} />
      <Mailbox unreadMessage={['hi']} />
      <Mailbox unreadMessage={[]} />
      {fruits.length > 0 && <Fruits fruits={fruits} />}
    </div>
  )
}

export default App