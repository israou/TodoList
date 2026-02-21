// ============================================================
// FRONTEND : TodoApp.jsx
// ============================================================
// RÔLE : L'interface utilisateur qui COMMUNIQUE avec le backend
//
// Le frontend ne touche JAMAIS la base de données directement.
// Il envoie des requêtes HTTP (fetch) au backend,
// et le backend s'occupe de MongoDB.
//
// Frontend → fetch() → Backend → Mongoose → MongoDB
// Frontend ← json   ← Backend ← données  ← MongoDB
// ============================================================

import { useState, useEffect } from "react";

// L'adresse du backend - toutes les requêtes vont ici
const API_URL = "http://localhost:3001/api/tasks";

export default function TodoApp() {
  // ============================================================
  // STATE : Les données de l'application
  // ============================================================
  const [tasks, setTasks] = useState([]);       // La liste des tâches
  const [newTitle, setNewTitle] = useState("");  // Le texte de l'input
  const [loading, setLoading] = useState(true);  // Chargement en cours ?
  const [error, setError] = useState(null);      // Message d'erreur

  // ============================================================
  // CHARGEMENT INITIAL
  // ============================================================
  // useEffect avec [] → s'exécute UNE SEULE FOIS au chargement de la page
  // C'est ici qu'on récupère les tâches existantes
  useEffect(() => {
    fetchTasks();
  }, []);

  // ============================================================
  // FETCH : Récupérer toutes les tâches (GET)
  // ============================================================
  const fetchTasks = async () => {
    try {
      // fetch() sans options → fait un GET par défaut
      const response = await fetch(API_URL);
      // ↑ Envoie : GET http://localhost:3001/api/tasks
      //
      // PARCOURS DANS LE BACKEND :
      // 1. app.js → cors() → express.json()
      // 2. app.use('/api/tasks', taskRoutes)
      // 3. taskRoutes → router.get('/', getAllTasks)
      // 4. getAllTasks → Task.find() → MongoDB
      // 5. MongoDB renvoie les documents
      // 6. getAllTasks → res.json({ tasks: [...] })

      // response.json() transforme la réponse en objet JavaScript
      const data = await response.json();
      // data = { tasks: [ {_id: "...", title: "...", completed: false}, ... ] }

      setTasks(data.tasks);    // Met à jour la liste dans le state
      setLoading(false);       // Fin du chargement
    } catch (err) {
      setError("Impossible de charger les tâches. Le backend tourne ?");
      setLoading(false);
    }
  };

  // ============================================================
  // CREATE : Créer une nouvelle tâche (POST)
  // ============================================================
  const addTask = async () => {
    // Ne rien faire si l'input est vide
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        // ↑ On doit préciser POST car fetch fait GET par défaut

        headers: { "Content-Type": "application/json" },
        // ↑ On dit au backend : "je t'envoie du JSON"
        // Sans ça, express.json() ne sait pas parser le body

        body: JSON.stringify({ title: newTitle }),
        // ↑ Le body de la requête, converti en string JSON
        // JSON.stringify({ title: "Ma tâche" }) → '{"title":"Ma tâche"}'
        // Dans le backend : req.body.title = "Ma tâche"
      });
      // PARCOURS DANS LE BACKEND :
      // 1. express.json() parse le body → req.body = { title: "Ma tâche" }
      // 2. router.post('/', createTask)
      // 3. createTask → Task.create({ title: req.body.title })
      // 4. MongoDB crée le document
      // 5. createTask → res.status(201).json({ task: {...} })

      const data = await response.json();
      // data = { task: { _id: "new123", title: "Ma tâche", completed: false } }

      setTasks([data.task, ...tasks]);  // Ajoute en haut de la liste
      setNewTitle("");                   // Vide l'input
    } catch (err) {
      setError("Impossible de créer la tâche");
    }
  };

  // ============================================================
  // UPDATE : Cocher/décocher une tâche (PUT)
  // ============================================================
  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        // ↑ URL avec l'ID : http://localhost:3001/api/tasks/665abc123
        // Dans le backend : req.params.id = "665abc123"
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
        // ↑ Si la tâche était completed: false → on envoie completed: true
        //   Si la tâche était completed: true → on envoie completed: false
      });
      // PARCOURS DANS LE BACKEND :
      // 1. router.put('/:id', updateTask)
      // 2. req.params.id = "665abc123"
      // 3. req.body = { completed: true }
      // 4. Task.findByIdAndUpdate("665abc123", { completed: true }, { new: true })
      // 5. MongoDB modifie le document et renvoie la version mise à jour

      const data = await response.json();

      // On remplace l'ancienne tâche par la nouvelle dans le state
      setTasks(tasks.map((t) => (t._id === task._id ? data.task : t)));
    } catch (err) {
      setError("Impossible de modifier la tâche");
    }
  };

  // ============================================================
  // DELETE : Supprimer une tâche (DELETE)
  // ============================================================
  const removeTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        // Pas de body nécessaire pour un DELETE
        // L'ID dans l'URL suffit
      });
      // PARCOURS DANS LE BACKEND :
      // 1. router.delete('/:id', deleteTask)
      // 2. req.params.id = "665abc123"
      // 3. Task.findByIdAndDelete("665abc123")
      // 4. MongoDB supprime le document

      // On retire la tâche du state (sans recharger la page)
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError("Impossible de supprimer la tâche");
    }
  };

  // ============================================================
  // RENDER : L'interface
  // ============================================================
  if (loading) {
    return (
      <div style={styles.container}>
        <p>⏳ Chargement...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📝 Todo List</h1>
      <p style={styles.subtitle}>
        Frontend React ↔ Backend Express ↔ MongoDB
      </p>

      {/* Message d'erreur */}
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)} style={styles.dismissBtn}>
            ✕
          </button>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Nouvelle tâche..."
        />
        <button style={styles.addBtn} onClick={addTask}>
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      <div style={styles.list}>
        {tasks.length === 0 && (
          <p style={styles.empty}>Aucune tâche. Ajoutes-en une !</p>
        )}

        {tasks.map((task) => (
          <div key={task._id} style={styles.taskRow}>
            {/* Clic sur la tâche → toggle completed */}
            <div
              style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.5 : 1,
              }}
              onClick={() => toggleTask(task)}
            >
              {task.completed ? "✅" : "⬜"} {task.title}
            </div>

            {/* Bouton supprimer */}
            <button
              style={styles.deleteBtn}
              onClick={() => removeTask(task._id)}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Compteur */}
      <p style={styles.counter}>
        {tasks.filter((t) => !t.completed).length} tâche(s) restante(s) sur{" "}
        {tasks.length}
      </p>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    fontFamily: "system-ui, sans-serif",
    padding: 20,
  },
  title: { fontSize: 28, marginBottom: 4 },
  subtitle: { color: "#888", fontSize: 13, marginBottom: 24 },
  error: {
    color: "#e74c3c",
    background: "#fdecea",
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dismissBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#e74c3c",
  },
  form: { display: "flex", gap: 8, marginBottom: 20 },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: 15,
    border: "2px solid #e0e0e0",
    borderRadius: 8,
    outline: "none",
  },
  addBtn: {
    padding: "10px 20px",
    fontSize: 15,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: 6 },
  taskRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    background: "#f8f9fa",
    borderRadius: 8,
  },
  taskTitle: { cursor: "pointer", fontSize: 15, flex: 1 },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
  },
  empty: { textAlign: "center", color: "#aaa", padding: 20 },
  counter: { textAlign: "center", color: "#888", marginTop: 16, fontSize: 13 },
};
