# 📝 Todo List - Fullstack Example

## Architecture

```
todo-fullstack/
├── backend/
│   ├── src/
│   │   ├── models/Task.js          ← Structure des données
│   │   ├── controllers/taskController.js  ← Logique métier
│   │   ├── routes/taskRoutes.js     ← Aiguillage URLs
│   │   ├── app.js                   ← Config Express
│   │   └── server.js                ← Point d'entrée
│   └── package.json
├── frontend/
│   └── TodoApp.jsx                  ← Interface React
└── README.md


## Comment une requête traverse l'app

                    FRONTEND                          BACKEND                         DATABASE
                ┌──────────────┐                ┌──────────────────┐              ┌──────────────┐
  Utilisateur   │              │   fetch(URL)   │                  │  Mongoose    │              │
  clique sur    │  TodoApp.jsx │ ────────────── │ server.js        │ ──────────── │   MongoDB    │
  "Ajouter"     │              │                │  └→ app.js       │              │              │
                │  addTask()   │                │     └→ routes    │              │  Collection  │
                │     ↓        │                │        └→ ctrl   │              │  "tasks"     │
                │  fetch POST  │  ← json ────── │           └→ res │ ← données ── │              │
                │     ↓        │                │                  │              │              │
                │  setTasks()  │                │                  │              │              │
                └──────────────┘                └──────────────────┘              └──────────────┘


## Lancer le projet pas à pas

### Prérequis
- Node.js installé (node -v pour vérifier)
- MongoDB installé OU Docker

### Étape 1 : Lancer MongoDB

Option A - MongoDB installé localement :
    mongod

Option B - Avec Docker (plus simple) :
    docker run -d -p 27017:27017 --name mongo-todo mongo

### Étape 2 : Lancer le backend

    cd backend
    npm install
    npm run dev

Tu dois voir :
    ✅ [DB] Connecté à MongoDB
    ✅ [Server] Serveur lancé sur http://localhost:3001

### Étape 3 : Tester le backend (sans frontend)

Ouvre un NOUVEAU terminal et teste avec curl :

Voir toutes les tâches (vide au début) :
    curl http://localhost:3001/api/tasks

Créer une tâche :
    curl -X POST http://localhost:3001/api/tasks -H "Content-Type: application/json" -d '{"title": "Ma première tâche"}'

Voir les tâches (il y en a une maintenant) :
    curl http://localhost:3001/api/tasks

### Étape 4 : Lancer le frontend

Le fichier TodoApp.jsx est un composant React.
Tu peux l'intégrer dans un projet Vite :

    npm create vite@latest frontend -- --template react
    cd frontend
    npm install

Puis remplace le contenu de src/App.jsx par le contenu de TodoApp.jsx.

    npm run dev

Ouvre http://localhost:5173 dans ton navigateur.


## Tester et expérimenter

Idées pour mieux comprendre :

1. Ajoute un console.log dans un controller pour voir req.body
2. Change le status code (201 → 200) et observe la différence
3. Ajoute un nouveau champ "priority" dans le model et le controller
4. Supprime cors() dans app.js et observe l'erreur dans le navigateur
5. Arrête MongoDB et observe l'erreur quand tu crées une tâche
------------------------------------------------------------

main.jsx → le point d'entrée. Il fait une seule chose : prendre ton composant App et l'afficher dans la page HTML. Tu n'as pas besoin de le modifier, c'est du code généré par Vite.
App.jsx → c'est là que tout se passe. C'est ton composant React qui contient les 4 opérations fetch vers le backend (GET, POST, PUT, DELETE) et l'interface.
--------------------------------------------------------------

fetch c'est la fonction du navigateur pour envoyer des requêtes HTTP. Ce qui change entre les 4 opérations c'est juste les options qu'on lui passe :
GET (lire) → fetch(url) — rien à ajouter, c'est le défaut.
POST (créer) → tu dois préciser 3 choses : method: "POST" pour dire que tu crées quelque chose, headers pour dire que tu envoies du JSON, et body pour envoyer les données.
PUT (modifier) → pareil que POST, mais avec method: "PUT" et l'ID dans l'URL pour dire quel élément modifier.
DELETE (supprimer) → juste method: "DELETE" et l'ID dans l'URL. Pas besoin de body, l'ID suffit.

Le cycle complet
Le frontend ne connaît rien de MongoDB, de Mongoose, des modèles. Il sait juste envoyer des requêtes à une URL et recevoir du JSON en retour. Ensuite il met à jour le state avec setTasks(...) et React re-affiche la page automatiquement.
Utilisateur clique "Ajouter"
    ↓
addTask() → fetch POST avec { title: "..." }
    ↓
Le backend reçoit, crée en base, renvoie la tâche
    ↓
setTasks([nouvelle tâche, ...anciennes])
    ↓
React re-rend → la tâche apparaît à l'écran

--------------------------------------------------------------
le backend c est 3 couches:
┌─────────────────────────────────────────────────────────┐
│                    LE BACKEND                            │
│                                                          │
│  📨 REQUÊTE DU FRONTEND (fetch POST /api/tasks)          │
│         ↓                                                │
│  ┌─────────────────────────────────────────────┐         │
│  │  1. ROUTES (l'aiguillage)                   │         │
│  │                                              │         │
│  │  "POST /api/tasks → va vers createTask"     │         │
│  │  "GET /api/tasks → va vers getAllTasks"      │         │
│  │                                              │         │
│  │  C'est un panneau de direction,              │         │
│  │  ça ne fait AUCUN travail                    │         │
│  └──────────────────┬──────────────────────────┘         │
│                     ↓                                    │
│  ┌─────────────────────────────────────────────┐         │
│  │  2. CONTROLLERS (la logique)                │         │
│  │                                              │         │
│  │  createTask() {                              │         │
│  │    - récupère req.body.title                 │         │
│  │    - demande au Model de créer en base       │         │
│  │    - renvoie la réponse au frontend          │         │
│  │  }                                           │         │
│  │                                              │         │
│  │  C'est le CERVEAU, il décide quoi faire      │         │
│  └──────────────────┬──────────────────────────┘         │
│                     ↓                                    │
│  ┌─────────────────────────────────────────────┐         │
│  │  3. MODELS (la structure des données)       │         │
│  │                                              │         │
│  │  Task = {                                    │         │
│  │    title: String (obligatoire, max 100)      │         │
│  │    completed: Boolean (défaut: false)        │         │
│  │  }                                           │         │
│  │                                              │         │
│  │  C'est le FORMULAIRE qui définit les règles  │         │
│  └──────────────────┬──────────────────────────┘         │
│                     ↓                                    │
│              ┌──────────────┐                            │
│              │   MongoDB    │                            │
│              │  (la base    │                            │
│              │  de données) │                            │
│              └──────────────┘                            │
│                     ↓                                    │
│  📤 RÉPONSE AU FRONTEND (res.json({ task: {...} }))      │
└─────────────────────────────────────────────────────────┘

En plus des 3 dossiers (routes, controllers, models), tu as deux fichiers qui assemblent le tout :
server.js → le tout premier fichier exécuté. Il fait deux choses dans l'ordre : connecter MongoDB puis démarrer le serveur Express. C'est comme tourner la clé de contact d'une voiture.
app.js → la configuration d'Express. Il installe les middlewares (cors, json parser) et connecte les routes. C'est le moteur de la voiture.

Tu tapes "npm run dev"
    ↓
server.js démarre
    ↓
Se connecte à MongoDB (mongoose.connect)
    ↓
Lance app.js (app.listen)
    ↓
app.js charge les middlewares (cors, express.json)
    ↓
app.js charge les routes (app.use('/api/tasks', taskRoutes))
    ↓
Le serveur attend les requêtes du frontend

Où est MongoDB ?
MongoDB tourne dans le conteneur Docker vyre-user-mongodb-1 que tu as vu tout à l'heure. C'est un programme séparé qui écoute sur le port 27017. Ton backend s'y connecte avec l'adresse mongodb://localhost:27017/todo_app. MongoDB stocke les données sur le disque dur à l'intérieur du conteneur Docker. Quand ton backend fait Task.create(...), Mongoose envoie la commande à MongoDB via cette connexion, et MongoDB sauvegarde le document
Backend (port 3002) ──connexion──→ MongoDB (port 27017)
       ↑                                   ↑
   ton code JS                     conteneur Docker
   (Express + Mongoose)            (stocke les données)

&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
&
    req c'est l'objet requête. Il contient tout ce que le frontend t'a envoyé.
    req c'est une enveloppe
    Quand le frontend fait un fetch, il envoie une "enveloppe" au backend. Cette enveloppe c'est req. Elle contient trois poches :
    req.body → le contenu de l'enveloppe (les données envoyées dans le body)
    Frontend envoie : body: JSON.stringify({ title: "Ma tâche" })
    Backend reçoit : req.body = { title: "Ma tâche" }
    Backend lit :    req.body.title = "Ma tâche"
    req.params → ce qui est dans l'URL après les deux points
    Frontend envoie : fetch("http://localhost:3002/api/tasks/abc123")
    Route définie :   router.put('/:id', updateTask)
    Backend reçoit :  req.params.id = "abc123"
    req.query → ce qui est après le ? dans l'URL
    Frontend envoie : fetch("http://localhost:3002/api/tasks?page=2&limit=10")
    Backend reçoit :  req.query.page = "2"
                    req.query.limit = "10"
    Et res ?
    res c'est la réponse. C'est l'enveloppe que tu renvoies au frontend :
    jsres.status(200).json({ task: task })
    //  ↑              ↑
    //  code status    les données renvoyées en JSON
    En résumé
    Chaque fonction controller reçoit deux choses : req (ce que le client t'envoie) et res (ce que tu lui réponds). C'est toujours (req, res) → lis dans req, écris dans res.
&
&
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



node.js c'est un environnement

je le télécharges, je l'installes, c'est un programme sur ma machine. Comme Python. je ne codes pas Node.js, je code avec Node.js. Il me fournit un environnement pour exécuter du JavaScript en dehors du navigateur.

Mais cet environnement a des caractéristiques
Et ces caractéristiques impactent directement comment je code. C'est là que les concepts rentrent en jeu.
Single thread : Node.js utilise un seul fil d'exécution. Si je fais une opération qui bloque (lire la base de données, lire un fichier), tout le serveur attend et personne d'autre ne peut être servi.
Non bloquant : Pour résoudre ce problème, Node.js dit "lance l'opération, je te préviendrai quand c'est fini, en attendant je gère les autres requêtes". C'est de là que viennent async/await et les Promises — ce ne sont pas des choix de style, c'est la conséquence directe de comment Node.js fonctionne.

// Si Node.js était bloquant (ce n'est PAS le cas)
const user = db.findUser(id);     // Tout le serveur attend 200ms
res.json(user);                    // Personne d'autre n'est servi pendant ce temps

// Comment Node.js fonctionne réellement
const user = await db.findUser(id); // Lance la requête, libère le thread
res.json(user);                     // Reprend quand le résultat arrive

Analogie
Imagine un serveur de restaurant avec un seul serveur (single thread). Deux approches possibles : le serveur bloquant prend la commande de la table 1, va en cuisine, attend devant la cuisine que le plat soit prêt, le ramène, puis seulement là s'occupe de la table 2. Le serveur non bloquant (Node.js) prend la commande de la table 1, la donne en cuisine, va immédiatement prendre la commande de la table 2, puis récupère les plats quand ils sont prêts.
await c'est le moment où le serveur dit "je reviendrai chercher ce plat quand il sera prêt".

Event loop → Node.js / JavaScript (runtime)
Virtual DOM → React (librairie frontend, rien à voir avec Node.js)
JIT compilation → V8 (le moteur qui compile JS en code machine)

EVENT LOOP: C'est une boucle infinie qui tourne et fait une seule chose : vérifier s'il y a du travail à faire.
        ┌──────────────────────────┐
        │    Code synchrone        │  ← exécuté en premier
        │    console.log('a')      │
        └──────────┬───────────────┘
                   ↓
        ┌──────────────────────────┐
        │    File d'attente        │  ← les callbacks/await qui
        │    (callback queue)      │    sont prêts à être exécutés
        └──────────┬───────────────┘
                   ↓
        ┌──────────────────────────┐
        │    Event Loop vérifie :  │
        │    "il y a du travail ?" │──→ oui → exécute → revérifie
        │                          │──→ non → attend
        └──────────────────────────┘
console.log('1');                          // Exécuté immédiatement

await User.findById(id);                   // Envoyé à MongoDB, 
                                           // Event Loop passe à autre chose

console.log('2');                          // Exécuté quand MongoDB répond

Pendant que MongoDB cherche le user, l'event loop peut traiter d'autres requêtes HTTP entrantes. C'est ça qui rend Node.js performant avec un seul thread.
Pourquoi c'est rapide
Ce n'est pas l'event loop seul qui rend JS rapide. C'est la combinaison de V8 qui compile efficacement le code via JIT, l'event loop qui ne bloque jamais sur les opérations lentes, et libuv (une lib C++ dans Node.js) qui délègue les opérations lourdes (fichiers, réseau, DNS) à des threads séparés en arrière-plan.
-------------------------------

Mangodb est un systeme de gestion de données orienté document SGBD->logiciel ou service qui gere les donées.

-------------------------------------------
App.jsx (fetch) -> routes -> controller -> model -> MongoDB -> controller -> réponse JSON -> App.jsx (state update).
