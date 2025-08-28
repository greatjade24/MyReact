import { createContext, useContext, useState } from "react"

const ThemeContext = createContext("light")

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light")

  const handleToggle = () => {
    setTheme((pre) => (pre === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, onToggle: handleToggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const ThemeComponent = () => {
  const { theme, onToggle } = useContext(ThemeContext)

  return (
    <div
      style={{
        background: theme === "light" ? "#fff" : "#333",
        color: theme === "light" ? "#000" : "#fff",
      }}
    >
        <h1>Theme: {theme}</h1>
        <button onClick={onToggle}>Toggle</button>
    </div>
  )
}
