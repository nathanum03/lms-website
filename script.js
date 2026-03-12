// ===================================
// Little Mountain Sushi - Script
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');
  var navbar = document.getElementById('navbar');
  var menuCategories = document.querySelectorAll('.menu-category');
  var tabButtons = document.querySelectorAll('.tab-btn');

  // ---- MENU MODAL ----
  var menuModal = document.getElementById('menu-modal');
  var heroMenuBtn = document.getElementById('hero-menu-btn');
  var navMenuBtn = document.getElementById('nav-menu-btn');
  var menuCloseBtn = document.getElementById('menu-modal-close');

  function openMenu(e) {
    if (e) e.preventDefault();
    menuModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Close mobile nav if open
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function closeMenu() {
    menuModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  heroMenuBtn.addEventListener('click', openMenu);
  navMenuBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);

  // Close modal when clicking the dark overlay (not the modal itself)
  menuModal.addEventListener('click', function (e) {
    if (e.target === menuModal) {
      closeMenu();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuModal.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---- HIGHLIGHT ACTIVE TAB ON SCROLL ----
  var modalBody = document.querySelector('.menu-modal-body');
  var tabsWrapper = document.querySelector('.menu-tabs-wrapper');
  var isTabClicking = false;

  function updateActiveTab() {
    if (isTabClicking) return;
    var bodyRect = modalBody.getBoundingClientRect();
    var tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
    var checkPoint = bodyRect.top + tabsHeight + 20;

    var activeCategory = null;
    menuCategories.forEach(function (cat) {
      var catRect = cat.getBoundingClientRect();
      if (catRect.top <= checkPoint) {
        activeCategory = cat.getAttribute('data-category');
      }
    });

    if (activeCategory) {
      tabButtons.forEach(function (btn) {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === activeCategory) {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }
  }

  var tabScrollRAF;
  modalBody.addEventListener('scroll', function () {
    if (tabScrollRAF) cancelAnimationFrame(tabScrollRAF);
    tabScrollRAF = requestAnimationFrame(updateActiveTab);
  });

  // ---- NAVBAR SHADOW ON SCROLL ----
  function updateNavbar() {
    if (window.pageYOffset > 20) {
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.25)';
    } else {
      navbar.style.boxShadow = '0 1px 0 rgba(255, 255, 255, 0.04)';
    }
  }

  // ---- MOBILE HAMBURGER MENU ----
  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    // Skip the menu button — it has its own handler
    if (link.id === 'nav-menu-btn') return;
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- SMOOTH SCROLLING ----
  document.querySelectorAll('.nav-links a, .btn-cta').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ---- MENU CATEGORY TABS ----
  // All categories are always visible. Tabs scroll to the selected category.
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-target');

      // Suppress scroll-based tab highlighting while we programmatically scroll
      isTabClicking = true;

      tabButtons.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      if (target === 'all') {
        modalBody.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        var category = document.querySelector('.menu-category[data-category="' + target + '"]');
        if (category && modalBody) {
          var bodyRect = modalBody.getBoundingClientRect();
          var catRect = category.getBoundingClientRect();
          var tabsHeight = tabsWrapper ? tabsWrapper.offsetHeight : 0;
          var scrollTarget = modalBody.scrollTop + (catRect.top - bodyRect.top) - tabsHeight;
          modalBody.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }
      }

      // Re-enable scroll-based highlighting after the smooth scroll finishes
      setTimeout(function () { isTabClicking = false; }, 800);
    });
  });

  // ---- ACTIVE NAV HIGHLIGHTING ON SCROLL ----
  var sections = document.querySelectorAll('section, footer');
  var navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollPos = window.pageYOffset + 120;
    sections.forEach(function (section) {
      var id = section.getAttribute('id');
      if (!id) return;
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  var scrollRAF;
  window.addEventListener('scroll', function () {
    if (scrollRAF) cancelAnimationFrame(scrollRAF);
    scrollRAF = requestAnimationFrame(function () {
      updateNavbar();
      updateActiveNav();
    });
  });

  updateActiveNav();
  updateNavbar();
});
