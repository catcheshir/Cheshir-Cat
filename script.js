document.addEventListener('DOMContentLoaded', () => {
  // Предварительная загрузка GIF
  const mainLogo = document.querySelector('.main-logo');
  const preloadImage = new Image();
  preloadImage.src = 'media/catlogo.gif';
  preloadImage.onload = () => {
    mainLogo.src = preloadImage.src;
    console.log('GIF загружен:', preloadImage.src);
  };
  preloadImage.onerror = () => {
    console.error('Ошибка загрузки GIF');
  };

  // Проверка остальных медиа
  const checkMedia = (src, type) => {
    const media = type === 'img' ? new Image() : document.createElement('video');
    media.src = src + '?v=' + Date.now();
    media.onload = () => console.log(`Успешно загружено: ${src}`);
    media.onerror = () => console.error(`Ошибка загрузки ${src}`);
  };

  checkMedia('media/background.jpg', 'img');
  checkMedia('media/tglogo.png', 'img');
  checkMedia('media/smoke.mp4', 'video');

  // Видео дыма
  const smokeVideo = document.querySelector('.smoke-video');
  smokeVideo.addEventListener('error', () => {
    console.error('Ошибка загрузки smoke.mp4');
    smokeVideo.style.display = 'none';
  });
  smokeVideo.addEventListener('canplay', () => {
    smokeVideo.classList.add('loaded');
  });

  // Анимация логотипа
  const mainLogoDiv = document.getElementById('logoMain');
  mainLogoDiv?.addEventListener('click', () => {
    mainLogoDiv.classList.add('clicked');
    setTimeout(() => mainLogoDiv.classList.remove('clicked'), 300);
  });

  // Анимация заголовка (при клике)
  const heroTitle = document.querySelector('.hero-title');
  heroTitle?.addEventListener('click', () => {
    heroTitle.classList.add('clicked');
    setTimeout(() => heroTitle.classList.remove('clicked'), 300);
  });

  // ⏱️ Анимация появления букв в заголовке
  const spans = document.querySelectorAll('.hero-title span');
  const initialDelay = 500; // 0.5 сек
  const totalTime = 1700; // 1.7 сек (2.2 сек - initialDelay)
  const count = spans.length;
  const step = totalTime / count;

  setTimeout(() => {
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('visible');
      }, step * index);
    });
  }, initialDelay);

  // Анимация пузырей и отложенный переход
  const bubblyButtons = document.getElementsByClassName('bubbly-button');
  for (let i = 0; i < bubblyButtons.length; i++) {
    const button = bubblyButtons[i];
    let isAnimating = false;

    button.addEventListener('click', (e) => {
      if (button.classList.contains('unavailable')) {
        e.preventDefault();
        button.classList.add('clicked-unavailable');
        setTimeout(() => button.classList.remove('clicked-unavailable'), 500);
      } else if (!isAnimating) {
        e.preventDefault();
        isAnimating = true;
        button.classList.remove('animate');
        void button.offsetWidth;
        button.classList.add('animate');

        setTimeout(() => {
          button.classList.remove('animate');
          isAnimating = false;

          const href = button.getAttribute('href');
          if (href && href !== 'javascript:void(0)') {
            window.location.href = href;
          }
        }, 1000); // 1 секунда задержки
      }
    });

    // Пузыри при наведении
    button.addEventListener('mouseover', () => {
      if (!button.classList.contains('unavailable') && !isAnimating) {
        isAnimating = true;
        button.classList.remove('animate');
        void button.offsetWidth;
        button.classList.add('animate');
        setTimeout(() => {
          button.classList.remove('animate');
          isAnimating = false;
        }, 700);
      }
    });
  }

  // Падающие звёзды
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 20;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 3 + 2;
      this.opacity = Math.random() * 0.5 + 0.5;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
        this.opacity = Math.random() * 0.5 + 0.5;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});