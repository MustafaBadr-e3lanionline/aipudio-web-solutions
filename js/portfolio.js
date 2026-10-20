/**
 * Aipudio Web Solutions - Portfolio Filtering & Showcase Engine
 * فلترة نماذج الأعمال حسب الباقات الثلاث (موقع تعريفي / متجر إلكتروني / صفحة حجز)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilter();
});

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-category]');
  const countBadge = document.querySelector('[data-portfolio-count]');

  if (!filterBtns.length || !portfolioCards.length) return;

  const applyFilter = (category) => {
    let visibleItems = 0;

    // تحديث حالة الأزرار
    filterBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-filter') === category;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    // إظهار أو إخفاء المشاريع مع تأثير بصري ناعم
    portfolioCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'all' || cardCategory === category;

      if (shouldShow) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        visibleItems++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 180);
      }
    });

    if (countBadge) {
      countBadge.textContent = visibleItems;
    }
  };

  // ربط النقر على أزرار الفلتر
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');
      applyFilter(selectedCategory);
    });
  });

  // قراءة الفلتر من الرابط إذا زار العميل مثلاً: /portfolio?category=ecommerce
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category');
  if (initialCategory) {
    const validBtn = Array.from(filterBtns).some(
      (b) => b.getAttribute('data-filter') === initialCategory
    );
    if (validBtn) {
      applyFilter(initialCategory);
    }
  }
}
