/* ==========================================================================
   profile.js — Profile / Settings view (simulated on the frontend)
   ========================================================================== */
(function () {
  const D = window.SmartTaskData;

  document.addEventListener('DOMContentLoaded', () => {
    const profile = D.getProfile();
    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileRole').textContent = profile.role;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('avatarInitials').textContent = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    const notifToggle = document.getElementById('notifToggle');
    const compactToggle = document.getElementById('compactToggle');
    notifToggle.classList.toggle('on', !!profile.notifications);
    compactToggle.classList.toggle('on', !!profile.compactView);

    notifToggle.addEventListener('click', () => {
      const p = D.getProfile();
      p.notifications = !p.notifications;
      D.saveProfile(p);
      notifToggle.classList.toggle('on', p.notifications);
      window.SmartTaskApp.showToast(p.notifications ? 'Notifications enabled' : 'Notifications disabled');
    });
    compactToggle.addEventListener('click', () => {
      const p = D.getProfile();
      p.compactView = !p.compactView;
      D.saveProfile(p);
      compactToggle.classList.toggle('on', p.compactView);
      window.SmartTaskApp.showToast(p.compactView ? 'Compact view enabled' : 'Compact view disabled');
    });

    const tasks = D.getTasks();
    const stats = D.getStats(tasks);
    document.getElementById('profileTotal').textContent = stats.total;
    document.getElementById('profileDone').textContent = stats.completed;
    document.getElementById('profileRate').textContent = stats.total ? Math.round((stats.completed / stats.total) * 100) + '%' : '0%';

    document.getElementById('editProfileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const p = D.getProfile();
      p.name = document.getElementById('editName').value.trim() || p.name;
      p.role = document.getElementById('editRole').value.trim() || p.role;
      D.saveProfile(p);
      window.SmartTaskApp.showToast('Profile updated');
      window.location.reload();
    });

    document.getElementById('resetDataBtn').addEventListener('click', () => {
      window.SmartTaskApp.openConfirmModal({
        title: 'Reset all task data?',
        message: 'This clears every task and restores the sample dataset. This can\'t be undone.',
        confirmLabel: 'Reset data',
        onConfirm: () => {
          localStorage.removeItem('smarttask_tasks_v1');
          window.SmartTaskApp.showToast('Task data reset');
          setTimeout(() => (window.location.href = 'dashboard.html'), 400);
        },
      });
    });
  });
})();
