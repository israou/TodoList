import { StrictMode } from 'react' //ajouter des verifications strict en dev
import { createRoot } from 'react-dom/client'//c est la fonction qui connecte React au HTML, React crée les éléments, React DOM les affiche dans le navigateur
import './index.css'
import App from './App.jsx' //mon component principal

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// document.getElementById('root') cherche dans le fichier index.html un élément <div id="root"></div>.
// createRoot() dit à React "c'est ici que tu vas afficher tout".


// .render() affiche le contenu dans le root.
// Il rend <App /> (ta todo list) enveloppé dans <StrictMode> (les vérifications dev).