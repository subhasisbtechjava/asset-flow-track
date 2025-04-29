
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom"
import App from './App.tsx'
import './index.css'

// Find and validate the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

// Create root and render app
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
