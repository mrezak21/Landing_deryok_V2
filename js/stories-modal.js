(function () {
  var modal = document.getElementById('story_modal');
  var dialog = modal && modal.querySelector('.story-modal__dialog');
  var dragHandle = modal && modal.querySelector('.line__box');
  var video = document.getElementById('story_modal_video');
  var titleEl = document.getElementById('story_modal_title');
  var textEl = document.getElementById('story_modal_text');
  var closeBtn = document.getElementById('story_modal_close');
  var prevBtn = document.getElementById('story_modal_prev');
  var nextBtn = document.getElementById('story_modal_next');
  var ctaBtn = document.getElementById('story_modal_cta');
  var items = Array.prototype.slice.call(document.querySelectorAll('.js-story-open'));

  if (!modal || !dialog || !items.length) {
    return;
  }

  var currentIndex = 0;
  var dragStartY = 0;
  var dragDeltaY = 0;
  var isDragging = false;
  var DRAG_CLOSE_THRESHOLD = 120;

  function getItemData(item) {
    return {
      video: item.getAttribute('data-video') || '',
      country: (item.querySelector('.country') || {}).textContent || '',
      text: (item.querySelector('.text') || {}).textContent || '',
      poster: ((item.getAttribute('style') || '').match(/url\(([^)]+)\)/) || [])[1] || '',
    };
  }

  function resetDialogPosition() {
    dialog.classList.remove('is-snap-back', 'is-dismiss');
    dialog.style.transform = '';
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
    resetDialogPosition();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('story-modal-open');
    showSlide(index);
  }

  function closeModal() {
    modal.classList.remove('is-open', 'is-dragging');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('story-modal-open');
    video.pause();
    video.removeAttribute('src');
    video.load();
    resetDialogPosition();
  }

  function setDialogTranslate(y) {
    dialog.style.transform = 'translateY(' + y + 'px)';
  }

  function onDragStart(clientY) {
    if (!modal.classList.contains('is-open')) {
      return;
    }

    isDragging = true;
    dragStartY = clientY;
    dragDeltaY = 0;
    modal.classList.add('is-dragging');
    dialog.classList.remove('is-snap-back', 'is-dismiss');
  }

  function onDragMove(clientY) {
    if (!isDragging) {
      return;
    }

    dragDeltaY = Math.max(0, clientY - dragStartY);
    setDialogTranslate(dragDeltaY);
  }

  function onDragEnd() {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    modal.classList.remove('is-dragging');

    if (dragDeltaY >= DRAG_CLOSE_THRESHOLD) {
      dialog.classList.add('is-dismiss');
      setDialogTranslate(window.innerHeight);
      window.setTimeout(closeModal, 280);
      return;
    }

    dialog.classList.add('is-snap-back');
    setDialogTranslate(0);
    window.setTimeout(resetDialogPosition, 280);
  }

  if (dragHandle) {
    dragHandle.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) {
        return;
      }
      onDragStart(e.touches[0].clientY);
    }, { passive: true });

    dragHandle.addEventListener('touchmove', function (e) {
      if (!isDragging || e.touches.length !== 1) {
        return;
      }
      e.preventDefault();
      onDragMove(e.touches[0].clientY);
    }, { passive: false });

    dragHandle.addEventListener('touchend', onDragEnd);
    dragHandle.addEventListener('touchcancel', onDragEnd);

    dragHandle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      onDragStart(e.clientY);

      function onMouseMove(ev) {
        onDragMove(ev.clientY);
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        onDragEnd();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
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
