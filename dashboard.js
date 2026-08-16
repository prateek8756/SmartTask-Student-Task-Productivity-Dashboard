/* ==========================================================================
   dashboard.js — renders the dashboard view
   ========================================================================== */
(function () {
  const { getTasks, getStats, isOverdue, formatDate, dueParts } = window.SmartTaskData;

  function stubCardHTML(task) {
    const overdue = isOverdue(task);
    const { day, month } = dueParts(task.dueDate);
    const flagColor = task.priority === 'high' ? 'var(--coral)' : task.priority === 'medium' ? 'var(--sky)' : 'var(--mint)';
    return `
      <a class="stub-card ${overdue ? 'overdue' : ''} ${task.status === 'completed' ? 'is-completed' : ''}" href="task-details.html?id=${task.id}">
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
          <span class="due-label">${overdue ? 'Overdue' : 'Due'}</span>
          <span class="due-day">${day}</span>
          <span class="due-month">${month}</span>
          <span class="flag" style="background:${flagColor}22;color:${flagColor}">●</span>
        </div>
      </a>`;
  }

  function statusLabel(s) { return s === 'in-progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1); }
  function escapeHTML(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

  function renderStats(stats) {
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statProgress').textContent = stats.inProgress;
    document.getElementById('statDone').textContent = stats.completed;
  }

  function renderToday(tasks) {
    const today = new Date().toISOString().slice(0, 10);
    const todays = tasks.filter((t) => t.dueDate === today && t.status !== 'completed');
    const el = document.getElementById('todayList');
    if (!todays.length) {
      el.innerHTML = `<div class="empty-state" style="padding:36px 12px;">
        <h3>Nothing due today</h3><p>Enjoy the breathing room — check the full task list for what's coming up.</p>
      </div>`;
      return;
    }
    el.innerHTML = `<div class="task-grid">${todays.map(stubCardHTML).join('')}</div>`;
  }

  function renderCategoryBreakdown(tasks) {
    const cats = window.SmartTaskData.CATEGORIES;
    const counts = cats.map((c) => tasks.filter((t) => t.category === c).length);
    const max = Math.max(1, ...counts);
    const colors = ['#ffc857', '#6ec1ff', '#4fd1ae', '#ff6b6b', '#b28dff', '#8b91ac'];
    const el = document.getElementById('categoryChart');
    el.innerHTML = cats.map((c, i) => `
      <div class="bar-row">
        <span class="muted">${c}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${(counts[i] / max) * 100}%;background:${colors[i]}"></span></span>
        <span class="mono muted">${counts[i]}</span>
      </div>`).join('');
  }

  function renderUpcoming(tasks) {
    const upcoming = tasks
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
    const el = document.getElementById('upcomingList');
    if (!upcoming.length) { el.innerHTML = `<p class="muted" style="font-size:13px;">No pending tasks — you're all caught up.</p>`; return; }
    el.innerHTML = upcoming.map((t) => `
      <a href="task-details.html?id=${t.id}" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:13.5px;font-weight:600;">${escapeHTML(t.title)}</span>
        <span class="mono muted" style="font-size:12px;flex-shrink:0;margin-left:12px;">${formatDate(t.dueDate)}</span>
      </a>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tasks = getTasks();
    renderStats(getStats(tasks));
    renderToday(tasks);
    renderCategoryBreakdown(tasks);
    renderUpcoming(tasks);
  });
})();
