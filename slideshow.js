// Slideshow semplice con autoplay, pause on hover, controlli e indicatori.
// Personalizza `intervalMs` per cambiare la velocità dell'autoplay.

(function () {
  const intervalMs = 4000; // 4s
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const btnNext = document.querySelector('.control.next');
  const btnPrev = document.querySelector('.control.prev');
  const slideshowEl = document.querySelector('.slideshow');

  if (!slides.length) return;

  let current = slides.findIndex(s => s.classList.contains('active'));
  if (current < 0) current = 0;
  let timer = null;
  let paused = false;

  function show(index) {
    index = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => { if (!paused) next(); }, intervalMs);
  }
  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // Eventi sui bottoni
  if (btnNext) btnNext.addEventListener('click', () => { next(); startAutoplay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAutoplay(); });

  // Eventi sulle dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      show(idx);
      startAutoplay();
    });
  });

  // Pausa al passaggio del mouse (utile su desktop)
  slideshowEl.addEventListener('mouseenter', () => { paused = true; });
  slideshowEl.addEventListener('mouseleave', () => { paused = false; });

  // Navigazione da tastiera
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
  });

  // Avvio iniziale
  show(current);
  startAutoplay();
})();