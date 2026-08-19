/* ==========================================================================
   landing.js — index.html ke hero section mein REAL tasks dikhata hai
   ========================================================================== */
(function () {
  function escapeHTML(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  function statusLabel(s) { return s === 'in-progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1); }

  function stubCardHTML(task) {
    const { day, month } = window.SmartTaskData.dueParts(task.dueDate);
    return `
      <div class="stub-card ${task.status === 'completed' ? 'is-completed' : ''}">
        ${task.status === 'completed' ? '<span class="stamp">DONE</span>' : ''}
        <div class="stub-main">
          <div class="stub-cat">${task.category}</div>
          <div class="stub-title">${escapeHTML(task.title)}</div>
          <div class="stub-meta">
            <span class="badge badge-${task.status === 'in-progress' ? 'progress' : task.status}">${statusLabel(task.status)}</span>
            <span class="badge badge-${task.priority}">${task.priority}</span>
          </div>
        </div>
        <div class="stub-side perforation">
          <span class="due-label">Due</span>
          <span class="due-day">${day}</span>
          <span class="due-month">${month}</span>
        </div>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('heroVisual');
    if (!el || !window.SmartTaskData) return;
    const tasks = window.SmartTaskData.getTasks().slice(0, 3);
    if (!tasks.length) { el.innerHTML = ''; return; }
    el.innerHTML = tasks.map(stubCardHTML).join('');
  });
})();
