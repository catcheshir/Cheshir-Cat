// Анимация курсора со звездами
let x1 = 0, y1 = 0;
const
  vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
  dist_to_draw = 50,
  delay = 1000,
  fsize = ['1.1rem', '1.4rem', '.8rem', '1.7rem'],
  colors = ['#E23636', '#F9F3EE', '#E1F8DC', '#B8AFE6', '#AEE1CD', '#5EB0E5'],
  rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  selRand = (o) => o[rand(0, o.length - 1)],
  distanceTo = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
  shouldDraw = (x, y) => (distanceTo(x1, y1, x, y) >= dist_to_draw),
  addStr = (x, y) => {
    const str = document.createElement("div");
    str.innerHTML = '✦';
    str.className = 'star';
    str.style.top = `${y + rand(-20, 20)}px`;
    str.style.left = `${x}px`;
    str.style.color = selRand(colors);
    str.style.fontSize = selRand(fsize);
    document.body.appendChild(str);
    const fs = 10 + 5 * parseFloat(getComputedStyle(str).fontSize);
    str.animate({
      translate: `0 ${(y + fs) > vh ? vh - y : fs}px`,
      opacity: 0,
      transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`
    }, {
      duration: delay,
      fill: 'forwards',
    });
    setTimeout(() => { str.remove(); }, delay);
  };

// Следящий курсор
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  const { clientX, clientY } = e;
  if (shouldDraw(clientX, clientY)) {
    addStr(clientX, clientY);
    x1 = clientX;
    y1 = clientY;
  }
});

// Анимация появления и нажатия кнопок
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.bubble-button');

  buttons.forEach((button, index) => {
    // Появление кнопок по очереди
    setTimeout(() => {
      button.style.opacity = '1';
      button.style.transform = 'translateY(0)';
    }, index * 200);

    // Эффект маски при нажатии
    button.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);

      // Переход по JSON-ссылке
      const href = this.getAttribute('data-href');
      if (href && href !== '#') {
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      }
    });

    // Стартовые стили
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  // Фикс iOS
  if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
    document.body.style.backgroundAttachment = 'scroll';
  }

  // Автозапуск видео
  const videoBg = document.getElementById('video-bg');
  if (videoBg) {
    videoBg.play().catch(e => {
      console.log('Автовоспроизведение видео заблокировано браузером');
    });
  }
});

// Дымовая анимация
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('smokeCanvas');
  const ctx = canvas.getContext('2d');
  const smokeImg = new Image();
  smokeImg.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/15388/smoke.png';
  const config = {
    x: window.innerWidth / 2,
    y: window.innerHeight + 50,
    size: 70,
    particles: 150,
    speed: { x: -2, y: -2.5, fade: 150, acceleration: 200 }
  };
  const particles = [];
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = config.x + Math.random() * 100 - 50;
      this.y = config.y + Math.random() * 20 - 10;
      this.size = config.size;
      this.speedX = Math.random() * config.speed.x;
      this.speedY = Math.random() * config.speed.y;
      this.opacity = Math.random();
      this.initialSize = this.size;
    }
    update() {
      if(this.opacity > 0) this.opacity -= (Math.random() / config.speed.fade);
      if(this.opacity <= 0) this.reset();
      this.speedX -= Math.random() / config.speed.acceleration;
      this.speedY -= Math.random() / config.speed.acceleration;
      this.x += this.speedX;
      this.y += this.speedY;
      this.size = this.initialSize + Math.random() * 10;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.drawImage(smokeImg,0,0,smokeImg.width,smokeImg.height,this.x,this.y,this.size,this.size);
    }
  }
  function initParticles() { for(let i = 0; i < config.particles; i++) particles.push(new Particle()); }
  function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  function animate() {
    clearCanvas();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.x = window.innerWidth / 2;
    config.y = window.innerHeight + 50;
  }
  smokeImg.onload = function() { handleResize(); initParticles(); animate(); };
  window.addEventListener('resize', handleResize);
});

// Дымовые надписи
function showSmokeText() {
  const texts = document.querySelectorAll('.smoke-text');
  const randomText = texts[Math.floor(Math.random() * texts.length)];
  const clone = randomText.cloneNode(true);
  clone.style.left = Math.random() * (window.innerWidth - 200) + 'px';
  clone.style.top = Math.random() * (window.innerHeight - 100) + 'px';
  document.getElementById('smoke-texts').appendChild(clone);
  setTimeout(() => clone.remove(), 8000);
}
setInterval(showSmokeText, 5000);
setTimeout(showSmokeText, 2000);

// Подгрузка ссылок из JSON
fetch("data.json")
  .then(r => r.json())
  .then(data => {
    const buttons = document.querySelectorAll(".bubble-button");
    buttons[0].setAttribute("data-href", data.operator1);
    buttons[1].setAttribute("data-href", data.operator2);
    buttons[2].setAttribute("data-href", data.links);
  });
