/* ==========================================================================
   tasks.js — data layer: storage, CRUD, sample data, filtering/sorting/stats
   Exposes everything on window.SmartTaskData so plain <script> tags can share it.
   ========================================================================== */
(function () {
  const STORAGE_KEY = 'smarttask_tasks_v1';
  const PROFILE_KEY = 'smarttask_profile_v1';

  const CATEGORIES = ['Assignment', 'Exam', 'Project', 'Reading', 'Personal', 'Other'];
  const PRIORITIES = ['low', 'medium', 'high'];
  const STATUSES = ['pending', 'in-progress', 'completed'];

  function generateId() {
    return 't_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function todayPlus(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function sampleTasks() {
    return [
      { id: generateId(), title: 'Finish React component library', description: 'Build and document the reusable Button, Card and Modal components for the SmartTask UI kit.', category: 'Project', priority: 'high', dueDate: todayPlus(1), status: 'in-progress', createdAt: todayPlus(-6) },
      { id: generateId(), title: 'Database systems – Chapter 7 reading', description: 'Read normalization forms (1NF–3NF) and complete the end-of-chapter exercises.', category: 'Reading', priority: 'medium', dueDate: todayPlus(2), status: 'pending', createdAt: todayPlus(-5) },
      { id: generateId(), title: 'Submit internship progress report', description: 'Weekly progress summary for the frontend development internship, including screenshots.', category: 'Assignment', priority: 'high', dueDate: todayPlus(-1), status: 'pending', createdAt: todayPlus(-4) },
      { id: generateId(), title: 'Operating Systems mid-term', description: 'Covers process scheduling, deadlocks and memory management.', category: 'Exam', priority: 'high', dueDate: todayPlus(5), status: 'pending', createdAt: todayPlus(-10) },
      { id: generateId(), title: 'Refactor task filtering logic', description: 'Simplify the filter/sort pipeline in tasks.js and add unit-level sanity checks.', category: 'Project', priority: 'medium', dueDate: todayPlus(3), status: 'in-progress', createdAt: todayPlus(-3) },
      { id: generateId(), title: 'Grocery run + meal prep', description: 'Weekly groceries and prepping lunches for the week.', category: 'Personal', priority: 'low', dueDate: todayPlus(0), status: 'pending', createdAt: todayPlus(-1) },
      { id: generateId(), title: 'Peer review teammate\'s pull request', description: 'Review the auth-flow branch and leave comments before merging.', category: 'Project', priority: 'medium', dueDate: todayPlus(1), status: 'completed', createdAt: todayPlus(-7) },
      { id: generateId(), title: 'Statistics assignment set 4', description: 'Problems 1–12 on hypothesis testing, due before the Friday tutorial.', category: 'Assignment', priority: 'medium', dueDate: todayPlus(-2), status: 'completed', createdAt: todayPlus(-9) },
      { id: generateId(), title: 'Renew library books', description: 'Two books on distributed systems are due back this week.', category: 'Personal', priority: 'low', dueDate: todayPlus(4), status: 'pending', createdAt: todayPlus(-2) },
      { id: generateId(), title: 'Prepare final presentation slides', description: 'Slides covering problem statement, architecture, demo flow and challenges faced.', category: 'Project', priority: 'high', dueDate: todayPlus(7), status: 'in-progress', createdAt: todayPlus(-1) },
    ];
  }

  function getTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = sampleTasks();
        saveTasks(seeded);
        return seeded;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('SmartTask: failed to read tasks', e);
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function getTask(id) {
    return getTasks().find((t) => t.id === id) || null;
  }

  function addTask(data) {
    const tasks = getTasks();
    const task = {
      id: generateId(),
      title: data.title.trim(),
      description: (data.description || '').trim(),
      category: data.category,
      priority: data.priority,
      dueDate: data.dueDate,
      status: data.status || 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    tasks.unshift(task);
    saveTasks(tasks);
    return task;
  }

  function updateTask(id, data) {
    const tasks = getTasks();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...data, title: data.title ? data.title.trim() : tasks[idx].title };
    saveTasks(tasks);
    return tasks[idx];
  }

  function deleteTask(id) {
    const tasks = getTasks().filter((t) => t.id !== id);
    saveTasks(tasks);
  }

  function setStatus(id, status) {
    return updateTask(id, { status });
  }

  function isOverdue(task) {
    if (task.status === 'completed') return false;
    return task.dueDate < new Date().toISOString().slice(0, 10);
  }

  function filterTasks(tasks, opts) {
    opts = opts || {};
    let out = tasks.slice();
    if (opts.status) out = out.filter((t) => t.status === opts.status);
    if (opts.category) out = out.filter((t) => t.category === opts.category);
    if (opts.priority) out = out.filter((t) => t.priority === opts.priority);
    if (opts.search) {
      const q = opts.search.trim().toLowerCase();
      if (q) out = out.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return out;
  }

  function sortTasks(tasks, sortBy) {
    const out = tasks.slice();
    const pOrder = { high: 0, medium: 1, low: 2 };
    switch (sortBy) {
      case 'dueDate':
        out.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        break;
      case 'dueDateDesc':
        out.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
        break;
      case 'priority':
        out.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
        break;
      case 'created':
        out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        break;
    }
    return out;
  }

  function getStats(tasks) {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter(isOverdue).length;
    return { total, pending, inProgress, completed, overdue };
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function dueParts(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return { day: d.getDate(), month: d.toLocaleDateString(undefined, { month: 'short' }) };
  }

  // ---- Profile / preferences (simulated on the frontend) ----
  function getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    const def = { name: 'Prateek Pathak', role: 'Computer Science Student', email: 'prateek.pathak405@gmail.com', theme: 'dark', notifications: true, compactView: false };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(def));
    return def;
  }

  function saveProfile(p) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }

  window.SmartTaskData = {
    CATEGORIES, PRIORITIES, STATUSES,
    getTasks, saveTasks, getTask, addTask, updateTask, deleteTask, setStatus,
    filterTasks, sortTasks, getStats, isOverdue, formatDate, dueParts,
    getProfile, saveProfile,
  };
})();
