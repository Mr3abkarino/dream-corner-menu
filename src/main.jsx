import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ربط تطبيق ريأكت بالعنصر ذو المعرف 'root' الموجود في ملف index.html وإطلاقه
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
