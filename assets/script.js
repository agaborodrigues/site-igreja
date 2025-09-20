// Pequenos utilitários de UI: carrossel, ano do rodapé, acessibilidade básica

// Atualiza ano no footer
document.getElementById('ano').textContent = new Date().getFullYear();

// Carrossel simples (sem dependências)
document.querySelectorAll('.carousel').forEach(setupCarousel);

function setupCarousel(root){
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prev = root.querySelector('.carousel-btn.prev');
  const next = root.querySelector('.carousel-btn.next');
  const dotsWrap = root.querySelector('.carousel-dots');
  const autoplayMs = parseInt(root.dataset.autoplay || '0', 10);
  let index = 0, timer = null;

  // Criar dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Ir para slide ' + (i+1));
    b.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(b);
  });

  function update(){
    const w = root.clientWidth;
    track.style.transform = `translateX(${-index * w}px)`;
    dotsWrap.querySelectorAll('button').forEach((b,i)=>{
      b.classList.toggle('active', i===index);
    });
  }

  function go(i){
    index = (i + slides.length) % slides.length;
    update();
    resetAutoplay();
  }

  function nextSlide(){ go(index+1); }
  function prevSlide(){ go(index-1); }

  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);
  window.addEventListener('resize', update, {passive:true});

  // Swipe (mobile)
  let startX = 0;
  track.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX, {passive:true});
  track.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 40) prevSlide();
    if (dx < -40) nextSlide();
  }, {passive:true});

  // Autoplay
  function resetAutoplay(){
    if(!autoplayMs) return;
    clearInterval(timer);
    timer = setInterval(nextSlide, autoplayMs);
  }

  // Init
  update();
  resetAutoplay();
}
