import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Landing from "./pages/Landing"
import { useAuth } from "@/context/auth-context"
import Dashboard from "./pages/Dashboard"

const App = () => {
  const { user, loading } = useAuth()
  if (loading) return null
  return (
    <Router>
      <Toaster richColors />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App