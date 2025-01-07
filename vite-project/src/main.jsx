import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/toaster"
import { ToastProvider } from "@/components/ui/toast";
import { SocketProvider } from "./context/SocketContext.jsx"

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <>
    <SocketProvider>    
      <ToastProvider>
        <App />
        <Toaster />
      </ToastProvider>
    </SocketProvider>  
    </>
  // </StrictMode>,
)
