/**
 * Aipudio Web Solutions - FAQ Accordion & Search Controller
 * إدارة الأسئلة الشائعة حول نطاق العمل، التعديلات، والاستضافة
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initFaqSearch();
});

/**
 * 1. فتح وإغلاق عناصر الأسئلة الشائعة (Accordion)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    // ضبط خصائص الوصول الافتراضية
    const isInitiallyActive = item.classList.contains('active');
    trigger.setAttribute('aria-expanded', isInitiallyActive ? 'true' : 'false');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // إغلاق باقي الأسئلة المفتوحة للحفاظ على نظافة الشاشة
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // تبديل حالة العنصر الحالي
      item.classList.toggle('active', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });
}

/**
 * 2. فلترة الأسئلة الشائعة بالبحث المباشر (في صفحة /faq/)
 */
function initFaqSearch() {
  const searchInput = document.querySelector('#faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');
  const emptyNotice = document.querySelector('#faqEmptyState');

  if (!searchInput || !faqItems.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    let visibleCount = 0;

    faqItems.forEach((item) => {
      const questionText = item.querySelector('.faq-trigger')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.faq-content')?.textContent.toLowerCase() || '';
      const matches = questionText.includes(query) || answerText.includes(query);

      if (matches) {
        item.style.display = 'block';
        visibleCount++;
        // فتح السؤال تلقائياً إذا كان هناك نص بحث مطابق
        if (query.length > 2) {
          item.classList.add('active');
        }
      } else {
        item.style.display = 'none';
      }
    });

    if (emptyNotice) {
      emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}
