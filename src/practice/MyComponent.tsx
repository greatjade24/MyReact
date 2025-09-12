import { createContext, useContext } from "react"

const MyContext = createContext(null)

export const MyProvider = ({ children }) => {
  const value = { data: "hello world" }

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}

export const MyComponent = () => {
  const context = useContext(MyContext)

  return <div>{context.data}</div>
}
