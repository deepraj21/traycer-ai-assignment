import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme/theme-provider"
import Landing from "./pages/Landing"

const App = () => {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App