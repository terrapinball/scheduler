import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { DarkModeProvider } from './components/DarkModeProvider'

function App() {
 return (
  <DarkModeProvider>
    <BrowserRouter>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </BrowserRouter>
   </DarkModeProvider>
 )
}

export default App