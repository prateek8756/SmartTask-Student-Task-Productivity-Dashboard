/* ==========================================================================
   task-list.js — Task Management view
   ========================================================================== */
(function () {
  const D = window.SmartTaskData;
  let currentView = localStorage.getItem('smarttask_view') || 'grid';

  function escapeHTML(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  function statusLabel(s) { return s === 'in-progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1); }

  function getFilters() {
    return {
      search: document.getElementById('searchInput').value,
      status: document.getElementById('statusFilter').value,
      category: document.getElementById('categoryFilter').value,
      priority: document.getElementById('priorityFilter').value,
    };
  }

  function stubCardHTML(task) {
    const overdue = D.isOverdue(task);
    const { day, month } = D.dueParts(task.dueDate);
    const flagColor = task.priority === 'high' ? 'var(--coral)' : task.priority === 'medium' ? 'var(--sky)' : 'var(--mint)';
    return `
      <div class="stub-card ${overdue ? 'overdue' : ''} ${task.status === 'completed' ? 'is-completed' : ''}" data-id="${task.id}">
        ${task.status === 'completed' ? '<span class="stamp">DONE</span>' : ''}
        <div class="stub-card-actions">
          <button title="Mark complete" data-action="toggle" data-id="${task.id}">${task.status === 'completed' ? checkUndoIcon() : checkIcon()}</button>
          <button title="Edit" data-action="edit" data-id="${task.id}">${editIcon()}</button>
          <button title="Delete" data-action="delete" data-id="${task.id}">${trashIcon()}</button>
        </div>
        <a class="stub-main" href="task-details.html?id=${task.id}" style="display:block;padding-right:34px;">
          <div class="stub-cat">${task.category}</div>
          <div class="stub-title">${escapeHTML(task.title)}</div>
          <div class="stub-desc">${escapeHTML(task.description || 'No description added.')}</div>
          <div class="stub-meta">
            <span class="badge badge-${task.status === 'in-progress' ? 'progress' : task.status}">${statusLabel(task.status)}</span>
            <span class="badge badge-${task.priority}">${task.priority}</span>
          </div>
        </a>
        <a class="stub-side perforation" href="task-details.html?id=${task.id}">
          <span class="due-label">${overdue ? 'Overdue' : 'Due'}</span>
          <span class="due-day">${day}</span>
          <span class="due-month">${month}</span>
          <span class="flag" style="background:${flagColor}22;color:${flagColor}">●</span>
        </a>
      </div>`;
  }

  function tableRowHTML(task) {
    const overdue = D.isOverdue(task);
    return `
      <tr data-id="${task.id}">
        <td data-label="Title"><a class="t-title" href="task-details.html?id=${task.id}">${escapeHTML(task.title)}</a></td>
        <td data-label="Category">${task.category}</td>
        <td data-label="Priority"><span class="badge badge-${task.priority}">${task.priority}</span></td>
        <td data-label="Due"><span class="mono" style="${overdue ? 'color:var(--coral)' : ''}">${D.formatDate(task.dueDate)}</span></td>
        <td data-label="Status"><span class="badge badge-${task.status === 'in-progress' ? 'progress' : task.status}">${statusLabel(task.status)}</span></td>
        <td data-label="Actions">
          <div class="row-actions">
            <button class="btn-icon btn-sm" title="Mark complete" data-action="toggle" data-id="${task.id}">${task.status === 'completed' ? checkUndoIcon() : checkIcon()}</button>
            <button class="btn-icon btn-sm" title="Edit" data-action="edit" data-id="${task.id}">${editIcon()}</button>
            <button class="btn-icon btn-sm" title="Delete" data-action="delete" data-id="${task.id}">${trashIcon()}</button>
          </div>
        </td>
      </tr>`;
  }

  function checkIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>'; }
  function checkUndoIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'; }
  function editIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'; }
  function trashIcon() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>'; }

  function render() {
    const filters = getFilters();
    const sortBy = document.getElementById('sortSelect').value;
    let tasks = D.filterTasks(D.getTasks(), filters);
    tasks = D.sortTasks(tasks, sortBy);

    const gridWrap = document.getElementById('gridView');
    const tableWrap = document.getElementById('tableView');
    const emptyWrap = document.getElementById('emptyState');
    const countEl = document.getElementById('resultCount');

    countEl.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

    if (!tasks.length) {
      gridWrap.style.display = 'none';
      tableWrap.style.display = 'none';
      emptyWrap.style.display = 'block';
      return;
    }
    emptyWrap.style.display = 'none';

    if (currentView === 'grid') {
      gridWrap.style.display = 'grid';
      tableWrap.style.display = 'none';
      gridWrap.innerHTML = tasks.map(stubCardHTML).join('');
    } else {
      gridWrap.style.display = 'none';
      tableWrap.style.display = 'block';
      tableWrap.querySelector('tbody').innerHTML = tasks.map(tableRowHTML).join('');
    }
  }

  function setView(view) {
    currentView = view;
    localStorage.setItem('smarttask_view', view);
    document.querySelectorAll('.view-toggle button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
    render();
  }

  function handleAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'toggle') {
      const task = D.getTask(id);
      D.setStatus(id, task.status === 'completed' ? 'pending' : 'completed');
      window.SmartTaskApp.showToast(task.status === 'completed' ? 'Task marked pending' : 'Task marked complete');
      render();
      updateResultCountOnly();
    } else if (action === 'edit') {
      window.location.href = `task-form.html?id=${id}`;
    } else if (action === 'delete') {
      const task = D.getTask(id);
      window.SmartTaskApp.openConfirmModal({
        title: 'Delete this task?',
        message: `"${task.title}" will be permanently removed. This can't be undone.`,
        confirmLabel: 'Delete task',
        onConfirm: () => {
          D.deleteTask(id);
          window.SmartTaskApp.showToast('Task deleted');
          render();
        },
      });
    }
  }

  function updateResultCountOnly() { /* placeholder for future incremental updates */ }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status')) document.getElementById('statusFilter').value = params.get('status');
    if (params.get('filter') === 'today') {
      // no-op hook, dashboard "today" links go straight to details
    }

    ['searchInput'].forEach((id) => document.getElementById(id).addEventListener('input', render));
    ['statusFilter', 'categoryFilter', 'priorityFilter', 'sortSelect'].forEach((id) =>
      document.getElementById(id).addEventListener('change', render)
    );
    document.querySelectorAll('.view-toggle button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    document.getElementById('gridView').addEventListener('click', handleAction);
    document.getElementById('tableView').addEventListener('click', handleAction);
    document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      document.getElementById('statusFilter').value = '';
      document.getElementById('categoryFilter').value = '';
      document.getElementById('priorityFilter').value = '';
      render();
    });

    setView(currentView);
  });
})();
