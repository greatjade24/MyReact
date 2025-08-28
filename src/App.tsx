import { MyComponent, MyProvider } from "./MyComponent"
import { ThemeComponent, ThemeProvider } from "./Theme"

function App() {
  return (
    <div>
      <ThemeProvider>
        <ThemeComponent />
      </ThemeProvider>
    </div>
  )
}

export default App
