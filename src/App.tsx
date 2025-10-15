import { Header } from './components/header'
import { Footer } from './components/footer'
import SwapPage from './routes/quick-swap'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SwapPage />
      <Footer />
    </div>
  )
}

export default App
