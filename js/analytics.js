/**
 * Aipudio Web Solutions - Conversion & Funnel Analytics
 * تتبع نقرات الباقات، تحويلات واتساب، ومسار العميل داخل الموقع
 */

document.addEventListener('DOMContentLoaded', () => {
  recordLandingSource();
  trackPackageClicks();
  trackWhatsAppConversions();
  trackFormSubmissions();
});

/**
 * 1. حفظ مصدر الزيارة الأول للعميل (UTM Parameters / Referrer)
 */
function recordLandingSource() {
  try {
    if (!sessionStorage.getItem('aipudio_entry_page')) {
      sessionStorage.setItem('aipudio_entry_page', window.location.pathname);
      sessionStorage.setItem('aipudio_entry_time', new Date().toISOString());
    }
  } catch (e) {
    // تجاهل أخطاء التخزين في وضع التصفح الخفي المقيد
  }
}

/**
 * 2. دالة موحدة لإرسال الأحداث لمنصات التحليلات (GA4 / Meta Pixel / DataLayer)
 */
function dispatchTrackingEvent(eventName, eventData = {}) {
  const payload = {
    ...eventData,
    page_path: window.location.pathname,
    timestamp: new Date().toISOString()
  };

  // إرسال إلى Google Analytics 4 إن وجد
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  // إرسال إلى Meta Pixel إن وجد
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, payload);
  }

  // إرسال إلى Google Tag Manager dataLayer إن وجد
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }
}

/**
 * 3. تتبع اختيار الباقات (موقع تعريفي / متجر / حجز)
 */
function trackPackageClicks() {
  const packageLinks = document.querySelectorAll('a[href*="package="], [data-track-package]');

  packageLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const packageType = link.getAttribute('data-track-package') || link.getAttribute('href');
      dispatchTrackingEvent('select_launch_package', {
        package_type: packageType,
        offer_price: 2000,
        currency: 'EGP'
      });
    });
  });
}

/**
 * 4. تتبع نقرات الواتساب المباشرة
 */
function trackWhatsAppConversions() {
  const waButtons = document.querySelectorAll('[data-whatsapp-quick], .floating-whatsapp, .btn-whatsapp');

  waButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      dispatchTrackingEvent('whatsapp_click', {
        button_location: btn.classList.contains('floating-whatsapp') ? 'floating_widget' : 'inline_cta'
      });
    });
  });
}

/**
 * 5. تتبع إرسال نموذج بدء المشروع
 */
function trackFormSubmissions() {
  const projectForm = document.querySelector('#startProjectForm');
  if (!projectForm) return;

  projectForm.addEventListener('submit', () => {
    const selectedPackage = projectForm.querySelector('[name="package"]')?.value || 'unspecified';
    dispatchTrackingEvent('generate_lead_whatsapp', {
      package_selected: selectedPackage,
      value: 2000,
      currency: 'EGP'
    });
  });
}
