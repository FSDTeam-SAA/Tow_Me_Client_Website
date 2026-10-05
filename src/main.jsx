import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TermsPage from './TermsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/terms-of-use' ? <TermsPage /> : <App />}
  </StrictMode>,
)
