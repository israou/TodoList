// ============================================================
// SERVER.JS : Point d'entrée de l'application
// ============================================================
// RÔLE : C'est le PREMIER fichier exécuté quand tu fais "npm run dev"
//
// Il fait 2 choses dans l'ordre :
// 1. Se connecter à MongoDB
// 2. Lancer le serveur Express
//
// Si MongoDB n'est pas accessible → le serveur ne démarre pas
// ============================================================

const mongoose = require('mongoose'); //mangoose est la bibliothèque qui fait le pont entre ton code JS et MongoDB
const app = require('./app'); //importe l'app Express configurée dans app.js middlewares, routes, etc.)

const PORT = 3002; //Le port sur lequel le serveur écoute
// Le frontend enverra ses requêtes à http://localhost:3002

const MONGODB_URI = 'mongodb://localhost:27017/todo_app';
// ↑ L'adresse de ta base de données MongoDB
// mongodb://     → le protocole (comme http://)
// localhost      → sur ta machine
// :27017         → le port par défaut de MongoDB
// /todo_app      → le NOM de la base de données (créée automatiquement)

async function startServer() {
	try {
		// ÉTAPE 1 : Connexion à MongoDB
		// mongoose.connect() essaie de se connecter à la base
		// await = on attend que la connexion soit établie avant de continuer
		await mongoose.connect(MONGODB_URI);
		console.log('✅ [DB] Connecté à MongoDB');

		// ÉTAPE 2 : Lancer le serveur Express
		// app.listen() démarre le serveur sur le port 3002
		// Il attend maintenant les requêtes HTTP
		app.listen(PORT, () => {
			console.log(`✅ [Server] Serveur lancé sur http://localhost:${PORT}`);
			console.log('');
			console.log('   Routes disponibles :');
			console.log('   GET    http://localhost:3002/api/tasks        → Liste les tâches');
			console.log('   POST   http://localhost:3002/api/tasks        → Crée une tâche');
			console.log('   PUT    http://localhost:3002/api/tasks/:id    → Modifie une tâche');
			console.log('   DELETE http://localhost:3002/api/tasks/:id    → Supprime une tâche');
			console.log('   GET    http://localhost:3002/health           → Vérifie le serveur');
			console.log('');
			console.log('   💡 Teste avec : curl http://localhost:3002/health');
		});

	} catch (error) {
		console.error('❌ [Server] Impossible de démarrer:', error.message);
		console.error('');
		console.error('   Vérifie que MongoDB est lancé :');
		console.error('   → mongod (si installé localement)');
		console.error('   → ou Docker : docker run -d -p 27017:27017 mongo');
		process.exit(1);
		// ↑ Arrête le programme avec code d'erreur 1
	}
}

startServer();
