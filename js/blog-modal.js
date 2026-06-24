(function () {
  var modal = document.getElementById('blog_modal');
  var dialog = modal && modal.querySelector('.blog-modal__dialog');
  var dragHandle = modal && modal.querySelector('.line__box');
  var imageEl = document.getElementById('blog_modal_image');
  var dateEl = document.getElementById('blog_modal_date');
  var titleEl = document.getElementById('blog_modal_title');
  var articleEl = document.getElementById('blog_modal_article');
  var closeBtn = document.getElementById('blog_modal_close');
  var ctaBtn = document.getElementById('blog_modal_cta');
  var items = Array.prototype.slice.call(document.querySelectorAll('.js-blog-open'));

  if (!modal || !dialog || !items.length) {
    return;
  }

  var dragStartY = 0;
  var dragDeltaY = 0;
  var isDragging = false;
  var DRAG_CLOSE_THRESHOLD = 120;

  function getItemData(item) {
    var topEl = item.querySelector('.blog_item_top');
    var style = (topEl && topEl.getAttribute('style')) || '';
    var imageMatch = style.match(/url\(([^)]+)\)/);
    var source = item.querySelector('.blog-modal__source');
    var content = '';

    if (source && source.content) {
      var wrapper = document.createElement('div');
      wrapper.appendChild(source.content.cloneNode(true));
      content = wrapper.innerHTML;
    } else if (source) {
      content = source.innerHTML;
    }

    return {
      image: imageMatch ? imageMatch[1].replace(/['"]/g, '') : '',
      date: ((item.querySelector('.date') || {}).textContent || '').trim(),
      title: ((item.querySelector('.blog_item_bottom .text') || {}).textContent || '').trim(),
      content: content,
    };
  }

  function resetDialogPosition() {
    dialog.classList.remove('is-snap-back', 'is-dismiss');
    dialog.style.transform = '';
  }

  function openModal(item) {
    var data = getItemData(item);

    resetDialogPosition();
    imageEl.src = data.image;
    imageEl.alt = data.title;
    dateEl.textContent = data.date;
    titleEl.textContent = data.title;
    articleEl.innerHTML = data.content;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('blog-modal-open');
    dialog.scrollTop = 0;
    var body = modal.querySelector('.blog-modal__body');
    if (body) {
      body.scrollTop = 0;
    }
  }

  function closeModal() {
    modal.classList.remove('is-open', 'is-dragging');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('blog-modal-open');
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

  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(item);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.querySelector('.blog-modal__overlay').addEventListener('click', closeModal);

  ctaBtn.addEventListener('click', function () {
    closeModal();
  });

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

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) {
      return;
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });
})();
