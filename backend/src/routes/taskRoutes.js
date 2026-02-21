// ============================================================
// ROUTES : taskRoutes.js
// ============================================================
// RÔLE : L'AIGUILLAGE - connecter les URLs aux controllers
//
// Ce fichier est très court, c'est normal.
// Il dit juste : "quand telle URL est appelée, exécute telle fonction"
//
// Dans app.js on a : app.use('/api/tasks', taskRoutes)
// Donc ici '/' veut dire '/api/tasks'
// Et '/:id' veut dire '/api/tasks/un-id-quelconque'
// ============================================================

const express = require('express');
const router = express.Router();
// ↑ express.Router() crée un mini-app avec ses propres routes
//   C'est pour organiser les routes par fichier

// On importe les fonctions du controller
const {
	getAllTasks,
	createTask,
	updateTask,
	deleteTask
} = require('../controllers/taskController');

// Chaque ligne connecte : MÉTHODE HTTP + URL → FONCTION
router.get('/', getAllTasks);         // GET    /api/tasks         → liste toutes les tâches
router.post('/', createTask);        // POST   /api/tasks         → crée une tâche
router.put('/:id', updateTask);      // PUT    /api/tasks/:id     → modifie une tâche
router.delete('/:id', deleteTask);   // DELETE /api/tasks/:id     → supprime une tâche

// /:id est un PARAMÈTRE DYNAMIQUE
// Si l'URL est /api/tasks/abc123 → req.params.id vaut "abc123"
// Si l'URL est /api/tasks/xyz789 → req.params.id vaut "xyz789"

module.exports = router;
