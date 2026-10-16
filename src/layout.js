/* =====================================================================
   ClearCut – Shared Layout System
   Generates consistent HTML for navbar, footer, and page shell.
   ===================================================================== */

export const SITE = {
  name: 'ClearCut',
  tagline: 'Background Removal. Made Simple.',
  slogan: 'Free • Offline • On Your Device',
  playStoreUrl: '#download',
  email: 'support@clearcut.app',
  year: 2026,
};

// ─── NAV LINKS ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pages/best-free-background-remover-apps.html', label: 'Compare Apps' },
  { href: '/pages/blog/', label: 'Blog' },
  { href: '/pages/how-to/remove-background-android.html', label: 'Guides' },
  { href: '/pages/free-online-background-remover.html', label: '🔥 Free Web Tool', highlight: true },
  { href: '/pages/about.html', label: 'About' },
  { href: '/pages/contact.html', label: 'Contact' },
];

// ─── HEADER HTML ──────────────────────────────────────────────────────────────
export function renderHeader(activePage = '') {
  const links = NAV_LINKS.map(l => `
    <li>
      <a href="${l.href}" class="nav-link ${l.highlight ? 'nav-highlight' : ''} ${activePage === l.label ? 'active' : ''}">
        ${l.label}
      </a>
    </li>`).join('');

  return `
  <header class="header" id="navbar">
    <div class="container nav-container">
      <a href="/" class="brand" aria-label="ClearCut Homepage">
        <div class="brand-icon">
          <img src="/assets/logo.svg" alt="ClearCut Logo" width="44" height="44">
        </div>
        <div class="brand-text">
          <span class="brand-name"><span class="clear">Clear</span><span class="cut">Cut</span></span>
          <span class="brand-tagline">Background Remover</span>
        </div>
      </a>

      <nav aria-label="Main Navigation">
        <ul class="nav-menu" id="navMenu">
          ${links}
        </ul>
      </nav>

      <div class="nav-actions">
        <a href="${SITE.playStoreUrl}" class="btn btn-primary btn-sm" id="navDownloadBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download Free</span>
        </a>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

// ─── FOOTER HTML ──────────────────────────────────────────────────────────────
export function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-top-grid">
        <div class="footer-brand-col">
          <a href="/" class="brand">
            <div class="brand-icon"><img src="/assets/logo.svg" alt="ClearCut" width="44" height="44"></div>
            <div class="brand-text">
              <span class="brand-name"><span class="clear">Clear</span><span class="cut">Cut</span></span>
              <span class="brand-tagline">Background Remover</span>
            </div>
          </a>
          <p>100% free Android app. Remove photo backgrounds in seconds with on-device AI. No uploads, no account.</p>
          <div class="footer-slogan-badge">${SITE.slogan}</div>
        </div>

        <div class="footer-col">
          <h4>Features</h4>
          <ul class="footer-links">
            <li><a href="/pages/transparent-background-maker.html">Transparent PNG Maker</a></li>
            <li><a href="/pages/white-background-photo-maker.html">White Background Maker</a></li>
            <li><a href="/pages/passport-photo-background-remover.html">Passport Photo Maker</a></li>
            <li><a href="/pages/product-photo-background-remover.html">Product Photo Remover</a></li>
            <li><a href="/pages/youtube-thumbnail-background-remover.html">YouTube Thumbnail Cutout</a></li>
            <li><a href="/pages/sticker-maker-background-remover.html">Sticker Maker</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Compare</h4>
          <ul class="footer-links">
            <li><a href="/pages/remove-bg-alternative.html">remove.bg Alternative</a></li>
            <li><a href="/pages/photoroom-alternative.html">PhotoRoom Alternative</a></li>
            <li><a href="/pages/best-free-background-remover-apps.html">Best Free Apps</a></li>
            <li><a href="/pages/offline-background-remover.html">Offline Background Remover</a></li>
            <li><a href="/pages/background-remover-no-watermark.html">No Watermark Apps</a></li>
            <li><a href="/pages/background-remover-no-signup.html">No Sign-Up Apps</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Guides & Legal</h4>
          <ul class="footer-links">
            <li><a href="/pages/how-to/remove-background-android.html">How to Remove Background</a></li>
            <li><a href="/pages/how-to/create-passport-photo-at-home.html">Passport Photo Guide</a></li>
            <li><a href="/pages/blog/">Blog</a></li>
            <li><a href="/pages/about.html">About ClearCut</a></li>
            <li><a href="/pages/privacy-policy.html">Privacy Policy</a></li>
            <li><a href="/pages/terms-of-service.html">Terms of Service</a></li>
            <li><a href="/pages/contact.html">Contact & Support</a></li>
            <li><a href="/pages/changelog.html">Changelog</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${SITE.year} ClearCut. All rights reserved.</span>
        <span>Made for Android users worldwide · <a href="mailto:${SITE.email}" style="color:#60A5FA;">${SITE.email}</a></span>
      </div>
    </div>
  </footer>`;
}

// ─── PLAY STORE BUTTON ────────────────────────────────────────────────────────
export function playStoreBtn(size = '') {
  return `
  <a href="${SITE.playStoreUrl}" class="btn-playstore ${size}">
    <svg viewBox="0 0 512 512">
      <path fill="#00E6FF" d="M32.5 32.5L256 256 32.5 479.5c-4.1-4.1-6.5-10-6.5-16.5V49c0-6.5 2.4-12.4 6.5-16.5z"/>
      <path fill="#00F076" d="M352 160L256 256l96 96 64-37c18.2-10.5 18.2-27.5 0-38l-64-117z"/>
      <path fill="#FF3A44" d="M256 256L32.5 479.5c6.5 6.5 16.5 8 26.5 2.5l293-170L256 256z"/>
      <path fill="#FFAE00" d="M352 160L59 2c-10-5.5-20-4-26.5 2.5L256 256l96-96z"/>
    </svg>
    <div class="playstore-text">
      <span class="playstore-sub">Get it on</span>
      <span class="playstore-main">Google Play</span>
    </div>
  </a>`;
}

// ─── DOWNLOAD SECTION (CTA Banner) ────────────────────────────────────────────
export function downloadCTA(headline = 'Download ClearCut Free') {
  return `
  <section class="section" style="padding: 60px 0;">
    <div class="container">
      <div class="cta-banner" style="text-align:center; display:block; padding: 48px 32px;">
        <h2 class="cta-title">${headline}</h2>
        <p class="cta-desc">No account. No watermark. Works offline. 100% free forever.</p>
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap; margin-top:28px;">
          ${playStoreBtn()}
        </div>
        <div style="margin-top:18px; display:flex; align-items:center; justify-content:center; gap:24px; flex-wrap:wrap;">
          <span style="font-size:0.88rem; color:var(--text-secondary);">✔ Android 8.0+ &nbsp;·&nbsp; ✔ ~25MB &nbsp;·&nbsp; ✔ Zero permissions abuse</span>
        </div>
      </div>
    </div>
  </section>`;
}

// ─── BEFORE/AFTER COMPARISON COMPONENT ───────────────────────────────────────
export function comparisonSlider({ img, mask, caption = '' }) {
  return `
  <div class="comparison-card" style="max-width:560px; margin:0 auto;">
    <div class="before-after-slider" id="pageSlider" tabindex="0" role="slider" aria-label="Background removal before/after">
      <div class="slider-layer layer-after checkerboard-pattern">
        <img src="${img}" alt="Background removed cutout" class="cutout-subject-img" style="clip-path:${mask}; width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="slider-layer layer-before" id="pageSliderBefore">
        <img src="${img}" alt="Original photo with background" style="width:100%; height:100%; object-fit:cover;">
      </div>
      <div class="slider-handle" id="pageSliderHandle">
        <div class="slider-handle-button" aria-hidden="true">&#10094; &#10095;</div>
      </div>
      <span class="slider-label label-before">Original</span>
      <span class="slider-label label-after">ClearCut</span>
    </div>
    ${caption ? `<p style="text-align:center;margin-top:12px;font-size:0.88rem;color:var(--text-secondary);">${caption}</p>` : ''}
  </div>`;
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
export function breadcrumb(items) {
  const parts = items.map((item, i) =>
    i < items.length - 1
      ? `<a href="${item.href}" style="color:#60A5FA;">${item.label}</a>`
      : `<span>${item.label}</span>`
  ).join(' <span style="color:var(--text-muted);">›</span> ');

  return `
  <div style="padding:16px 0; font-size:0.88rem; color:var(--text-secondary);">${parts}</div>`;
}

// ─── SCHEMA.ORG JSON-LD HELPERS ───────────────────────────────────────────────
export function softwareAppSchema() {
  return `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ClearCut – Background Remover",
    "operatingSystem": "Android",
    "applicationCategory": "PhotographyApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": "Free offline Android app that removes image backgrounds on-device with AI.",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "18450" }
  }
  </script>`;
}

export function faqSchema(faqs) {
  const entries = faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }));
  return `<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ${JSON.stringify(entries)} }
  </script>`;
}

// ─── FAQ ACCORDION COMPONENT ─────────────────────────────────────────────────
export function faqBlock(items) {
  return `
  <div class="faq-container">
    ${items.map((item, i) => `
    <div class="faq-item ${i === 0 ? 'open' : ''}">
      <button class="faq-question">
        <span>${item.q}</span>
        <span class="faq-icon">&#9662;</span>
      </button>
      <div class="faq-answer"><p>${item.a}</p></div>
    </div>`).join('')}
  </div>`;
}

// ─── SHARED SCRIPTS (Navbar + FAQ + Slider) ───────────────────────────────────
export function sharedScripts() {
  return `
  <script type="module">
    // Navbar sticky
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 40);
    });

    menuToggle?.addEventListener('click', () => {
      const open = navMenu?.classList.toggle('open');
      menuToggle.classList.toggle('active', open);
      menuToggle.setAttribute('aria-expanded', open);
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
      item.querySelector('.faq-question')?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });

    // Before/After Slider
    const slider = document.getElementById('pageSlider');
    const handle = document.getElementById('pageSliderHandle');
    const before = document.getElementById('pageSliderBefore');
    if (slider && handle && before) {
      let dragging = false;
      let pos = 50;
      const move = (x) => {
        const r = slider.getBoundingClientRect();
        pos = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
        handle.style.left = pos + '%';
        before.style.clipPath = 'polygon(0 0,' + pos + '% 0,' + pos + '% 100%,0 100%)';
      };
      slider.addEventListener('mousedown', e => { dragging = true; move(e.clientX); });
      window.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });
      window.addEventListener('mouseup', () => dragging = false);
      slider.addEventListener('touchstart', e => { dragging = true; move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend', () => dragging = false);
    }

    // Ambient Scroll Animations (IntersectionObserver)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(el);
    });
  </script>`;
}

// ─── PAGE SHELL BUILDER ───────────────────────────────────────────────────────
export function buildPage({
  title,
  metaDesc,
  keywords = '',
  canonicalPath = '',
  activeNav = '',
  bodyContent,
  extraHead = '',
  schemas = ''
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  ${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
  <meta name="theme-color" content="#050816">
  ${canonicalPath ? `<link rel="canonical" href="https://clearcut.app${canonicalPath}">` : ''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="/assets/logo.svg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${softwareAppSchema()}
  ${schemas}
  ${extraHead}
</head>
<body>
  <div class="ambient-glow" aria-hidden="true">
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>
    <div class="glow-orb glow-orb-3"></div>
  </div>

  ${renderHeader(activeNav)}

  <main>
    ${bodyContent}
  </main>

  ${renderFooter()}
  ${sharedScripts()}
</body>
</html>`;
}
