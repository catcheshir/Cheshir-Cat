// Следящий курсор
document.addEventListener('mousemove', (e) => {
  const cursor = document.querySelector('.custom-cursor');
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
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

    // Эффект при клике
    button.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.add('clicked');
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);

      // Переход по JSON-ссылке (задержка 0.5 сек)
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

// Подгрузка ссылок из JSON
fetch("data.php")
  .then(r => r.json())
  .then(data => {
    const buttons = document.querySelectorAll(".bubble-button");
    buttons[0].setAttribute("data-href", data.operator1);
    buttons[1].setAttribute("data-href", data.operator2);
    buttons[2].setAttribute("data-href", data.links);
  });
