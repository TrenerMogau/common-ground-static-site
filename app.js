// Common Ground - Interactive Application Logic
// Project Code: WTC-3JWZDDTJ
// Author: Mogau Mothapo <trener.mogau.dev@gmail.com>

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initProgressBar();
  initNoteFilters();
  initNoteModal();
  initContactModal();
  initBackToTop();
});

// 1. Theme Management (Light / Dark)
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const storedTheme = localStorage.getItem('cg-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cg-theme', theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// 2. Reading Progress Bar
function initProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

// 3. Category Filter for Notes
function initNoteFilters() {
  const filterButtons = document.querySelectorAll('.filter-pill');
  const noteCards = document.querySelectorAll('.note-card');

  if (!filterButtons.length || !noteCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      noteCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Note Reading Modal Dialog
const NOTE_DATA = {
  '1': {
    meta: 'Field note / 01',
    title: 'Start with the part you can see.',
    summary: 'Small observations often contain the shape of the larger problem. Begin there.',
    content: `
      <p>When approaching ambiguous challenges or intricate architectures, the temptation is always to design for the entire unseen horizon. But clarity rarely arrives all at once.</p>
      <p>By focusing deeply on the immediate, observable component—the first interface, the primary data path, the concrete edge—the true constraints reveal themselves naturally. You don’t need the entire map to take the next confident step.</p>
      <blockquote>"Observation precedes optimization. Begin with what is tangible, and let the architecture grow from truth rather than assumption."</blockquote>
    `,
    subject: 'Field note 01'
  },
  '2': {
    meta: 'Working principle / 02',
    title: 'Useful beats impressive.',
    summary: 'The best tools disappear into the work. A good idea should do the same.',
    content: `
      <p>Technical sophistication is easy to admire, but utility is what endures. An over-engineered system creates cognitive friction for the person trying to get work done.</p>
      <p>When you strip away gratuitous complexity, what remains is calm, durable, and effective. The highest compliment for an engineering system is not that someone noticed how clever it was, but that they forgot it was even there.</p>
      <blockquote>"Simplicity isn't the absence of ambition; it is the discipline to make utility paramount."</blockquote>
    `,
    subject: 'Working principle 02'
  },
  '3': {
    meta: 'Question / 03',
    title: 'What would make this lighter?',
    summary: 'A question for projects, plans, and the occasional Tuesday afternoon.',
    content: `
      <p>Every project accumulates weight over time: extra dependencies, redundant processes, lingering assumptions. Left unchecked, that weight slows decision-making and drains momentum.</p>
      <p>Asking "What would make this lighter?" is a recurring practice of subtraction. Can we eliminate a step? Can we simplify the pipeline? Can we say what we mean in fewer words? Lightness brings speed, resilience, and joy to craftsmanship.</p>
      <blockquote>"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."</blockquote>
    `,
    subject: 'Question 03'
  }
};

function initNoteModal() {
  const modal = document.getElementById('note-modal');
  const openButtons = document.querySelectorAll('.read-note-btn');
  const closeButton = document.getElementById('close-modal-btn');

  if (!modal) return;

  openButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const noteId = button.getAttribute('data-note-id');
      const data = NOTE_DATA[noteId];
      if (!data) return;

      document.getElementById('modal-meta').textContent = data.meta;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-body').innerHTML = data.content;
      
      const replyBtn = document.getElementById('modal-reply-btn');
      if (replyBtn) {
        replyBtn.href = `mailto:trener.mogau.dev@gmail.com?subject=${encodeURIComponent(data.subject)}`;
      }

      modal.showModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => modal.close());
  }

  modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      modal.close();
    }
  });
}

// 5. Contact & Copy Action
function initContactModal() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const email = 'trener.mogau.dev@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email address copied to clipboard!');
    } catch {
      // Fallback if clipboard API is restricted
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Email copied: ' + email);
    }
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}

// 6. Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
