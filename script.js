/* consolidated script.js - navigation, lightbox, forms, products, modal */

/* ---------- NAV ---------- */
function toggleMobileNav() {
  const nav = document.querySelector('.nav-list');
  if (!nav) return;
  nav.classList.toggle('open');
}

/* Close mobile nav on link click (better UX) */
document.addEventListener('click', (e) => {
  if (e.target.matches('.nav-list a')) {
    const nav = document.querySelector('.nav-list');
    if (window.innerWidth <= 800 && nav) nav.classList.remove('open');
  }
});

/* ---------- MODAL (Info) ---------- */
function openModalById(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
}
function closeModalByEl(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}
document.addEventListener('click', (e) => {
  const modal = document.getElementById('infoModal');
  if (e.target.matches('#openInfoBtn') || e.target.matches('#openInfoBtn *')) {
    openModalById('infoModal');
  }
  if (e.target.matches('[data-close]') || e.target.matches('.modal')) {
    if (modal) closeModalByEl(modal);
  }
});

/* ---------- LIGHTBOX ---------- */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.style.display = 'flex';
  lb.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.style.display = 'none';
  lb.setAttribute('aria-hidden', 'true');
  const img = document.getElementById('lightbox-img');
  if (img) img.src = '';
}

/* close lightbox on Esc */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---------- PRODUCTS: search + sort ---------- */
function filterProducts() {
  const input = document.getElementById('search');
  if (!input) return;
  const q = input.value.toLowerCase();
  document.querySelectorAll('.product').forEach(item => {
    const name = (item.dataset.name || item.textContent).toLowerCase();
    item.style.display = name.includes(q) ? 'block' : 'none';
  });
}
function sortProducts() {
  const sel = document.getElementById('sort');
  const grid = document.getElementById('product-grid');
  if (!sel || !grid) return;
  const items = Array.from(grid.querySelectorAll('.product'));
  if (sel.value === 'price-asc') {
    items.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
  } else if (sel.value === 'price-desc') {
    items.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
  } else if (sel.value === 'name-asc') {
    items.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
  }
  items.forEach(i => grid.appendChild(i));
}

/* wire up controls on load */
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  if (search) search.addEventListener('input', filterProducts);

  const sort = document.getElementById('sort');
  if (sort) sort.addEventListener('change', sortProducts);

  /* modal close buttons inside any modal */
  document.querySelectorAll('.modal [data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) closeModalByEl(modal);
    });
  });

  /* ensure nav closes on outside click for mobile */
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;
    if (!e.target.closest('.nav-bar') && window.innerWidth <= 800) nav.classList.remove('open');
  });
});
/* ---------- FORMS: ticket + enquiry ---------- */
function saveToLocal(key, obj) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(obj);
  localStorage.setItem(key, JSON.stringify(arr));
}

function encodeMailto(to, subject, body) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* Ticket form (contact page) */
function showForm() {
  const el = document.getElementById('ticketForm');
  if (el) {
    el.classList.remove('hidden');
    el.setAttribute('aria-hidden', 'false');
  }
}
function hideForm() {
  const el = document.getElementById('ticketForm');
  if (el) {
    el.classList.add('hidden');
    el.setAttribute('aria-hidden', 'true');
  }
}

function submitTicket(e) {
  e.preventDefault();
  const form = document.getElementById('ticket');
  if (!form) return;

  const name = form.querySelector('#t-name').value.trim();
  const email = form.querySelector('#t-email').value.trim();
  const type = form.querySelector('#t-type').value;
  const issue = form.querySelector('#t-issue').value.trim();

  const msgEl = document.getElementById('ticketMsg');

  if (!name || !email || !issue || !type) {
    if (msgEl) msgEl.textContent = 'Please complete all required fields.';
    return;
  }

  const ticket = {
    id: Date.now(),
    name, email, type, issue, created: new Date().toISOString()
  };

  // Save locally (fallback)
  saveToLocal('essence_tickets', ticket);

  // Compose mailto so user can send mail
  const recipient = 'support@essenceboutique.com';
  const subject = `Ticket: ${type} - ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\nType: ${type}\n\nIssue:\n${issue}\n\n---\nThis ticket was saved locally in the browser as a fallback.`;
  window.location.href = encodeMailto(recipient, subject, body);

  form.reset();
  hideForm();
  if (msgEl) msgEl.textContent = 'Your ticket was prepared in your email client and saved locally as a backup.';
}

/* Enquiry form */
function submitEnquiry(e) {
  e.preventDefault();
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const name = form.querySelector('#e-name').value.trim();
  const email = form.querySelector('#e-email').value.trim();
  const phone = form.querySelector('#e-phone').value.trim();
  const product = form.querySelector('#e-product').value.trim();
  const message = form.querySelector('#e-message').value.trim();
  const statusEl = document.getElementById('enquiryMsg');

  if (!name || !email || !product || !message) {
    if (statusEl) statusEl.textContent = 'Please complete all required fields.';
    return;
  }

  const record = { id: Date.now(), name, email, phone, product, message, created: new Date().toISOString() };
  saveToLocal('essence_enquiries', record);

  // Try to open mail client with contents
  const recipient = 'support@essenceboutique.com';
  const subject = `Product Enquiry: ${product} - ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProduct: ${product}\n\nMessage:\n${message}\n\n---\nSaved locally in browser.`;
  // open mail client (this will not auto-send, user must send)
  window.location.href = encodeMailto(recipient, subject, body);

  form.reset();
  if (statusEl) statusEl.textContent = 'Enquiry prepared in your email client and saved locally as a backup.';
}

/* utility to gracefully handle forms with no backend */
function simulateAjaxSubmit(payload, onSuccess, onError) {
  // there's no backend in this static assignment. We'll simulate delay then call success.
  setTimeout(() => {
    if (typeof onSuccess === 'function') onSuccess();
  }, 500);
}
