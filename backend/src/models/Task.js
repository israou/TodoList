// ============================================================
// MODEL : Task.js
// ============================================================
// RÔLE : Définir la STRUCTURE des données dans MongoDB
// 
// C'est comme un formulaire vide :
// - Tu définis les champs (title, completed)
// - Tu définis les règles (required, maxlength)
// - Mongoose s'assure que les données respectent ces règles
//
// MongoDB stocke des "documents" (comme des objets JSON)
// Mongoose ajoute une couche de validation par-dessus
// ============================================================

const mongoose = require('mongoose');

// Le SCHEMA = la structure/les règles de tes données
const taskSchema = new mongoose.Schema({

	// Champ "title" : le nom de la tâche
	title: {
		type: String,                              // Doit être du texte
		required: [true, 'Le titre est requis'],   // Obligatoire (sinon erreur)
		trim: true,                                // Supprime les espaces au début/fin
		maxlength: [100, 'Maximum 100 caractères'] // Pas plus de 100 caractères
	},

	// Champ "completed" : est-ce que la tâche est faite ?
	completed: {
		type: Boolean,    // true ou false
		default: false    // Par défaut : pas terminée
	}

	// timestamps: true (ci-dessous) ajoute automatiquement :
	// - createdAt : date de création
	// - updatedAt : date de dernière modification

}, { timestamps: true });

// mongoose.model('Task', taskSchema) fait 2 choses :
// 1. Crée une collection "tasks" dans MongoDB (nom au pluriel automatique)
// 2. Te donne un objet "Task" avec des méthodes : .find(), .create(), .findById()...
module.exports = mongoose.model('Task', taskSchema);
