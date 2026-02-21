// ============================================================
// CONTROLLER : taskController.js
// ============================================================
// RÔLE : La LOGIQUE MÉTIER - que faire quand une requête arrive
//
// Chaque fonction ici :
// 1. Reçoit la requête du client (req)
// 2. Fait quelque chose avec la base de données (Mongoose)
// 3. Renvoie une réponse au client (res)
//
// Le pattern est TOUJOURS le même :
//   async (req, res) => {
//       try {
//           // faire le travail avec await
//           // renvoyer le résultat avec res.json()
//       } catch (error) {
//           // gérer l'erreur
//       }
//   }
// ============================================================

const Task = require('../models/Task');
// ↑ On importe le modèle Task pour interagir avec la collection "tasks" de MongoDB

// ============================================================
// GET /api/tasks → Récupérer TOUTES les tâches
// ============================================================
// Quand le frontend charge la page, il fait :
//   fetch('http://localhost:3001/api/tasks')
// Cette fonction est appelée et renvoie toutes les tâches
// ============================================================
const getAllTasks = async (req, res) => {
	try {
		// Task.find() → va dans MongoDB, collection "tasks", récupère tout
		// .sort({ createdAt: -1 }) → trie du plus récent au plus ancien
		const tasks = await Task.find().sort({ createdAt: -1 });

		// On renvoie un objet JSON avec status 200 (succès)
		// Le frontend recevra : { tasks: [ {_id: "...", title: "...", completed: false}, ... ] }
		res.status(200).json({ tasks });

	} catch (error) {
		// Si MongoDB plante ou erreur quelconque
		console.error('Erreur getAllTasks:', error.message);
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

// ============================================================
// POST /api/tasks → Créer UNE tâche
// ============================================================
// Le frontend envoie :
//   fetch('http://localhost:3001/api/tasks', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title: 'Ma tâche' })
//   })
//
// req.body contient : { title: 'Ma tâche' }
// ============================================================
const createTask = async (req, res) => {
	try {
		// req.body = ce que le frontend a envoyé dans le body
		// req.body.title = "Ma tâche"
		const { title } = req.body;
		//  ↑ C'est du destructuring, équivalent à : const title = req.body.title

		// Vérification basique
		if (!title || !title.trim()) {
			return res.status(400).json({ message: 'Le titre est requis' });
			// 400 = Bad Request (le client a envoyé des données invalides)
			// return pour ARRÊTER la fonction ici (sinon elle continue)
		}

		// Task.create() → crée un nouveau document dans MongoDB
		// Mongoose vérifie les règles du schema (required, maxlength...)
		// Si les règles ne sont pas respectées → erreur attrapée par catch
		const task = await Task.create({ title: title.trim() });

		// 201 = Created (ressource créée avec succès)
		res.status(201).json({ task });

	} catch (error) {
		console.error('Erreur createTask:', error.message);
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

// ============================================================
// PUT /api/tasks/:id → Modifier UNE tâche
// ============================================================
// Le frontend envoie :
//   fetch('http://localhost:3001/api/tasks/665abc123', {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ completed: true })
//   })
//
// req.params.id = "665abc123" (vient de l'URL)
// req.body = { completed: true } (vient du body)
// ============================================================
const updateTask = async (req, res) => {
	try {
		// req.params.id → l'ID dans l'URL après /api/tasks/
		// req.body → les champs à modifier
		// { new: true } → renvoie le document APRÈS modification (pas avant)
		// { runValidators: true } → vérifie les règles du schema même en update
		const task = await Task.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);

		// Si aucune tâche trouvée avec cet ID
		if (!task) {
			return res.status(404).json({ message: 'Tâche introuvable' });
			// 404 = Not Found
		}

		res.status(200).json({ task });

	} catch (error) {
		console.error('Erreur updateTask:', error.message);
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

// ============================================================
// DELETE /api/tasks/:id → Supprimer UNE tâche
// ============================================================
// Le frontend envoie :
//   fetch('http://localhost:3001/api/tasks/665abc123', {
//     method: 'DELETE'
//   })
//
// req.params.id = "665abc123"
// Pas de body nécessaire pour un DELETE
// ============================================================
const deleteTask = async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			return res.status(404).json({ message: 'Tâche introuvable' });
		}

		// On confirme la suppression
		res.status(200).json({ message: 'Tâche supprimée' });

	} catch (error) {
		console.error('Erreur deleteTask:', error.message);
		res.status(500).json({ message: 'Erreur serveur' });
	}
};

// On exporte toutes les fonctions pour les utiliser dans les routes
module.exports = { getAllTasks, createTask, updateTask, deleteTask };
