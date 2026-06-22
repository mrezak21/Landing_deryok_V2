(function () {
  var modal = document.getElementById('story_modal');
  var video = document.getElementById('story_modal_video');
  var titleEl = document.getElementById('story_modal_title');
  var textEl = document.getElementById('story_modal_text');
  var closeBtn = document.getElementById('story_modal_close');
  var prevBtn = document.getElementById('story_modal_prev');
  var nextBtn = document.getElementById('story_modal_next');
  var ctaBtn = document.getElementById('story_modal_cta');
  var items = Array.prototype.slice.call(document.querySelectorAll('.js-story-open'));

  if (!modal || !items.length) {
    return;
  }

  var currentIndex = 0;

  function getItemData(item) {
    return {
      video: item.getAttribute('data-video') || '',
      country: (item.querySelector('.country') || {}).textContent || '',
      text: (item.querySelector('.text') || {}).textContent || '',
      poster: ((item.getAttribute('style') || '').match(/url\(([^)]+)\)/) || [])[1] || '',
    };
  }

  function showSlide(index) {
    if (!items.length) {
      return;
    }

    if (index < 0) {
      index = items.length - 1;
    }
    if (index >= items.length) {
      index = 0;
    }

    currentIndex = index;
    var data = getItemData(items[currentIndex]);

    titleEl.textContent = data.country.trim();
    textEl.textContent = data.text.trim();

    video.pause();
    video.removeAttribute('src');
    video.load();

    if (data.poster) {
      video.setAttribute('poster', data.poster.replace(/['"]/g, ''));
    } else {
      video.removeAttribute('poster');
    }

    if (data.video) {
      video.src = data.video;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }
  }

  function openModal(index) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('story-modal-open');
    showSlide(index);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('story-modal-open');
    video.pause();
    video.removeAttribute('src');
    video.load();
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(index);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.querySelector('.story-modal__overlay').addEventListener('click', closeModal);

  prevBtn.addEventListener('click', function () {
    showSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    showSlide(currentIndex + 1);
  });

  ctaBtn.addEventListener('click', function () {
    closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) {
      return;
    }
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'ArrowRight') {
      showSlide(currentIndex - 1);
    }
    if (e.key === 'ArrowLeft') {
      showSlide(currentIndex + 1);
    }
  });
})();
