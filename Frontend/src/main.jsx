import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './pages/Auth/context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from "axios";

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider client_id="YOUR_ID">
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
