/* ==========================================================================
   task-details.js — Task Details view
   ========================================================================== */
(function () {
  const D = window.SmartTaskData;
  function escapeHTML(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  function statusLabel(s) { return s === 'in-progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1); }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const task = id ? D.getTask(id) : null;
    const wrap = document.getElementById('detailWrap');
    const notFound = document.getElementById('notFound');

    if (!task) {
      wrap.style.display = 'none';
      notFound.style.display = 'block';
      return;
    }

    const overdue = D.isOverdue(task);
    document.getElementById('detailCard').classList.add(`p-${task.priority}`);
    document.getElementById('detailTitle').textContent = task.title;
    document.getElementById('detailDesc').textContent = task.description || 'No description added for this task.';
    document.getElementById('badgeStatus').textContent = statusLabel(task.status);
    document.getElementById('badgeStatus').className = `badge badge-${task.status === 'in-progress' ? 'progress' : task.status}`;
    document.getElementById('badgePriority').textContent = task.priority + ' priority';
    document.getElementById('badgePriority').className = `badge badge-${task.priority}`;
    if (overdue) {
      const overdueBadge = document.createElement('span');
      overdueBadge.className = 'badge badge-high';
      overdueBadge.textContent = 'Overdue';
      document.getElementById('detailBadges').appendChild(overdueBadge);
    }
    document.getElementById('metaCategory').textContent = task.category;
    document.getElementById('metaDue').textContent = D.formatDate(task.dueDate);
    document.getElementById('metaCreated').textContent = D.formatDate(task.createdAt);

    const toggleBtn = document.getElementById('toggleCompleteBtn');
    toggleBtn.textContent = task.status === 'completed' ? 'Mark as pending' : 'Mark as completed';
    toggleBtn.addEventListener('click', () => {
      D.setStatus(task.id, task.status === 'completed' ? 'pending' : 'completed');
      window.SmartTaskApp.showToast('Status updated');
      window.location.reload();
    });

    document.getElementById('editBtn').addEventListener('click', () => {
      window.location.href = `task-form.html?id=${task.id}`;
    });

    document.getElementById('deleteBtn').addEventListener('click', () => {
      window.SmartTaskApp.openConfirmModal({
        title: 'Delete this task?',
        message: `"${task.title}" will be permanently removed. This can't be undone.`,
        confirmLabel: 'Delete task',
        onConfirm: () => {
          D.deleteTask(task.id);
          window.SmartTaskApp.showToast('Task deleted');
          window.location.href = 'tasks.html';
        },
      });
    });
  });
})();
