import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from "react-router-dom"
import { CartCustomProvider } from './components/CartContext/CartContext'
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
<<<<<<< HEAD
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
=======
    <CartCustomProvider>
      <App />
    </CartCustomProvider>
>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f
  </BrowserRouter>
)