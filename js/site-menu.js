(function () {
  var nav = document.getElementById('site_menu_nav');
  var toggle = document.getElementById('site_menu_toggle');
  var MOBILE_BP = 992;

  if (!nav || !toggle) {
    return;
  }

  function isMobile() {
    return window.innerWidth < MOBILE_BP;
  }

  function openMenu() {
    nav.classList.add('is-open');
    toggle.classList.add('is-active');
    document.documentElement.classList.add('site-menu-open');
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-active');
    document.documentElement.classList.remove('site-menu-open');
    nav.querySelectorAll('.site__menu-item--has-sub.is-open').forEach(function (item) {
      item.classList.remove('is-open');
    });
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

  document.querySelectorAll('.site__menu-cta[href="#contacts-section"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.getElementById('contacts-section');
      if (!target) {
        return;
      }
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
