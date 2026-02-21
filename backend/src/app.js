// ============================================================
// APP.JS : Configuration Express
// ============================================================
// RÔLE : Assembler tous les morceaux ensemble
//
// C'est ici que tu :
// 1. Crées l'app Express
// 2. Ajoutes les middlewares (fonctions qui s'exécutent AVANT les routes)
// 3. Connectes les routes
// 4. Gères les erreurs
// ============================================================

const express = require('express');
const cors = require('cors'); //CORS (pour autoriser le frontend à communiquer)

const app = express();
// ↑ Crée une application Express (ton serveur web)

// ============================================================
// MIDDLEWARES
// ============================================================
// Les middlewares sont des fonctions qui s'exécutent dans l'ORDRE
// sur CHAQUE requête, AVANT d'arriver à ta route.
//
// Requête → cors() → express.json() → ta route
// ============================================================

app.use(cors());
// ↑ CORS = Cross-Origin Resource Sharing
// Sans ça, le navigateur BLOQUE les requêtes du frontend (port 5173)
// vers le backend (port 3001) car ce sont des "origines" différentes.
// cors() dit au navigateur "c'est ok, j'autorise"

app.use(express.json());
// ↑ Quand le frontend envoie du JSON dans le body (POST, PUT),
// ce middleware le transforme en objet JavaScript.
// Sans ça, req.body serait undefined.
//
// Avant : req.body = undefined
// Après : req.body = { title: "Ma tâche" }

// ============================================================
// ROUTES
// ============================================================

app.use('/api/tasks', require('./routes/taskRoutes'));
// ↑ Toutes les requêtes qui commencent par /api/tasks
//   sont envoyées vers taskRoutes.js
//
// Exemples :
//   GET /api/tasks       → taskRoutes → getAllTasks
//   POST /api/tasks      → taskRoutes → createTask
//   PUT /api/tasks/123   → taskRoutes → updateTask
//   DELETE /api/tasks/123 → taskRoutes → deleteTask

// Route de test pour vérifier que le serveur tourne
app.get('/health', (req, res) => {
	res.json({ status: 'ok', message: 'Le serveur fonctionne !' });
});

// ============================================================
// 404 - Route inconnue
// ============================================================
// Si aucune route ne correspond, on arrive ici
// Par exemple : GET /api/blabla → 404
app.use((req, res) => {
	res.status(404).json({ message: `Route ${req.method} ${req.url} introuvable` });
});

module.exports = app;
