/* ============================================
   LOCALFIT — Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFormValidation('kennenlernForm');
  initFormValidation('kontaktForm');
});

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous states
    form.querySelectorAll('.form-error, .form-success').forEach(el => {
      el.classList.remove('form-error', 'form-success');
      el.removeAttribute('aria-invalid');
    });
    form.querySelectorAll('.form-message').forEach(el => el.remove());

    let isValid = true;

    // Validate required fields
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        markError(field, 'Dieses Feld ist erforderlich.');
        isValid = false;
      }
    });

    // Validate email (only if field has a value and wasn't already marked as error)
    form.querySelectorAll('input[type="email"]').forEach(field => {
      if (field.value && !field.classList.contains('form-error') && !isValidEmail(field.value)) {
        markError(field, 'Bitte gib eine gültige E-Mail-Adresse ein.');
        isValid = false;
      }
    });

    // Validate phone (only if field has a value and wasn't already marked as error)
    form.querySelectorAll('input[type="tel"]').forEach(field => {
      if (field.value && !field.classList.contains('form-error') && !isValidPhone(field.value)) {
        markError(field, 'Bitte gib eine gültige Telefonnummer ein.');
        isValid = false;
      }
    });

    // Mark valid required fields as success
    if (!isValid) {
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.classList.contains('form-error') && field.value.trim()) {
          field.classList.add('form-success');
        }
      });
    }

    if (isValid) {
      showSuccess(form);
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => {
      field.classList.remove('form-error', 'form-success');
      field.removeAttribute('aria-invalid');
      const msg = field.parentElement.querySelector('.form-message');
      if (msg) msg.remove();

      if (field.hasAttribute('required') && !field.value.trim()) {
        return;
      }

      if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        markError(field, 'Ungültige E-Mail-Adresse.');
      } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        markError(field, 'Ungültige Telefonnummer.');
      } else if (field.value.trim()) {
        field.classList.add('form-success');
      }
    });
  });
}

function markError(field, message) {
  field.classList.remove('form-success');
  field.classList.add('form-error');
  field.setAttribute('aria-invalid', 'true');

  const msg = document.createElement('div');
  msg.className = 'form-message error';
  msg.setAttribute('role', 'alert');
  msg.textContent = message;

  const existing = field.parentElement.querySelector('.form-message');
  if (existing) existing.remove();

  field.parentElement.appendChild(msg);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s+\-()]{7,}$/.test(phone);
}

function showSuccess(form) {
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Wird gesendet...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    form.innerHTML = `
      <div style="text-align: center; padding: 48px 24px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: #e8f5e9; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34c759" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="margin-bottom: 12px; color: var(--text-primary);">Vielen Dank!</h3>
        <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto;">
          Deine Anfrage wurde erfolgreich übermittelt. Wir melden uns so schnell wie möglich bei dir.
        </p>
      </div>
    `;
  }, 1200);
}
