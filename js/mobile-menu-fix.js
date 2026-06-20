(function ($) {
  function isMobileMenu() {
    return window.innerWidth <= 1200;
  }

  function closeMobileMenu() {
    $('html, body').removeClass('locked');
    $('#menu-close, #mobile_btn').removeClass('opened');
    $('#menu_wrap').stop(true, true).fadeOut(200);
    $('.top_panel .menu_wrap .dropdown_ul').removeClass('is-open');
    $('.top_panel .menu_wrap .dropdown_li > a').removeClass('hover');
  }

  function openMobileMenu() {
    $('#menu_wrap').stop(true, true).fadeIn(200);
    $('html, body').addClass('locked');
    $('#menu-close, #mobile_btn').addClass('opened');
  }

  $(function () {
    $('#mobile_btn').off('click').on('click', function (e) {
      e.preventDefault();
      if (!isMobileMenu()) {
        return;
      }
      if ($('#menu_wrap').is(':visible')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    $('#menu-close').off('click').on('click', function (e) {
      e.preventDefault();
      closeMobileMenu();
    });

    $('.top_panel .dropdown_li > a').off('click');

    $(document).on('click.mobileDropdown', '.top_panel .menu_wrap .dropdown_li > a', function (e) {
      if (!isMobileMenu()) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      var $link = $(this);
      var $submenu = $link.next('.dropdown_ul');
      var willOpen = !$submenu.hasClass('is-open');
      $('.top_panel .menu_wrap .dropdown_li > a').not($link).removeClass('hover');
      $('.top_panel .menu_wrap .dropdown_ul').not($submenu).removeClass('is-open');
      $link.toggleClass('hover', willOpen);
      $submenu.toggleClass('is-open', willOpen);
    });
  });
})(jQuery);
