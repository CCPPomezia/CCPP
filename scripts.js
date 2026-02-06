// scripts.js - gestione form, lightbox e piccoli miglioramenti UI
document.addEventListener('DOMContentLoaded', function () {
  // imposta anno nel footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // gestione invio form (usa Formspree o un altro endpoint)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      status.textContent = 'Invio in corso...';

      const data = new FormData(form);
      const endpoint = form.action || 'https://formspree.io/f/xqedzwje';

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });

        if (resp.ok) {
          status.textContent = 'Messaggio inviato. Grazie! Ti risponderemo al più presto.';
          form.reset();
        } else {
          let text = 'Si è verificato un errore durante l\'invio. Riprova più tardi.';
          try {
            const json = await resp.json();
            text = json.error || text;
          } catch (_) {}
          status.textContent = text;
          console.error('Form error:', resp);
        }
      } catch (err) {
        console.error(err);
        status.textContent = 'Impossibile inviare il messaggio (errore di rete).';
      }
    });
  }

  // LIGHTBOX per galleria
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = alt || '';
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    // blocca lo scroll dietro la lightbox
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '#';
    lightboxCaption.textContent = '';
    document.body.style.overflow = '';
  }

  if (galleryItems.length) {
    galleryItems.forEach(item => {
      item.addEventListener('click', function () {
        const full = item.getAttribute('data-full');
        const img = item.querySelector('img');
        const alt = img ? img.alt : '';
        if (full) openLightbox(full, alt);
      });
    });
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxClose) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
