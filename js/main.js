/**
 * Aipudio Web Solutions - Main Application Script
 * الإعدادات المركزية وتهيئة الموقع
 */

const AIPUDIO_CONFIG = {
  whatsappNumber: '201005825888', // استبدله برقم واتساب الشركة الرسمي بالصيغة الدولية بدون +
  brandName: 'Aipudio',
  launchOffer: {
    active: true,
    price: '2,500 ج.م',
    originalPrice: '4,000 ج.م',
    totalSlots: 20,
    remainingSlots: 15 // يمكنك تعديل الرقم لإظهار ندرة العرض الحقيقية
  },
  packages: {
    'business-website': {
      title: 'باقة الموقع التعريفي (Business Website Starter)',
      price: '2,500 ج.م',
      scopeSummary: 'حتى 5 صفحات بسيطة + متجاوب للموبايل + ربط واتساب ونموذج تواصل'
    },
    'ecommerce': {
      title: 'باقة المتجر الإلكتروني (E-commerce Starter)',
      price: '2,500 ج.م',
      scopeSummary: 'حتى 5 صفحات أساسية للمتجر + إضافة حتى 10 منتجات عند التسليم + طلب مباشر'
    },
    'booking': {
      title: 'باقة صفحة الحجز (Booking Page Starter)',
      price: '2,500 ج.م',
      scopeSummary: 'صفحة هبوط متكاملة للحجز + عرض الخدمات والمواعيد + استلام طلبات الحجز'
    }
  }
};

// تصدير الإعدادات لنافذة المتصفح لتقرأها باقي الملفات
window.AIPUDIO_CONFIG = AIPUDIO_CONFIG;

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initSmoothScroll();
  initFloatingWhatsApp();
  initSlotsCounter();
});

/**
 * 1. تحديث سنة حقوق النشر تلقائياً في الفوتر
 */
function initDynamicYear() {
  const yearElements = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });
}

/**
 * 2. تمرير سلس للروابط الداخلية (Anchor Links)
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 3. تهيئة زر الواتساب العائم وأزرار الاستفسار السريع
 */
function initFloatingWhatsApp() {
  const quickWhatsappLinks = document.querySelectorAll('[data-whatsapp-quick]');
  
  quickWhatsappLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customMsg = btn.getAttribute('data-whatsapp-msg') || 
        'مرحباً فريق Aipudio، أرغب في الاستفسار عن عرض الإطلاق (2,500 ج.م) لتصميم موقع إلكتروني.';
      
      const encodedMsg = encodeURIComponent(customMsg);
      const waUrl = `https://wa.me/${AIPUDIO_CONFIG.whatsappNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });
}

/**
 * 4. تحديث عداد المشاريع المتبقية في الحملة الترويجية (إن وجد في الصفحة)
 */
function initSlotsCounter() {
  const slotBadges = document.querySelectorAll('[data-remaining-slots]');
  slotBadges.forEach(badge => {
    badge.textContent = AIPUDIO_CONFIG.launchOffer.remainingSlots;
  });
}
