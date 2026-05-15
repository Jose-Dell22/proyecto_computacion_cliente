import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'
import 'semantic-ui-css/semantic.min.css';
import './styles.css';
import './animations.css';
import './config/i18n';

gsap.registerPlugin(ScrollTrigger);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
