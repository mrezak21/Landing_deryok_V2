(function () {
  var nav = document.getElementById('site_menu_nav');
  var toggle = document.getElementById('site_menu_toggle');
  var MOBILE_BP = 992;

  function isMobile() {
    return window.innerWidth < MOBILE_BP;
  }

  function closeMenu() {
    if (!nav || !toggle) {
      return;
    }

    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    document.documentElement.classList.remove('site-menu-open');
    nav.querySelectorAll('.site__menu-item--has-sub.is-open').forEach(function (item) {
      item.classList.remove('is-open');
    });
  }

  function closeOpenModals() {
    var storyModal = document.getElementById('story_modal');
    var blogModal = document.getElementById('blog_modal');
    var storyClose = document.getElementById('story_modal_close');
    var blogClose = document.getElementById('blog_modal_close');

    if (storyModal && storyModal.classList.contains('is-open') && storyClose) {
      storyClose.click();
    }

    if (blogModal && blogModal.classList.contains('is-open') && blogClose) {
      blogClose.click();
    }
  }

  function scrollToContacts() {
    var target = document.getElementById('contacts-section');
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#contacts-section"]');
    if (!link) {
      return;
    }

    e.preventDefault();
    closeMenu();
    closeOpenModals();
    scrollToContacts();
  });

  if (!nav || !toggle) {
    return;
  }

  function openMenu() {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    document.documentElement.classList.add('site-menu-open');
  }

  toggle.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll('.site__menu-parent').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (!isMobile()) {
        return;
      }
      e.preventDefault();
      var item = link.closest('.site__menu-item--has-sub');
      if (!item) {
        return;
      }
      var isOpen = item.classList.contains('is-open');
      nav.querySelectorAll('.site__menu-item--has-sub.is-open').forEach(function (el) {
        if (el !== item) {
          el.classList.remove('is-open');
        }
      });
      item.classList.toggle('is-open', !isOpen);
    });
  });

  nav.querySelectorAll('.site__menu-item--has-sub').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (isMobile()) {
        return;
      }
      item.classList.add('is-open');
    });
    item.addEventListener('mouseleave', function () {
      if (isMobile()) {
        return;
      }
      item.classList.remove('is-open');
    });
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
})();
