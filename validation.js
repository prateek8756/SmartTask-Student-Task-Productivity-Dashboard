/* ==========================================================================
   validation.js — reusable form validation for the task form
   ========================================================================== */
(function () {
  function validateTaskForm(data) {
    const errors = {};

    if (!data.title || !data.title.trim()) {
      errors.title = 'Give the task a title.';
    } else if (data.title.trim().length < 3) {
      errors.title = 'Title needs at least 3 characters.';
    } else if (data.title.trim().length > 80) {
      errors.title = 'Keep the title under 80 characters.';
    }

    if (!data.category) {
      errors.category = 'Choose a category.';
    }

    if (!data.priority) {
      errors.priority = 'Choose a priority.';
    }

    if (!data.status) {
      errors.status = 'Choose a status.';
    }

    if (!data.dueDate) {
      errors.dueDate = 'Pick a due date.';
    } else if (isNaN(new Date(data.dueDate).getTime())) {
      errors.dueDate = 'That date doesn\'t look valid.';
    }

    if (data.description && data.description.length > 500) {
      errors.description = 'Keep the description under 500 characters.';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  function showFieldError(fieldName, message) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    const msg = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (input) input.classList.add('field-error');
    if (msg) { msg.textContent = message; msg.classList.add('show'); }
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach((el) => el.classList.remove('field-error'));
    form.querySelectorAll('.field-error-msg').forEach((el) => { el.textContent = ''; el.classList.remove('show'); });
  }

  function applyErrors(form, errors) {
    clearFieldErrors(form);
    Object.keys(errors).forEach((field) => showFieldError(field, errors[field]));
    const firstField = Object.keys(errors)[0];
    if (firstField) {
      const el = form.querySelector(`[name="${firstField}"]`);
      if (el) el.focus();
    }
  }

  window.SmartTaskValidation = { validateTaskForm, showFieldError, clearFieldErrors, applyErrors };
})();
