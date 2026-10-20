/**
 * Aipudio Web Solutions - Forms & WhatsApp Lead Engine
 * معالجة نماذج بدء المشروع والتواصل، والتحويل المباشر لرسائل واتساب مهيكلة
 */

document.addEventListener('DOMContentLoaded', () => {
  autoSelectPackageFromURL();
  initProjectStartForm();
  initSimpleContactForm();
});

/**
 * 1. تحديد الباقة تلقائياً إذا جاء العميل من صفحة التسعير أو الخدمات
 * مثال الرابط: /start-project?package=business-website
 */
function autoSelectPackageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPkg = urlParams.get('package') || urlParams.get('plan');

  if (!selectedPkg) return;

  // في حال كان الاختيار عبر قائمة منسدلة Select
  const packageSelect = document.querySelector('#packageSelect');
  if (packageSelect) {
    const optionExists = Array.from(packageSelect.options).some(opt => opt.value === selectedPkg);
    if (optionExists) {
      packageSelect.value = selectedPkg;
      updateScopeSummaryPreview(selectedPkg);
    }
  }

  // في حال كان الاختيار عبر أزرار راديو Radio Cards
  const packageRadio = document.querySelector(`input[name="package"][value="${selectedPkg}"]`);
  if (packageRadio) {
    packageRadio.checked = true;
    updateScopeSummaryPreview(selectedPkg);
  }
}

/**
 * تحديث ملخص النطاق المعروض للعميل داخل صفحة النموذج لحظياً عند تغيير الباقة
 */
function updateScopeSummaryPreview(packageKey) {
  const previewBox = document.querySelector('#scopePreviewBox');
  const config = window.AIPUDIO_CONFIG;

  if (!previewBox || !config || !config.packages[packageKey]) return;

  const pkg = config.packages[packageKey];
  previewBox.innerHTML = `
    <div style="padding: 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: 10px; margin-top: 0.5rem;">
      <strong style="color: #60a5fa; display: block; margin-bottom: 0.25rem;">${pkg.title} —${pkg.price}</strong>
      <span style="font-size: 0.9rem; color: #cbd5e1;">النطاق المشمول: ${pkg.scopeSummary}</span>
    </div>
  `;
}

/**
 * 2. معالجة نموذج "ابدأ مشروعك" الرئيسي (#startProjectForm)
 */
function initProjectStartForm() {
  const form = document.querySelector('#startProjectForm');
  if (!form) return;

  // الاستماع لتغيير الباقة لتحديث ملخص النطاق
  const packageSelect = form.querySelector('#packageSelect');
  if (packageSelect) {
    packageSelect.addEventListener('change', (e) => {
      updateScopeSummaryPreview(e.target.value);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // استخراج القيم
    const clientName = form.querySelector('[name="clientName"]')?.value.trim();
    const clientPhone = form.querySelector('[name="clientPhone"]')?.value.trim();
    const businessName = form.querySelector('[name="businessName"]')?.value.trim() || 'غير محدد';
    const packageKey = form.querySelector('[name="package"]')?.value;
    const contentReady = form.querySelector('[name="contentReady"]')?.value || 'نعم، سأوفر النصوص والصور';
    const projectNotes = form.querySelector('[name="projectNotes"]')?.value.trim() || 'لا توجد ملاحظات إضافية';
    const scopeAgreed = form.querySelector('[name="scopeAgreed"]')?.checked;

    // جمع الإضافات الاختيارية (Add-ons) التي تُسعّر منفصلاً
    const selectedAddons = [];
    form.querySelectorAll('input[name="addons"]:checked').forEach(checkbox => {
      selectedAddons.push(checkbox.value);
    });

    // التحقق من المدخلات الأساسية
    if (!clientName || !clientPhone || !packageKey) {
      showFormError(form, 'يرجى استكمال الاسم، رقم الهاتف، واختيار الباقة المطلوبة.');
      return;
    }

    if (!isValidPhone(clientPhone)) {
      showFormError(form, 'يرجى إدخال رقم هاتف أو واتساب صحيح مكون من 10 إلى 15 رقماً.');
      return;
    }

    if (form.querySelector('[name="scopeAgreed"]') && !scopeAgreed) {
      showFormError(form, 'يرجى الموافقة على نطاق العمل المحدد للباقة قبل إرسال الطلب.');
      return;
    }

    clearFormError(form);

    // جلب تفاصيل الباقة من الإعدادات
    const config = window.AIPUDIO_CONFIG;
    const pkgInfo = config?.packages[packageKey] || {
      title: packageKey,
      price: '2,000 ج.م',
      scopeSummary: 'حسب النطاق الأساسي المعتمد'
    };

    const addonsText = selectedAddons.length > 0 
      ? selectedAddons.join(' + ') 
      : 'لا يوجد (الاكتفاء بالنطاق الأساسي للعرض)';

    // بناء رسالة واتساب احترافية تحمي نطاق العمل وتوضح طلب العميل بدقة
    const whatsappMessage = [
      `مرحباً فريق *Aipudio*، أرغب في حجز مقعد ضمن عرض الإطلاق:`,
      `────────────────────`,
      `*بيانات العميل:*`,
      `• الاسم: ${clientName}`,
      `• رقم التواصل: ${clientPhone}`,
      `• اسم النشاط/الشركة: ${businessName}`,
      ``,
      `*تفاصيل الباقة المختارة:*`,
      `• الباقة: ${pkgInfo.title}`,
      `• سعر العرض: ${pkgInfo.price} (بدلاً من 4,000 ج.م)`,
      `• النطاق الأساسي: ${pkgInfo.scopeSummary}`,
      ``,
      `*جاهزية المحتوى والإضافات:*`,
      `• المحتوى والصور: ${contentReady}`,
      `• خدمات إضافية مطلوبة (تُسعّر منفصلاً): ${addonsText}`,
      ``,
      `*نبذة عن المشروع:*`,
      `${projectNotes}`,
      `────────────────────`,
      `✅ اطلعت على نطاق العمل المشمول في الباقة وأوافق عليه.`
    ].join('\n');

    const waNumber = config?.whatsappNumber || '201000000000';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // فتح واتساب
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });
}

/**
 * 3. معالجة نموذج التواصل العام البسيط (#contactForm) في صفحة اتصل بنا
 */
function initSimpleContactForm() {
  const contactForm = document.querySelector('#contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('[name="name"]')?.value.trim();
    const phone = contactForm.querySelector('[name="phone"]')?.value.trim();
    const subject = contactForm.querySelector('[name="subject"]')?.value.trim() || 'استفسار عام';
    const message = contactForm.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone || !message) {
      showFormError(contactForm, 'يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    clearFormError(contactForm);

    const whatsappMessage = [
      `مرحباً فريق *Aipudio* (رسالة من صفحة تواصل معنا):`,
      `• الاسم: ${name}`,
      `• الهاتف: ${phone}`,
      `• الموضوع: ${subject}`,
      `• الرسالة: ${message}`
    ].join('\n');

    const waNumber = window.AIPUDIO_CONFIG?.whatsappNumber || '201000000000';
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
  });
}

/**
 * دوال مساعدة للتحقق وعرض رسائل التنبيه داخل النموذج
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function showFormError(form, message) {
  let errorBox = form.querySelector('.form-error-banner');
  if (!errorBox) {
    errorBox = document.createElement('div');
    errorBox.className = 'form-error-banner';
    errorBox.style.cssText = 'background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; font-weight: 600;';
    form.prepend(errorBox);
  }
  errorBox.textContent = message;
  errorBox.style.display = 'block';
}

function clearFormError(form) {
  const errorBox = form.querySelector('.form-error-banner');
  if (errorBox) {
    errorBox.style.display = 'none';
  }
}
