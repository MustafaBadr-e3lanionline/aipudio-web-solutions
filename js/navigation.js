/**
 * Aipudio Web Solutions - Navigation & Header Controller
 * إدارة القائمة المتجاوبة، حالة التمرير، وتحديد الرابط النشط
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initActiveNavLink();
  initHeaderScrollEffect();
});

/**
 * 1. التحكم في قائمة الموبايل (فتح / إغلاق / إمكانية الوصول)
 */
function initMobileNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav .nav-link, .site-nav .btn');

  if (!menuToggle || !siteNav) return;

  const toggleMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !siteNav.classList.contains('open');
    
    siteNav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // تبديل شكل أيقونة القائمة (هامبرجر <-> إغلاق)
    const iconSvg = menuToggle.querySelector('svg');
    if (iconSvg) {
      if (isOpen) {
        iconSvg.innerHTML = `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
      } else {
        iconSvg.innerHTML = `<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
      }
    }
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // إغلاق القائمة عند النقر على أي رابط بداخلها
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // إغلاق القائمة عند الضغط على مفتاح Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // إغلاق القائمة عند تكبير الشاشة للكمبيوتر
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && siteNav.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/**
 * 2. تفعيل الكلاس active على رابط الصفحة الحالية تلقائياً
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';
    
    if (linkPath === currentPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 3. إضافة تأثير ظل مكثف للهيدر عند النزول في الصفحة
 */
function initHeaderScrollEffect() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.45)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}
