import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store, persist } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}>
      <PersistGate loading={null} persistor={persist}> 
        <ToastContainer/>      
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
