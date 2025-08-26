/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer, useState } from "react"

const initial = { count: 0 }

const reducer = (state: any, action: any) => {
  console.log('state: ', state);
  console.log('action: ', action);
  
  switch (action.type) {
    case "INCREASE": {
      return { count: state.count + 1 }
    }
    case "DECREASE": {
      return { count: state.count - 1 }
    }
    default:
      throw new Error("invalid type: " + action.type)
  }
}

function App() {
  // https://ko.react.dev/reference/react/useReducer#dispatch
  const [state, dispatch] = useReducer(reducer, initial)
  return <div>
    <h1>count: { state.count } { typeof dispatch }</h1>
    <button onClick={() => dispatch({ type: "INCREASE" })}>+</button>
    <button onClick={() => dispatch({ type: "DECREASE" })}>-</button>
  </div>
}

export default App
