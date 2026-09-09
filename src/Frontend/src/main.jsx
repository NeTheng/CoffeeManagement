import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx loaded');

const root = document.getElementById('root');
console.log('Root element:', root);

if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('React rendered successfully');
  } catch (e) {
    console.error('React render error:', e);
  }
} else {
  console.error('Root element not found');
}
