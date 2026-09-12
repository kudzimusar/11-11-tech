import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const location = window.location
if (location.search[1] === '/') {
  const decodedRoute = location.search
    .slice(1)
    .split('&')
    .map((segment) => segment.replace(/~and~/g, '&'))
    .join('?')
  window.history.replaceState(null, '', `${location.pathname.slice(0, -1)}${decodedRoute}${location.hash}`)
}

document.documentElement.classList.add('js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // The website remains fully functional if PWA registration is unavailable.
    })
  })
}
