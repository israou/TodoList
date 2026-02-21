import { useState, useEffect } from "react";

// URL de base du backend (toutes les requêtes CRUD partent ici)
const API_URL = "http://localhost:3002/api/tasks";

export default function TodoApp() {
  // Détermine le thème initial:
  // 1) priorité à la valeur sauvegardée dans localStorage
  // 2) sinon, utilise la préférence système (dark/light)
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // useState crée des états réactifs:
  // quand on met à jour un state, React re-render automatiquement le composant.
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);

  // useEffect avec [] s'exécute UNE seule fois au montage du composant.
  // Ici, il sert à charger les tâches dès l'ouverture de la page.
  useEffect(() => {
    fetchTasks();
  }, []);

  // Ce useEffect s'exécute à chaque changement de "theme".
  // Il synchronise le thème dans:
  // - l'attribut HTML data-theme (pour le CSS)
  // - localStorage (pour conserver le choix après refresh)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // GET /api/tasks
  // Récupère toutes les tâches depuis le backend et les place dans tasks.
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data.tasks);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger les tâches");
      setLoading(false);
    }
  };

  // POST /api/tasks
  // Crée une tâche avec le titre saisi dans l'input.
  const addTask = async () => {
    // trim() évite de créer une tâche vide ou seulement avec des espaces.
    if (!newTitle.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      const data = await response.json();
      setTasks([data.task, ...tasks]);
      setNewTitle("");
    } catch (err) {
      setError("Impossible de créer la tâche");
    }
  };

  // PUT /api/tasks/:id
  // Inverse l'état completed d'une tâche (cochée <-> non cochée).
  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const data = await response.json();
      setTasks(tasks.map((t) => (t._id === task._id ? data.task : t)));
    } catch (err) {
      setError("Impossible de modifier la tâche");
    }
  };

  // DELETE /api/tasks/:id
  // Supprime la tâche côté backend puis l'enlève du state local.
  const removeTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError("Impossible de supprimer la tâche");
    }
  };

  // Bascule le thème actuel dark <-> light
  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  // Pendant le chargement initial, on n'affiche que l'état "Chargement..."
  if (loading) {
    return (
      <div className="app-shell">
        <div className="todo-card">
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="todo-card">
        {/* Barre du haut: bouton de changement de thème */}
        <div className="todo-toolbar">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
        <h1 className="todo-title">Todo List</h1>
        <p className="todo-subtitle">React + Express + MongoDB</p>

        {error && <p className="todo-error">{error}</p>}

        {/* Formulaire d'ajout: input contrôlé + bouton Ajouter */}
        <div className="todo-form">
          <input
            className="todo-input"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            // Permet d'ajouter avec la touche Entrée
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Nouvelle tâche..."
          />
          <button className="todo-add-btn" onClick={addTask}>
            Ajouter
          </button>
        </div>

        {/* Liste des tâches */}
        <div className="todo-list">
          {/* Message affiché si aucune tâche */}
          {tasks.length === 0 && (
            <p className="todo-empty">Aucune tâche. Ajoutes-en une !</p>
          )}

          {/* Une ligne par tâche */}
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`todo-row ${task.completed ? "is-completed" : ""}`}
            >
              {/* Coche/décoche la tâche */}
              <button className="todo-check" onClick={() => toggleTask(task)}>
                {task.completed ? "✅" : "⬜"}
              </button>
              <p className="todo-task-title">{task.title}</p>
              {/* Supprime la tâche */}
              <button
                className="todo-delete-btn"
                onClick={() => removeTask(task._id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* Compteur des tâches non terminées */}
        <p className="todo-counter">
          {tasks.filter((t) => !t.completed).length} tâche(s) restante(s)
        </p>
      </div>
    </div>
  );
}
