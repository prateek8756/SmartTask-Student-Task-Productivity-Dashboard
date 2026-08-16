/* ==========================================================================
   task-form.js — Add / Edit Task form
   ========================================================================== */
(function () {
  const D = window.SmartTaskData;
  const V = window.SmartTaskValidation;

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    const heading = document.getElementById('formHeading');
    const sub = document.getElementById('formSub');
    const submitBtn = document.getElementById('submitBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const descField = form.querySelector('[name="description"]');
    const charCount = document.getElementById('charCount');

    // populate selects
    const catSelect = form.querySelector('[name="category"]');
    catSelect.innerHTML = '<option value="">Select category</option>' + D.CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join('');

    let editingTask = null;
    if (editId) {
      editingTask = D.getTask(editId);
      if (editingTask) {
        heading.textContent = 'Edit task';
        sub.textContent = 'Update the details below.';
        submitBtn.textContent = 'Save changes';
        deleteBtn.style.display = 'inline-flex';
        form.title.value = editingTask.title;
        form.description.value = editingTask.description;
        form.category.value = editingTask.category;
        form.priority.value = editingTask.priority;
        form.dueDate.value = editingTask.dueDate;
        form.status.value = editingTask.status;
      } else {
        window.SmartTaskApp.showToast('That task could not be found.', 'error');
      }
    } else {
      heading.textContent = 'Add a new task';
      sub.textContent = 'Fill in the details to add it to your list.';
    }

    updateCharCount();
    descField.addEventListener('input', updateCharCount);
    function updateCharCount() {
      charCount.textContent = `${descField.value.length} / 500`;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        title: form.title.value,
        description: form.description.value,
        category: form.category.value,
        priority: form.priority.value,
        dueDate: form.dueDate.value,
        status: form.status.value,
      };
      const result = V.validateTaskForm(data);
      if (!result.valid) {
        V.applyErrors(form, result.errors);
        window.SmartTaskApp.showToast('Please fix the highlighted fields.', 'error');
        return;
      }
      V.clearFieldErrors(form);

      if (editingTask) {
        D.updateTask(editingTask.id, data);
        window.SmartTaskApp.showToast('Task updated');
        window.location.href = `task-details.html?id=${editingTask.id}`;
      } else {
        const task = D.addTask(data);
        window.SmartTaskApp.showToast('Task added');
        window.location.href = `task-details.html?id=${task.id}`;
      }
    });

    if (editingTask) {
      deleteBtn.addEventListener('click', () => {
        window.SmartTaskApp.openConfirmModal({
          title: 'Delete this task?',
          message: `"${editingTask.title}" will be permanently removed.`,
          confirmLabel: 'Delete task',
          onConfirm: () => {
            D.deleteTask(editingTask.id);
            window.SmartTaskApp.showToast('Task deleted');
            window.location.href = 'tasks.html';
          },
        });
      });
    }

    document.getElementById('cancelBtn').addEventListener('click', () => {
      window.history.back();
    });
  });
})();
