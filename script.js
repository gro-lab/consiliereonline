// Enhanced JavaScript with Performance Optimizations and GDPR-Compliant Cookie Consent
// Consiliere Online - Complete JavaScript Module with GDPR Form Validation

// Performance: Use strict mode
'use strict';

// ===== UTILITY FUNCTIONS =====

// Debounce function for scroll performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, wait) {
    let lastTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            func.apply(this, args);
        }
    };
}

// ===== ENHANCED COOKIE CONSENT MANAGEMENT SYSTEM - GDPR COMPLIANT =====
const CookieConsent = {
    banner: null,
    settingsModal: null,
    floatingButton: null,
    isShown: false,
    preferences: {
        essential: true, // Always true
        analytics: false,
        marketing: false,
        thirdParty: false // NEW: For Formspree and other third-party services
    },
    
    init() {
        this.banner = document.getElementById('cookieBanner');
        this.settingsModal = document.getElementById('cookieSettingsModal');
        this.floatingButton = document.getElementById('cookieSettingsFloat');
        
        if (!this.banner) return;
        
        // Load saved preferences
        this.loadPreferences();
        
        // Check if user has already made a choice
        if (!this.hasConsentDecision()) {
            this.showBanner();
            this.hideFloatingButton();
        } else {
            // Apply saved preferences
            this.applyPreferences();
            this.showFloatingButton();
        }
        
        this.setupEventListeners();
    },
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem('cookiePreferences');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...prefs };
                // Ensure essential is always true
                this.preferences.essential = true;
            }
        } catch (e) {
            console.warn('Could not load cookie preferences');
        }
    },
    
    savePreferences() {
        try {
            localStorage.setItem('cookiePreferences', JSON.stringify(this.preferences));
            localStorage.setItem('cookieConsent', 'custom');
            
            // Track consent changes for GDPR compliance
            this.trackConsentChange();
        } catch (e) {
            console.warn('Could not save cookie preferences');
        }
    },
    
    hasConsentDecision() {
        try {
            const consent = localStorage.getItem('cookieConsent');
            return consent !== null;
        } catch (e) {
            return false;
        }
    },
    
    hasAccepted() {
        try {
            const consent = localStorage.getItem('cookieConsent');
            return consent === 'accepted' || (consent === 'custom' && this.preferences.analytics);
        } catch (e) {
            return false;
        }
    },
    
    hasThirdPartyConsent() {
        return this.preferences.thirdParty === true;
    },
    
    showBanner() {
        if (this.isShown || !this.banner) return;
        
        requestAnimationFrame(() => {
            this.banner.classList.add('show');
            this.isShown = true;
            
            // Trap focus in banner
            this.trapFocus();
        });
    },
    
    hideBanner() {
        if (!this.banner) return;
        
        this.banner.classList.remove('show');
        this.isShown = false;
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Show floating button after banner is hidden
        this.showFloatingButton();
    },
    
    showFloatingButton() {
        if (!this.floatingButton) return;
        
        requestAnimationFrame(() => {
            this.floatingButton.classList.add('show');
        });
    },
    
    hideFloatingButton() {
        if (!this.floatingButton) return;
        
        this.floatingButton.classList.remove('show');
    },
    
    setupEventListeners() {
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');
        const settingsBtn = document.getElementById('cookieSettings');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAllCookies());
        }
        
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectAllCookies());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Setup settings modal toggles
        const analyticsCookies = document.getElementById('analyticsCookies');
        const marketingCookies = document.getElementById('marketingCookies');
        const thirdPartyCookies = document.getElementById('thirdPartyCookies'); // NEW
        
        if (analyticsCookies) {
            analyticsCookies.checked = this.preferences.analytics;
            analyticsCookies.addEventListener('change', (e) => {
                this.preferences.analytics = e.target.checked;
            });
        }
        
        if (marketingCookies) {
            marketingCookies.checked = this.preferences.marketing;
            marketingCookies.addEventListener('change', (e) => {
                this.preferences.marketing = e.target.checked;
            });
        }
        
        // NEW: Third-party cookie toggle
        if (thirdPartyCookies) {
            thirdPartyCookies.checked = this.preferences.thirdParty;
            thirdPartyCookies.addEventListener('change', (e) => {
                this.preferences.thirdParty = e.target.checked;
                // Enable/disable form based on consent
                this.updateFormState();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isShown && e.key === 'Escape') {
                // Don't allow closing with escape - user must make a choice
                e.preventDefault();
            }
        });
    },
    
    acceptAllCookies() {
        this.preferences = {
            essential: true,
            analytics: true,
            marketing: true,
            thirdParty: true // Include third-party
        };
        
        this.savePreferences();
        
        try {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString()); // GDPR: Track consent date
        } catch (e) {
            console.warn('Could not save cookie consent');
        }
        
        this.applyPreferences();
        this.hideBanner();
        this.closeSettings();
        
        // Track the consent
        this.trackConsentGiven('accepted');
    },
    
    rejectAllCookies() {
        this.preferences = {
            essential: true,
            analytics: false,
            marketing: false,
            thirdParty: false // Reject third-party
        };
        
        this.savePreferences();
        
        try {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        } catch (e) {
            console.warn('Could not save cookie consent');
        }
        
        this.applyPreferences();
        this.hideBanner();
        this.closeSettings();
        
        // Track the consent (using essential tracking only)
        this.trackConsentGiven('rejected');
    },
    
    saveCustomPreferences() {
        this.savePreferences();
        this.applyPreferences();
        this.hideBanner();
        this.closeSettings();
        
        // Track the consent
        this.trackConsentGiven('custom');
    },
    
    applyPreferences() {
        // Apply analytics preference
        if (this.preferences.analytics) {
            this.loadAnalytics();
        } else {
            this.removeAnalytics();
        }
        
        // Apply marketing preference
        if (this.preferences.marketing) {
            this.loadMarketing();
        } else {
            this.removeMarketing();
        }
        
        // Apply third-party preference
        if (this.preferences.thirdParty) {
            this.enableThirdPartyServices();
        } else {
            this.disableThirdPartyServices();
        }
        
        // Update form state
        this.updateFormState();
    },
    
    // NEW: Enable third-party services
    enableThirdPartyServices() {
        // Enable Formspree forms
        const forms = document.querySelectorAll('form[data-requires-consent="true"]');
        forms.forEach(form => {
            form.classList.remove('consent-required');
            const inputs = form.querySelectorAll('input, textarea, button');
            inputs.forEach(input => input.disabled = false);
        });
        
        console.log('Third-party services enabled');
    },
    
    // NEW: Disable third-party services
    disableThirdPartyServices() {
        // Disable forms that require consent
        const forms = document.querySelectorAll('form[data-requires-consent="true"]');
        forms.forEach(form => {
            form.classList.add('consent-required');
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Requires Cookie Consent';
            }
        });
        
        console.log('Third-party services disabled');
    },
    
    // NEW: Update form state based on consent
    updateFormState() {
        const eventForm = document.getElementById('eventRegistrationForm');
        if (!eventForm) return;
        
        if (!this.hasThirdPartyConsent()) {
            // Show consent required message
            const consentNotice = document.createElement('div');
            consentNotice.className = 'consent-notice';
            consentNotice.innerHTML = `
                <p>
                    <span lang="ro">Pentru a utiliza acest formular, trebuie să acceptați cookie-urile terțe în </span>
                    <span lang="en">To use this form, you need to accept third-party cookies in </span>
                    <button onclick="openCookieSettings()" style="text-decoration: underline; border: none; background: none; color: #4169e1; cursor: pointer;">
                        <span lang="ro">Setări Cookie</span>
                        <span lang="en">Cookie Settings</span>
                    </button>
                </p>
            `;
            
            if (!eventForm.querySelector('.consent-notice')) {
                eventForm.insertBefore(consentNotice, eventForm.firstChild);
            }
        } else {
            // Remove consent notice if exists
            const notice = eventForm.querySelector('.consent-notice');
            if (notice) notice.remove();
        }
    },
    
    openSettings() {
        if (!this.settingsModal) return;
        
        // Update toggle states
        const analyticsCookies = document.getElementById('analyticsCookies');
        const marketingCookies = document.getElementById('marketingCookies');
        const thirdPartyCookies = document.getElementById('thirdPartyCookies');
        
        if (analyticsCookies) {
            analyticsCookies.checked = this.preferences.analytics;
        }
        
        if (marketingCookies) {
            marketingCookies.checked = this.preferences.marketing;
        }
        
        if (thirdPartyCookies) {
            thirdPartyCookies.checked = this.preferences.thirdParty;
        }
        
        requestAnimationFrame(() => {
            this.settingsModal.style.display = 'block';
            
            // Force reflow
            this.settingsModal.offsetHeight;
            
            this.settingsModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            this.settingsModal.setAttribute('tabindex', '-1');
            this.settingsModal.focus();
        });
    },
    
    closeSettings() {
        if (!this.settingsModal) return;
        
        this.settingsModal.classList.remove('show');
        
        setTimeout(() => {
            this.settingsModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    },
    
    loadAnalytics() {
        // Only load if not already loaded
        if (window.gtag) return;
        
        // Load Google Analytics 4 (GA4) dynamically
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-17401674061'; // Replace with actual GA4 ID
        script.id = 'google-analytics';
        document.head.appendChild(script);
        
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configure Google Analytics with privacy-friendly settings
            gtag('config', 'AW-17401674061', {
                'anonymize_ip': true, // GDPR compliance - anonymize IP addresses
                'cookie_flags': 'SameSite=None;Secure',
                'allow_google_signals': false, // Disable advertising features
                'allow_ad_personalization_signals': false // Disable ad personalization
            });
            
            // Custom event tracking for appointment bookings (without ads conversion)
            window.gtag_report_appointment = function(url) {
                gtag('event', 'appointment_booking', {
                    'event_category': 'engagement',
                    'event_label': 'phone_call',
                    'value': 1
                });
                if (typeof(url) != 'undefined') {
                    window.location = url;
                }
                return false;
            };
            
            console.log('Google Analytics loaded with consent');
        };
        
        script.onerror = () => {
            console.warn('Failed to load Google Analytics');
        };
    },
    
    removeAnalytics() {
        // Remove Google Analytics script if present
        const script = document.getElementById('google-analytics');
        if (script) {
            script.remove();
        }
        
        // Clear GA cookies
        this.clearCookies(['_ga', '_gid', '_gat']);
    },
    
    loadMarketing() {
        // Placeholder for marketing scripts (Facebook Pixel, Google Ads, etc.)
        console.log('Marketing cookies enabled');
    },
    
    removeMarketing() {
        // Remove marketing cookies
        // Placeholder for removing marketing scripts
        console.log('Marketing cookies disabled');
    },
    
    clearCookies(names) {
        names.forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
        });
    },
    
    // NEW: Track consent changes for GDPR audit trail
    trackConsentChange() {
        const consentHistory = {
            timestamp: new Date().toISOString(),
            preferences: this.preferences,
            action: 'preferences_updated'
        };
        
        try {
            // Store consent history (you might want to send this to your server)
            const history = JSON.parse(localStorage.getItem('consentHistory') || '[]');
            history.push(consentHistory);
            // Keep only last 10 entries
            if (history.length > 10) history.shift();
            localStorage.setItem('consentHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save consent history');
        }
    },
    
    trackConsentGiven(choice) {
        // Basic tracking without cookies (for essential analytics)
        if (navigator.sendBeacon) {
            const data = JSON.stringify({
                event: 'cookie_consent',
                choice: choice,
                preferences: this.preferences,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });
            
            // This would go to your own analytics endpoint
            // navigator.sendBeacon('/analytics/consent', data);
        }
        
        // Track in consent history
        this.trackConsentChange();
    },
    
    trapFocus() {
        if (!this.banner) return;
        
        const focusableElements = this.banner.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        this.focusTrapHandler = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', this.focusTrapHandler);
        
        // Focus first button
        if (firstFocusable) {
            firstFocusable.focus();
        }
    },
    
    removeFocusTrap() {
        if (this.focusTrapHandler) {
            document.removeEventListener('keydown', this.focusTrapHandler);
            this.focusTrapHandler = null;
        }
    }
};

// ===== GDPR FORM VALIDATION SYSTEM =====
const GDPRFormHandler = {
    init() {
        const form = document.getElementById('eventRegistrationForm');
        if (!form) return;
            this.checkThirdPartyCookies();

        // Add submit handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
        
        // Add real-time validation for consent checkboxes
        const consentCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
        consentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateConsentField(checkbox);
            });
        });
        
        // Check if third-party cookies are enabled
        this.checkThirdPartyCookies();
    },
    
    checkThirdPartyCookies() {
        if (!CookieConsent.hasThirdPartyConsent()) {
            this.showConsentRequired();
        }
    },
    
    showConsentRequired() {
        const form = document.getElementById('eventRegistrationForm');
        if (!form) return;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.setAttribute('data-original-text', originalText);
            submitBtn.innerHTML = `
                <span lang="ro">Necesită Consimțământ pentru Cookie-uri. Acceptați-le și reîmprospătați pagina.</span>
                <span lang="en">Requires Cookie Consent. Accept the cookies and reload the page.</span>
            `;
        }
    },
    
    validateConsentField(checkbox) {
        const errorId = `${checkbox.id}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!checkbox.checked) {
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.id = errorId;
                errorElement.className = 'consent-error';
                errorElement.innerHTML = `
                    <span lang="ro">Acest câmp este obligatoriu pentru conformitate GDPR</span>
                    <span lang="en">This field is required for GDPR compliance</span>
                `;
                checkbox.parentElement.appendChild(errorElement);
            }
            checkbox.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            if (errorElement) {
                errorElement.remove();
            }
            checkbox.setAttribute('aria-invalid', 'false');
            return true;
        }
    },
    
    validateAllConsents(form) {
        const consentCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
        let allValid = true;
        
        consentCheckboxes.forEach(checkbox => {
            if (!this.validateConsentField(checkbox)) {
                allValid = false;
            }
        });
        
        return allValid;
    },
    
    handleSubmit(form) {
        // Clear previous errors
        const errorContainer = document.getElementById('formErrors');
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
        }
        
        // Check if third-party cookies are enabled
        if (!CookieConsent.hasThirdPartyConsent()) {
            this.showError('form', 'third_party_cookies_required');
            return;
        }
        
        // Validate all consent checkboxes
        if (!this.validateAllConsents(form)) {
            this.showError('form', 'missing_consents');
            return;
        }
        
        // Validate email
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput || !emailInput.value) {
            this.showError('email', 'required');
            return;
        }
        
        if (!this.isValidEmail(emailInput.value)) {
            this.showError('email', 'invalid');
            return;
        }
        
        // All validations passed
        this.submitForm(form);
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    showError(field, type) {
        const errorContainer = document.getElementById('formErrors');
        if (!errorContainer) return;
        
        const errors = {
            third_party_cookies_required: {
                ro: 'Pentru a trimite formularul, trebuie să acceptați cookie-urile terțe în Setările Cookie.',
                en: 'To submit the form, you need to accept third-party cookies in Cookie Settings.'
            },
            missing_consents: {
                ro: 'Vă rugăm să bifați toate căsuțele de consimțământ obligatorii.',
                en: 'Please check all required consent boxes.'
            },
            email_required: {
                ro: 'Adresa de email este obligatorie.',
                en: 'Email address is required.'
            },
            email_invalid: {
                ro: 'Vă rugăm să introduceți o adresă de email validă.',
                en: 'Please enter a valid email address.'
            }
        };
        
        const errorKey = `${field}_${type}`;
        const error = errors[errorKey] || errors[type];
        
        if (error) {
            errorContainer.innerHTML = `
                <span lang="ro">${error.ro}</span>
                <span lang="en">${error.en}</span>
            `;
            errorContainer.style.display = 'block';
            
            // Scroll to error
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    },
    
    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span lang="ro">Se trimite...</span>
            <span lang="en">Sending...</span>
        `;
        
        // Track form submission for GDPR audit
        this.trackFormSubmission(form);
        
        // Actually submit the form
        form.submit();
        
        // Note: After submission, Formspree will redirect or show its own success message
        // You might want to handle this differently based on your needs
    },
    
    trackFormSubmission(form) {
        const submissionData = {
            timestamp: new Date().toISOString(),
            form: 'event_registration',
            consents: {
    dataProcessing: document.getElementById('dataProcessingConsent').checked,
    internationalTransfer: document.getElementById('internationalTransferConsent').checked,
    privacyPolicy: document.getElementById('privacyPolicyConsent').checked
}

        };
        
        // Store submission data for audit trail
        try {
            const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            submissions.push(submissionData);
            // Keep only last 5 submissions
            if (submissions.length > 5) submissions.shift();
            localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        } catch (e) {
            console.warn('Could not save form submission data');
        }
        
        // Track in analytics if enabled
        if (typeof gtag !== 'undefined' && CookieConsent.hasAccepted()) {
            gtag('event', 'form_submit', {
                'event_category': 'GDPR_Compliant_Form',
                'event_label': 'Event Registration',
                'consents_given': true
            });
        }
    }
};

// ===== LANGUAGE MANAGEMENT SYSTEM =====
const LanguageManager = {
    currentLang: 'ro',
    
    init() {
        // Check for saved language preference
        const savedLang = this.getSavedLanguage();
        const browserLang = navigator.language.toLowerCase();
        
        // Prioritize: saved preference > browser language > default (ro)
        if (savedLang && ['ro', 'en'].includes(savedLang)) {
            this.currentLang = savedLang;
        } else if (browserLang.startsWith('en')) {
            this.currentLang = 'en';
        }
        
        this.setLanguage(this.currentLang);
        this.setupLanguageButtons();
    },
    
    getSavedLanguage() {
        try {
            return localStorage.getItem('language');
        } catch (e) {
            return null;
        }
    },
    
    setLanguage(lang) {
        if (!['ro', 'en'].includes(lang)) return;
        
        this.currentLang = lang;
        
        // Batch DOM updates to prevent reflows
        requestAnimationFrame(() => {
            document.body.classList.toggle('lang-ro', lang === 'ro');
            document.documentElement.lang = lang;
            
            // Update language buttons
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
                btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
            });
            
            // Update navigation links
            document.querySelectorAll('.nav-link').forEach(link => {
                const text = lang === 'ro' ? link.dataset.ro : link.dataset.en;
                if (text) link.textContent = text;
            });
        });
        
        // Save preference (this is functional, not tracking)
        try {
            localStorage.setItem('language', lang);
        } catch (e) {
            console.warn('localStorage not available');
        }
        
        // Update page meta for SEO
        this.updatePageMeta(lang);
        
        // Trigger custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    },
    
    setupLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setLanguage(btn.dataset.lang);
            });
        });
    },
    
    updatePageMeta(lang) {
        // Update document title based on language
        const titles = {
            ro: 'Consiliere Online România | Life Coach & Dezvoltare Personală | Răzvan Mischie',
            en: 'Online Counseling Romania | Life Coach & Personal Development | Răzvan Mischie'
        };
        document.title = titles[lang] || titles.ro;
        
        // Update meta description
        const descriptions = {
            ro: 'Consiliere online profesională pentru dezvoltare personală în România. Life coaching pentru echilibru emoțional, claritate în viață și creștere personală.',
            en: 'Professional online counseling for personal development in Romania. Life coaching for emotional balance, life clarity and personal growth.'
        };
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = descriptions[lang] || descriptions.ro;
        }
    }
};

// ===== MOBILE MENU MANAGEMENT =====
const MobileMenu = {
    isOpen: false,
    menu: null,
    toggle: null,
    
    init() {
        this.menu = document.getElementById('navMenu');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Keyboard support
            this.toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMenu();
                }
            });
        }
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
                this.toggle.focus();
            }
        });
        
        // Close menu when clicking nav links
        this.menu?.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.closeMenu();
            }
        });
    },
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            this.menu.classList.toggle('active', this.isOpen);
            this.toggle.setAttribute('aria-expanded', this.isOpen);
            this.animateHamburger(this.isOpen);
        });
    },
    
    closeMenu() {
        this.isOpen = false;
        
        requestAnimationFrame(() => {
            this.menu.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
            this.animateHamburger(false);
        });
    },
    
    animateHamburger(isOpen) {
        const spans = this.toggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
};

// ===== ENHANCED CAROUSEL WITH TOUCH SUPPORT =====
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.track = null;
        this.slides = [];
        this.dots = [];
        this.isTransitioning = false;
        
        // Cache for performance
        this.slideWidth = 0;
        this.trackWidth = 0;
        
        // Event configuration
        this.eventImages = ['./consiliere-online-razvan-mischie-event-1.jpg', './consiliere-online-razvan-mischie-event-2.jpg', './consiliere-online-razvan-mischie-event-3.jpg'];
        this.eventCaptions = [
            {
                ro: 'Atelier de Re-cunoaștere - 25 Iunie, 19:00 - 22:00 - 35 RON',
                en: 'Recognition Workshop - June 25, 7:00 PM - 10:00 PM - 35 RON'
            },
            {
                ro: 'Atelier: Interese Specifice - 26 Iulie, 18:00 - 20:00 - 35 RON',
                en: 'Workshop: Specific Interests - July 26, 6:00 PM - 8:00 PM - 35 RON'
            },
            {
                ro: 'Comunicarea și Nuanțele Ei - 10 Iulie, 18:30 - 21:30 - 35 RON',
                en: 'Communication & Its Nuances - July 10, 6:30 PM - 9:30 PM - 35 RON'
            }
        ];
    }
    
    init() {
        this.track = document.getElementById('carouselTrack');
        if (!this.track) return;
        
        this.slides = Array.from(this.track.querySelectorAll('.carousel-slide'));
        this.cacheElementDimensions();
        this.createDots();
        this.setupEventListeners();
        this.preloadImages();
        
        // Start autoplay if motion is allowed
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.startAutoPlay();
        }
    }
    
    cacheElementDimensions() {
        // Cache dimensions to avoid repeated reflows
        if (this.slides.length > 0) {
            const firstSlide = this.slides[0];
            this.slideWidth = firstSlide.offsetWidth;
            this.trackWidth = this.slideWidth * this.slides.length;
        }
    }
    
    setupEventListeners() {
        // Touch events
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop swipe
        let mouseDown = false;
        this.track.addEventListener('mousedown', (e) => {
            mouseDown = true;
            this.touchStartX = e.clientX;
        });
        
        this.track.addEventListener('mouseup', (e) => {
            if (mouseDown) {
                this.touchEndX = e.clientX;
                this.handleSwipe();
            }
            mouseDown = false;
        });
        
        this.track.addEventListener('mouseleave', () => {
            mouseDown = false;
        });
        
        // Navigation buttons
        const prevBtn = document.querySelector('.carousel-nav.prev');
        const nextBtn = document.querySelector('.carousel-nav.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.move(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.move(1));
        
        // Keyboard navigation
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.move(-1);
                else if (e.key === 'ArrowRight') this.move(1);
            });
            
            // Pause on hover
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            document.hidden ? this.stopAutoPlay() : this.startAutoPlay();
        });
        
        // Recalculate dimensions on resize
        window.addEventListener('resize', debounce(() => this.cacheElementDimensions(), 250));
    }
    
    preloadImages() {
        // Preload next image for smoother transitions
        this.eventImages.forEach((src, index) => {
            if (index > 0) { // Skip first image as it's already loaded
                const img = new Image();
                img.src = src;
            }
        });
    }
    
    createDots() {
        const dotsContainer = document.getElementById('carouselDots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        this.dots = [];
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Mergi la slide ${index + 1}`);
            dot.setAttribute('aria-current', index === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
    }
    
    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }
    
    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }
    
    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            this.move(diff > 0 ? 1 : -1);
        }
    }
    
    move(direction) {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        // Use requestAnimationFrame for smooth animations
        requestAnimationFrame(() => {
            // Update track position
            this.track.style.transform = `translateX(${-this.currentSlide * 100}%)`;
            
            // Update dots
            this.dots.forEach((dot, index) => {
                const isActive = index === this.currentSlide;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        });
        
        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
        
        // Announce to screen readers
        this.announceSlide();
    }
    
    announceSlide() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide ${this.currentSlide + 1} din ${this.slides.length}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.move(1);
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ===== MODAL MANAGEMENT =====
const Modal = {
    modal: null,
    modalImg: null,
    modalCaption: null,
    isOpen: false,
    
    init() {
        this.modal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('modalImage');
        this.modalCaption = document.getElementById('modalCaption');
        
        if (!this.modal) return;
        
        // Close on click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                this.close();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    open(index) {
        if (!this.modal || !carousel) return;
        
        const lang = LanguageManager.currentLang;
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            this.modal.style.display = 'block';
            
            // Force reflow only once
            this.modal.offsetHeight;
            
            this.modal.classList.add('show');
            this.modalImg.src = carousel.eventImages[index];
            this.modalImg.alt = `Imagine eveniment ${index + 1}`;
            this.modalCaption.textContent = carousel.eventCaptions[index][lang];
            
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            // Focus management
            this.modal.setAttribute('tabindex', '-1');
            this.modal.focus();
            
            // Trap focus
            this.trapFocus();
        });
    },
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
            
            // Return focus to trigger element
            const triggerElement = document.querySelector(`#event${this.lastOpenedIndex + 1}`);
            if (triggerElement) triggerElement.focus();
        }, 300);
    },
    
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        this.modal.addEventListener('keydown', handleTabKey);
    }
};

// ===== PRIVACY MODAL MANAGEMENT =====
const PrivacyModal = {
    modal: null,
    isOpen: false,
    
    init() {
        this.modal = document.getElementById('privacyModal');
        
        if (!this.modal) return;
        
        // Close on click outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },
    
    open() {
        if (!this.modal) return;
        
        requestAnimationFrame(() => {
            this.modal.style.display = 'block';
            
            // Force reflow only once
            this.modal.offsetHeight;
            
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            // Focus management
            this.modal.setAttribute('tabindex', '-1');
            this.modal.focus();
            
            // Trap focus
            this.trapFocus();
        });
    },
    
    close() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.isOpen = false;
        }, 300);
    },
    
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        this.modal.addEventListener('keydown', handleTabKey);
    }
};

// ===== OPTIMIZED SMOOTH SCROLL WITH NAVIGATION UPDATE =====
const Navigation = {
    sections: [],
    navLinks: [],
    sectionData: [],
    
    init() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Cache section data to prevent reflows
        this.cacheSectionData();
        
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });
        
        // Throttled scroll spy to prevent performance issues
        window.addEventListener('scroll', throttle(() => this.updateActiveSection(), 100), { passive: true });
        
        // Recalculate on resize
        window.addEventListener('resize', debounce(() => this.cacheSectionData(), 250));
        
        // Initial check
        this.updateActiveSection();
    },
    
    cacheSectionData() {
        // Batch read all section positions to avoid reflows
        this.sectionData = Array.from(this.sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop,
            bottom: section.offsetTop + section.offsetHeight
        }));
    },
    
    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offset = 80; // Account for fixed header
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            MobileMenu.closeMenu();
            
            // Update URL without triggering scroll
            history.pushState(null, null, `#${targetId}`);
        }
    },
    
    updateActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        // Use cached data to avoid reflows
        for (const sectionData of this.sectionData) {
            if (scrollPosition >= sectionData.top && scrollPosition < sectionData.bottom) {
                // Batch DOM updates
                requestAnimationFrame(() => {
                    this.navLinks.forEach(link => {
                        const isActive = link.getAttribute('href') === `#${sectionData.id}`;
                        link.classList.toggle('active', isActive);
                        link.setAttribute('aria-current', isActive ? 'page' : 'false');
                    });
                });
                break;
            }
        }
    }
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const AnimationObserver = {
    init() {
        // Don't run animations if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe elements
        const elements = document.querySelectorAll('.section-paragraph, .faq-item, .service-card, .stat-item');
        elements.forEach(el => observer.observe(el));
    }
};

// ===== FORM HANDLER (Original Contact Form) =====
const FormHandler = {
    init() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },
    
    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(form)) return;
        
        // Show loading state
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'Se trimite...';
        button.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Success message
            this.showMessage('Mulțumim! Vă vom contacta în curând.', 'success');
            form.reset();
            
            // Reset button
            button.textContent = originalText;
            button.disabled = false;
            
            // Track form submission in analytics if available and consent given
            if (typeof gtag !== 'undefined' && CookieConsent.hasAccepted()) {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Consultation Request'
                });
            }
        }, 1500);
    },
    
    validateForm(form) {
        const inputs = form.querySelectorAll('[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Clear previous error
        this.clearFieldError(field);
        
        // Required field
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Acest câmp este obligatoriu');
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Introduceți o adresă de email validă');
            isValid = false;
        }
        
        // Phone validation (Romanian format)
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            this.showFieldError(field, 'Introduceți un număr de telefon valid');
            isValid = false;
        }
        
        return isValid;
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    isValidPhone(phone) {
        // Romanian phone number format
        return /^(\+4|)?(07[0-8]{1}[0-9]{7}|02[0-9]{8}|03[0-9]{8})$/.test(phone.replace(/\s/g, ''));
    },
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or update error message
        let errorEl = field.nextElementSibling;
        if (!errorEl || !errorEl.classList.contains('field-error')) {
            errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            field.parentNode.insertBefore(errorEl, field.nextSibling);
        }
        errorEl.textContent = message;
    },
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.nextElementSibling;
        if (errorEl && errorEl.classList.contains('field-error')) {
            errorEl.remove();
        }
    },
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        
        const form = document.querySelector('.contact-form');
        if (form) {
            form.parentNode.insertBefore(messageEl, form);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }
    }
};

// ===== PERFORMANCE MONITOR =====
const PerformanceMonitor = {
    init() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            
            try {
                observer.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask not supported
            }
        }
        
        // Monitor Core Web Vitals
        this.observeWebVitals();
    },
    
    observeWebVitals() {
        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // Not supported
            }
        }
    }
};

// ===== EVENT DATA MANAGEMENT =====
const EventData = {
    // Dynamic event data for JSON-LD updates
    upcomingEvents: {
        "@context": "https://schema.org",
        "@type": "EventSeries",
        "name": "Ateliere de Dezvoltare Personală",
        "description": "Serie de workshop-uri pentru dezvoltare personală și creștere interioară",
        "organizer": {
            "@type": "Person",
            "name": "Răzvan Mischie"
        },
        "location": {
            "@type": "VirtualLocation",
            "url": "https://consiliereonline.com/events"
        }
    },
    
    init() {
        // Any dynamic event management logic can go here
        this.updateEventVisibility();
    },
    
    updateEventVisibility() {
        // Future implementation for showing/hiding past events
        const today = new Date();
        // Logic to manage event visibility based on dates
    }
};

// ===== GLOBAL VARIABLES =====
let carousel;

// ===== GLOBAL FUNCTIONS FOR ONCLICK HANDLERS =====
window.openModal = (index) => {
    Modal.lastOpenedIndex = index;
    Modal.open(index);
};

window.closeModal = () => Modal.close();

window.openPrivacyModal = () => PrivacyModal.open();

window.closePrivacyModal = () => PrivacyModal.close();

window.moveCarousel = (dir) => carousel && carousel.move(dir);

window.setLanguage = (lang) => LanguageManager.setLanguage(lang);

window.toggleMobileMenu = () => MobileMenu.toggleMenu();

// Cookie Settings Global Functions
window.openCookieSettings = () => CookieConsent.openSettings();

window.closeCookieSettings = () => CookieConsent.closeSettings();

window.acceptAllCookies = () => CookieConsent.acceptAllCookies();

window.rejectAllCookies = () => CookieConsent.rejectAllCookies();

window.savePreferences = () => CookieConsent.saveCustomPreferences();

// ===== ENHANCED SERVICE WORKER REGISTRATION =====
const ServiceWorkerManager = {
    registration: null,
    updateAvailable: false,
    
    init() {
        if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
            window.addEventListener('load', () => {
                // Add timestamp to bypass cache for service worker file
                const swUrl = './sw.js';
                
                navigator.serviceWorker.register(swUrl, { 
                    scope: './',
                    // Check for updates more frequently
                    updateViaCache: 'none'
                })
                .then((registration) => {
                    this.registration = registration;
                    console.log('ServiceWorker registration successful with scope:', registration.scope);
                    
                    // Check for updates immediately
                    registration.update();
                    
                    // Listen for any updates
                    registration.addEventListener('updatefound', () => {
                        console.log('Service Worker update found!');
                        const newWorker = registration.installing;
                        
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                console.log('Service Worker state changed to:', newWorker.state);
                                
                                if (newWorker.state === 'installed') {
                                    // There's a new service worker waiting
                                    if (navigator.serviceWorker.controller) {
                                        // Show update notification only if there's an existing controller
                                        console.log('New service worker available!');
                                        this.updateAvailable = true;
                                        this.showUpdateNotification(newWorker);
                                    } else {
                                        // First install, no update needed
                                        console.log('Service Worker installed for the first time');
                                    }
                                }
                            });
                        }
                    });
                    
                    // Also listen for controller change (when skipWaiting is called)
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        console.log('Controller changed, reloading page...');
                        // Only reload if we were waiting for an update
                        if (this.updateAvailable) {
                            window.location.reload();
                        }
                    });
                    
                    // Listen for messages from service worker
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        if (event.data && event.data.type === 'SERVICE_WORKER_ACTIVATED') {
                            console.log('Service Worker activated with version:', event.data.version);
                        }
                    });
                    
                    // Check for updates every hour
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000);
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed:', error);
                });
            });
            
            // Also check for updates when the page gains focus
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.registration) {
                    this.registration.update();
                }
            });
        }
    },
    
    showUpdateNotification(newWorker) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-notification-content">
                <p>
                    <span lang="ro">O versiune nouă este disponibilă! 🎉</span>
                    <span lang="en">A new version is available! 🎉</span>
                </p>
                <div class="update-notification-actions">
                    <button class="update-btn update-btn-primary" onclick="ServiceWorkerManager.applyUpdate()">
                        <span lang="ro">Actualizează Acum</span>
                        <span lang="en">Update Now</span>
                    </button>
                    <button class="update-btn update-btn-secondary" onclick="ServiceWorkerManager.dismissUpdate()">
                        <span lang="ro">Mai Târziu</span>
                        <span lang="en">Later</span>
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #333;
            padding: 1.5rem;
            border-radius: 12px;
            z-index: 9999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 350px;
            animation: slideIn 0.3s ease;
            border: 2px solid #4CAF50;
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .update-notification-content {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .update-notification-content p {
                margin: 0;
                font-size: 1rem;
                font-weight: 500;
                color: #333;
            }
            
            .update-notification-actions {
                display: flex;
                gap: 0.75rem;
            }
            
            .update-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 500;
                transition: all 0.2s ease;
                font-family: inherit;
                flex: 1;
            }
            
            .update-btn-primary {
                background: #4CAF50;
                color: white;
            }
            
            .update-btn-primary:hover {
                background: #45a049;
                transform: translateY(-1px);
            }
            
            .update-btn-secondary {
                background: #f0f0f0;
                color: #666;
            }
            
            .update-btn-secondary:hover {
                background: #e0e0e0;
            }
        `;
        
        if (!document.querySelector('style[data-update-notification]')) {
            style.setAttribute('data-update-notification', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Store reference to the new worker
        this.newWorker = newWorker;
        
        // Auto-dismiss after 30 seconds (but keep the update available)
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 30000);
    },
    
    applyUpdate() {
        if (this.newWorker) {
            // Tell the waiting service worker to skip waiting
            this.newWorker.postMessage({ type: 'SKIP_WAITING' });
            // The controllerchange event will reload the page
        } else if (this.registration && this.registration.waiting) {
            // Backup: if we lost the reference to newWorker
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    },
    
    dismissUpdate() {
        const notification = document.querySelector('.update-notification');
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
        
        // Show a small indicator that an update is available
        this.showUpdateIndicator();
    },
    
    showUpdateIndicator() {
        // Add a small indicator to the page
        const indicator = document.createElement('div');
        indicator.className = 'update-indicator';
        indicator.innerHTML = `
            <button onclick="ServiceWorkerManager.showUpdateNotification(ServiceWorkerManager.newWorker)" 
                    title="Update Available" 
                    aria-label="Update Available">
                🔄
            </button>
        `;
        
        indicator.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 20px;
            background: #4CAF50;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            animation: pulse 2s infinite;
        `;
        
        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .update-indicator button {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1.2rem;
                width: 100%;
                height: 100%;
                padding: 0;
            }
        `;
        
        if (!document.querySelector('style[data-update-indicator]')) {
            style.setAttribute('data-update-indicator', 'true');
            document.head.appendChild(style);
        }
        
        document.body.appendChild(indicator);
    }
};

// Make ServiceWorkerManager globally accessible
window.ServiceWorkerManager = ServiceWorkerManager;

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Consiliere Online - Initializing with GDPR Compliance...');
    
    try {
        // Initialize cookie consent first (critical for GDPR compliance)
        CookieConsent.init();
                // Initialize cookie consent first (critical for GDPR compliance)
        CookieConsent.init();
        
        // Initialize GDPR form handler - MAKE SURE THIS LINE IS PRESENT
        GDPRFormHandler.init();

        // Initialize GDPR form handler
        GDPRFormHandler.init();
        
        // Initialize core modules
        LanguageManager.init();
        MobileMenu.init();
        Navigation.init();
        Modal.init();
        PrivacyModal.init();
        AnimationObserver.init();
        FormHandler.init();
        EventData.init();
        ServiceWorkerManager.init();
        PerformanceMonitor.init();
        
        // Initialize carousel
        carousel = new Carousel();
        carousel.init();
        
        console.log('✅ All modules initialized successfully with GDPR compliance');
        
        // Dispatch custom event for any external scripts
        window.dispatchEvent(new CustomEvent('consiliereonlineReady', {
            detail: { 
                timestamp: Date.now(),
                gdprCompliant: true
            }
        }));
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        
        // Basic fallback functionality
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                document.body.classList.toggle('lang-ro', lang === 'ro');
            });
        });
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Track errors if analytics is available and consent given
    if (typeof gtag !== 'undefined' && CookieConsent.hasAccepted()) {
        gtag('event', 'exception', {
            'description': e.error.message,
            'fatal': false
        });
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    
    // Track promise rejections if analytics is available and consent given
    if (typeof gtag !== 'undefined' && CookieConsent.hasAccepted()) {
        gtag('event', 'exception', {
            'description': e.reason?.message || 'Promise rejection',
            'fatal': false
        });
    }
});

// ===== EXPORT FOR TESTING (if needed) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CookieConsent,
        LanguageManager,
        MobileMenu,
        Carousel,
        Modal,
        PrivacyModal,
        Navigation,
        AnimationObserver,
        FormHandler,
        GDPRFormHandler,
        PerformanceMonitor,
        EventData
    };
}