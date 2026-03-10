(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initTodo();
    initGuess();
  });

  function initCarousel() {
    var carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    var track = carousel.querySelector('.carousel-track');
    var slides = Array.from(carousel.querySelectorAll('.slide'));
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var index = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Đến slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.from(dotsWrap.querySelectorAll('button'));

    function render() {
      track.style.transform = 'translateX(-' + index * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function goTo(i) {
      if (i < 0) index = slides.length - 1;
      else if (i >= slides.length) index = 0;
      else index = i;
      render();
    }

    function restartAuto() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(index + 1); }, 3000);
    }

    prevBtn.addEventListener('click', function () {
      goTo(index - 1);
      restartAuto();
    });

    nextBtn.addEventListener('click', function () {
      goTo(index + 1);
      restartAuto();
    });

    render();
    restartAuto();
  }

  function initTodo() {
    var form = document.getElementById('todo-form');
    if (!form) return;

    var input = document.getElementById('todo-input');
    var listEl = document.getElementById('todo-list');
    var statusEl = document.getElementById('todo-status');
    var storageKey = 'todo-231A011034';
    var todos = [];

    try {
      var raw = localStorage.getItem(storageKey);
      todos = raw ? JSON.parse(raw) : [];
    } catch (e) {
      todos = [];
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;

      todos.unshift({
        id: Date.now(),
        text: text,
        done: false
      });
      input.value = '';
      saveAndRender();
    });

    function saveAndRender() {
      localStorage.setItem(storageKey, JSON.stringify(todos));
      renderTodo();
    }

    function renderTodo() {
      listEl.innerHTML = '';
      if (todos.length === 0) {
        statusEl.textContent = 'Chưa có công việc nào.';
        return;
      }

      var doneCount = todos.filter(function (item) { return item.done; }).length;
      statusEl.textContent = 'Tổng: ' + todos.length + ' | Hoàn thành: ' + doneCount;

      todos.forEach(function (item) {
        var li = document.createElement('li');
        li.className = 'todo-item' + (item.done ? ' done' : '');

        var check = document.createElement('input');
        check.type = 'checkbox';
        check.checked = item.done;
        check.addEventListener('change', function () {
          item.done = check.checked;
          saveAndRender();
        });

        var text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = item.text;

        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn-delete';
        del.textContent = 'Xóa';
        del.addEventListener('click', function () {
          todos = todos.filter(function (t) { return t.id !== item.id; });
          saveAndRender();
        });

        li.appendChild(check);
        li.appendChild(text);
        li.appendChild(del);
        listEl.appendChild(li);
      });
    }

    renderTodo();
  }

  function initGuess() {
    var box = document.getElementById('guess-game');
    if (!box) return;

    var input = document.getElementById('guess-input');
    var guessBtn = document.getElementById('guess-btn');
    var resetBtn = document.getElementById('reset-btn');
    var msg = document.getElementById('guess-message');
    var countEl = document.getElementById('guess-count');
    var confetti = document.getElementById('confetti');

    var secret = randomInt(1, 100);
    var attempts = 0;

    for (var i = 0; i < 24; i++) {
      var piece = document.createElement('span');
      piece.style.left = (i * 4.2) + '%';
      piece.style.background = 'hsl(' + Math.floor(Math.random() * 360) + ', 85%, 55%)';
      piece.style.animationDelay = (i * 0.03) + 's';
      confetti.appendChild(piece);
    }

    guessBtn.addEventListener('click', check);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') check();
    });
    resetBtn.addEventListener('click', resetGame);

    function check() {
      var value = Number(input.value);
      if (!Number.isInteger(value) || value < 1 || value > 100) {
        setMessage('Nhập số nguyên từ 1 đến 100.', false);
        return;
      }

      attempts += 1;
      countEl.textContent = String(attempts);

      if (value === secret) {
        setMessage('Chính xác! Bạn đã đoán đúng.', true);
        confetti.classList.remove('play');
        void confetti.offsetWidth;
        confetti.classList.add('play');
      } else if (value < secret) {
        setMessage('Số bạn đoán nhỏ hơn kết quả.', false);
      } else {
        setMessage('Số bạn đoán lớn hơn kết quả.', false);
      }
    }

    function resetGame() {
      secret = randomInt(1, 100);
      attempts = 0;
      countEl.textContent = '0';
      input.value = '';
      confetti.classList.remove('play');
      setMessage('Game đã reset. Đoán lại nào.', false);
    }

    function setMessage(text, success) {
      msg.textContent = text;
      msg.classList.toggle('success', success);
    }
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();

