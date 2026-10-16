/**
 * ClearCut Website – Page Generator
 * Run: node scripts/generate-pages.mjs
 * Generates all inner pages from the shared layout system.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/* ──────────────────────────────────────────────────────────────────
   SHARED HELPERS (inline – no import needed)
   ────────────────────────────────────────────────────────────────── */

const PLAY_STORE = '#download';
const EMAIL = 'support@clearcut.app';
const YEAR = 2026;

function playBtn() {
  return `<a href="#download" class="btn-playstore open-download-modal">
    <svg viewBox="0 0 512 512"><path fill="#00E6FF" d="M32.5 32.5L256 256 32.5 479.5c-4.1-4.1-6.5-10-6.5-16.5V49c0-6.5 2.4-12.4 6.5-16.5z"/><path fill="#00F076" d="M352 160L256 256l96 96 64-37c18.2-10.5 18.2-27.5 0-38l-64-117z"/><path fill="#FF3A44" d="M256 256L32.5 479.5c6.5 6.5 16.5 8 26.5 2.5l293-170L256 256z"/><path fill="#FFAE00" d="M352 160L59 2c-10-5.5-20-4-26.5 2.5L256 256l96-96z"/></svg>
    <div class="playstore-text"><span class="playstore-sub">Get it on</span><span class="playstore-main">Google Play</span></div>
  </a>`;
}

function slider(img, mask, caption='') {
  return `<div class="comparison-card" style="max-width:520px;margin:0 auto;">
    <div class="before-after-slider" tabindex="0" role="slider" aria-label="Before and after slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
      <div class="slider-layer layer-after checkerboard-pattern">
        <img src="${img}" alt="Background removed" style="clip-path:${mask};width:100%;height:100%;object-fit:cover;">
      </div>
      <div class="slider-layer layer-before">
        <img src="${img}" alt="Original photo" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div class="slider-handle">
        <div class="slider-handle-button" aria-hidden="true">&#10094; &#10095;</div>
      </div>
      <span class="slider-label label-before">Original</span>
      <span class="slider-label label-after">ClearCut</span>
    </div>
    ${caption ? `<p style="text-align:center;margin-top:10px;font-size:.86rem;color:var(--text-secondary);">${caption}</p>` : ''}
  </div>`;
}

function badge(text, color='rgba(47,107,255,0.15)', textColor='#93C5FD') {
  return `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${color};color:${textColor};font-size:.78rem;font-weight:600;">${text}</span>`;
}

function checkItem(text, good=true) {
  const icon = good
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  return `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
    <div style="flex-shrink:0;margin-top:2px;">${icon}</div>
    <span style="font-size:.95rem;">${text}</span>
  </div>`;
}

function stepBlock(steps) {
  return steps.map((s, i) => `
    <div class="step-item animate-in" style="cursor:default;">
      <div class="step-number" style="background:var(--grad-primary);color:#fff;border:none;box-shadow:0 0 15px rgba(47,107,255,.5);">${i+1}</div>
      <div class="step-text"><h3>${s.title}</h3><p>${s.desc}</p></div>
    </div>`).join('');
}

function faqBlock(items) {
  return `<div class="faq-container">${items.map((f,i) => `
    <div class="faq-item ${i===0?'open':''}">
      <button class="faq-question"><span>${f.q}</span><span class="faq-icon">&#9662;</span></button>
      <div class="faq-answer"><p>${f.a}</p></div>
    </div>`).join('')}</div>`;
}

function faqSchema(items) {
  return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":${JSON.stringify(items.map(f=>({
    "@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}
  })))}}</script>`;
}

function ctaBanner(headline='Download ClearCut Free Today') {
  return `<section class="section" id="download" style="padding:56px 0;">
    <div class="container"><div class="cta-banner" style="text-align:center;display:block;padding:48px 32px;">
      <h2 class="cta-title">${headline}</h2>
      <p class="cta-desc">No account. No watermark. Works offline. 100% free forever.</p>
      <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:28px;">${playBtn()}</div>
      <div style="margin-top:16px;font-size:.86rem;color:var(--text-secondary);">✔ Android 8.0+ &nbsp;·&nbsp; ✔ ~25MB &nbsp;·&nbsp; ✔ No hidden fees</div>
    </div></div>
  </section>`;
}

function breadcrumb(items) {
  return `<div style="padding:14px 0;font-size:.86rem;color:var(--text-secondary);">${items.map((item,i)=>
    i<items.length-1
      ? `<a href="${item.href}" style="color:#60A5FA;">${item.label}</a>`
      : `<span>${item.label}</span>`
  ).join(' <span style="color:var(--text-muted);">›</span> ')}</div>`;
}

function comparisonTable(rows) {
  return `<div class="comparison-table-wrapper"><div class="table-responsive"><table class="comparison-table">
    <thead><tr>
      <th>Feature</th>
      <th class="clearcut-col">ClearCut (Free)</th>
      ${rows[0].others.map(o=>`<th>${o.name}</th>`).join('')}
    </tr></thead>
    <tbody>
      ${rows.map(r=>`<tr>
        <td><strong>${r.feature}</strong></td>
        <td class="clearcut-col"><span class="table-check">${r.clearcut}</span></td>
        ${r.others.map(o=>`<td class="others-col"><span class="${o.good?'table-check':'table-cross'}">${o.val}</span></td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table></div></div>`;
}

/* ──────────────────────────────────────────────────────────────────
   BASE PAGE TEMPLATE
   ────────────────────────────────────────────────────────────────── */

function navLinks(active='') {
  const links = [
    {href:'/',label:'Home'},
    {href:'/pages/best-free-background-remover-apps.html',label:'Compare'},
    {href:'/pages/blog/',label:'Blog'},
    {href:'/pages/how-to/remove-background-android.html',label:'Guides'},
    {href:'/pages/free-online-background-remover.html',label:'🔥 Free Tool',hl:true},
    {href:'/pages/about.html',label:'About'},
  ];
  return links.map(l=>`<li><a href="${l.href}" class="nav-link${l.hl?' nav-highlight':''}${active===l.label?' active':''}">${l.label}</a></li>`).join('');
}

function header(active='') {
  return `<header class="header" id="navbar">
    <div class="container nav-container">
      <a href="/" class="brand" aria-label="ClearCut Homepage">
        <div class="brand-icon"><img src="/assets/logo.svg" alt="ClearCut" width="44" height="44"></div>
        <div class="brand-text">
          <span class="brand-name"><span class="clear">Clear</span><span class="cut">Cut</span></span>
          <span class="brand-tagline">Background Remover</span>
        </div>
      </a>
      <nav aria-label="Main Navigation">
        <ul class="nav-menu" id="navMenu">${navLinks(active)}</ul>
      </nav>
      <div class="nav-actions">
        <button class="btn btn-primary btn-sm open-download-modal" id="navDownloadBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Download Free</span>
        </button>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="footer">
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
          <p>Free Android background remover. On-device AI. No account, no uploads, no watermark.</p>
          <div class="footer-slogan-badge">Free • Offline • On Your Device</div>
        </div>
        <div class="footer-col">
          <h4>Compare</h4>
          <ul class="footer-links">
            <li><a href="/pages/remove-bg-alternative.html">remove.bg Alternative</a></li>
            <li><a href="/pages/photoroom-alternative.html">PhotoRoom Alternative</a></li>
            <li><a href="/pages/best-free-background-remover-apps.html">Best Free Apps</a></li>
            <li><a href="/pages/offline-background-remover.html">Offline Remover</a></li>
            <li><a href="/pages/background-remover-no-watermark.html">No Watermark</a></li>
            <li><a href="/pages/background-remover-no-signup.html">No Sign-Up</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Use Cases</h4>
          <ul class="footer-links">
            <li><a href="/pages/passport-photo-background-remover.html">Passport Photo</a></li>
            <li><a href="/pages/product-photo-background-remover.html">Product Photos</a></li>
            <li><a href="/pages/transparent-background-maker.html">Transparent PNG</a></li>
            <li><a href="/pages/white-background-photo-maker.html">White Background</a></li>
            <li><a href="/pages/youtube-thumbnail-background-remover.html">YouTube Thumbnails</a></li>
            <li><a href="/pages/sticker-maker-background-remover.html">Sticker Maker</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal & Info</h4>
          <ul class="footer-links">
            <li><a href="/pages/privacy-policy.html">Privacy Policy</a></li>
            <li><a href="/pages/terms-of-service.html">Terms of Service</a></li>
            <li><a href="/pages/about.html">About</a></li>
            <li><a href="/pages/contact.html">Contact</a></li>
            <li><a href="/pages/changelog.html">Changelog</a></li>
            <li><a href="/pages/blog/">Blog</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${YEAR} ClearCut. All rights reserved.</span>
        <span>Made with privacy & precision · <a href="mailto:${EMAIL}" style="color:#60A5FA;">${EMAIL}</a></span>
      </div>
    </div>
  </footer>`;
}

function scripts() {
  return `<script>
    const navbar=document.getElementById('navbar');
    const toggle=document.getElementById('menuToggle');
    const menu=document.getElementById('navMenu');
    window.addEventListener('scroll',()=>navbar?.classList.toggle('scrolled',scrollY>40));
    toggle?.addEventListener('click',()=>{const o=menu?.classList.toggle('open');toggle.classList.toggle('active',o);toggle.setAttribute('aria-expanded',o);});
    menu?.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{menu.classList.remove('open');toggle.classList.remove('active');}));

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item=>{
      item.querySelector('.faq-question')?.addEventListener('click',()=>{
        const was=item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
        if(!was) item.classList.add('open');
      });
    });

    // Before/After Sliders
    document.querySelectorAll('.before-after-slider').forEach(sl=>{
      const sh=sl.querySelector('.slider-handle');
      const sb=sl.querySelector('.layer-before');
      if(!sh||!sb) return;
      let d=false, p=50;
      const mv=x=>{
        const r=sl.getBoundingClientRect();
        p=Math.max(0,Math.min(100,((x-r.left)/r.width)*100));
        sh.style.left=p+'%';
        sb.style.clipPath='polygon(0 0,'+p+'% 0,'+p+'% 100%,0 100%)';
        sl.setAttribute('aria-valuenow',Math.round(p));
      };
      sl.addEventListener('mousedown',e=>{d=true;mv(e.clientX);});
      window.addEventListener('mousemove',e=>{if(d)mv(e.clientX);});
      window.addEventListener('mouseup',()=>d=false);
      sl.addEventListener('touchstart',e=>{d=true;mv(e.touches[0].clientX);},{passive:true});
      window.addEventListener('touchmove',e=>{if(d)mv(e.touches[0].clientX);},{passive:true});
      window.addEventListener('touchend',()=>d=false);
      sl.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'){p=Math.max(0,p-5);}
        else if(e.key==='ArrowRight'){p=Math.min(100,p+5);}
        else return;
        e.preventDefault();
        sh.style.left=p+'%';
        sb.style.clipPath='polygon(0 0,'+p+'% 0,'+p+'% 100%,0 100%)';
        sl.setAttribute('aria-valuenow',Math.round(p));
      });
    });

    // Download Modal
    const downloadModal = document.getElementById('downloadModal');
    const openModal = () => downloadModal?.classList.add('open');
    const closeModal = () => downloadModal?.classList.remove('open');
    document.querySelectorAll('.open-download-modal').forEach(b => b.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    }));
    downloadModal?.querySelectorAll('.close-modal-btn').forEach(b => b.addEventListener('click', closeModal));
    downloadModal?.addEventListener('click', (e) => {
      if (e.target === downloadModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Toast
    const toast = document.getElementById('toastNotice');
    const showToast = (msg) => {
      if (!toast) return;
      document.getElementById('toastMessage').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    };
    document.getElementById('confirmPlayStoreBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Opening Google Play Store...');
      closeModal();
    });
    document.getElementById('confirmApkDownloadBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Downloading ClearCut v1.2.0 APK (24.8MB)...');
      closeModal();
    });

    // Animate In Observer
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}}),{threshold:.08});
    document.querySelectorAll('.animate-in').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(24px)';el.style.transition='opacity .5s ease,transform .5s ease';obs.observe(el);});
  </script>`;
}

function page({title, metaDesc, keywords='', canonical='', activeNav='', head='', body}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  ${keywords?`<meta name="keywords" content="${keywords}">`:''}
  <meta name="theme-color" content="#050816">
  ${canonical?`<link rel="canonical" href="https://clearcut.app${canonical}">`:''}
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="/assets/logo.svg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"ClearCut – Background Remover","operatingSystem":"Android","applicationCategory":"PhotographyApplication","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","ratingCount":"18450"}}</script>
  ${head}
</head>
<body>
  <!-- Ambient Glowing Orbs -->
  <div class="ambient-glow" aria-hidden="true">
    <div class="glow-orb glow-orb-1"></div>
    <div class="glow-orb glow-orb-2"></div>
    <div class="glow-orb glow-orb-3"></div>
  </div>

  <!-- Hidden SVG Clip-Paths for On-Device Subject Isolation -->
  <svg width="0" height="0" class="svg-defs" style="position: absolute; pointer-events: none;" aria-hidden="true">
    <defs>
      <!-- Portrait Woman Silhouette -->
      <clipPath id="portrait-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0.05 1.0 C 0.05 0.88 0.12 0.76 0.18 0.62 C 0.22 0.52 0.28 0.44 0.33 0.38 C 0.29 0.30 0.30 0.18 0.35 0.08 C 0.40 0.02 0.50 0.01 0.60 0.03 C 0.68 0.07 0.73 0.18 0.70 0.28 C 0.72 0.35 0.70 0.42 0.68 0.48 C 0.73 0.55 0.80 0.64 0.86 0.76 C 0.91 0.86 0.95 0.94 0.95 1.0 Z" />
      </clipPath>

      <!-- Sneaker Silhouette -->
      <clipPath id="sneaker-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0.10 0.52 C 0.06 0.42 0.12 0.32 0.22 0.28 C 0.32 0.24 0.42 0.25 0.52 0.34 C 0.64 0.42 0.76 0.48 0.86 0.52 C 0.94 0.56 0.96 0.64 0.92 0.70 C 0.86 0.78 0.74 0.80 0.60 0.80 C 0.44 0.80 0.28 0.81 0.14 0.78 C 0.07 0.75 0.06 0.62 0.10 0.52 Z" />
      </clipPath>

      <!-- Golden Retriever Puppy Silhouette -->
      <clipPath id="dog-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0.18 0.95 C 0.16 0.82 0.19 0.68 0.22 0.52 C 0.18 0.44 0.16 0.32 0.22 0.22 C 0.30 0.10 0.44 0.06 0.56 0.06 C 0.68 0.08 0.78 0.16 0.82 0.26 C 0.86 0.38 0.82 0.50 0.78 0.58 C 0.82 0.68 0.86 0.80 0.84 0.95 Z" />
      </clipPath>

      <!-- Man Headshot Silhouette -->
      <clipPath id="man-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0.08 1.0 C 0.08 0.84 0.16 0.70 0.24 0.58 C 0.28 0.50 0.32 0.42 0.32 0.32 C 0.30 0.22 0.34 0.08 0.44 0.04 C 0.54 0.02 0.64 0.04 0.68 0.14 C 0.72 0.22 0.70 0.32 0.68 0.40 C 0.74 0.50 0.82 0.64 0.88 0.78 C 0.92 0.88 0.94 0.96 0.94 1.0 Z" />
      </clipPath>
    </defs>
  </svg>

  ${header(activeNav)}
  <main>${body}</main>
  ${footer()}

  <!-- Download & QR Code Modal -->
  <div class="modal-backdrop" id="downloadModal" role="dialog" aria-modal="true" aria-labelledby="downloadModalTitle">
    <div class="modal-dialog" style="max-width: 520px;">
      <div class="modal-header">
        <h3 id="downloadModalTitle">Download ClearCut</h3>
        <button class="modal-close-btn close-modal-btn" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-body" style="text-align: center;">
        <div style="width: 150px; height: 150px; margin: 0 auto 20px; background: #fff; padding: 10px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect width="100" height="100" fill="#FFFFFF"/>
            <rect x="10" y="10" width="24" height="24" fill="#050816"/>
            <rect x="14" y="14" width="16" height="16" fill="#FFFFFF"/>
            <rect x="18" y="18" width="8" height="8" fill="#050816"/>
            <rect x="66" y="10" width="24" height="24" fill="#050816"/>
            <rect x="70" y="14" width="16" height="16" fill="#FFFFFF"/>
            <rect x="74" y="18" width="8" height="8" fill="#050816"/>
            <rect x="10" y="66" width="24" height="24" fill="#050816"/>
            <rect x="14" y="70" width="16" height="16" fill="#FFFFFF"/>
            <rect x="18" y="74" width="8" height="8" fill="#050816"/>
            <rect x="38" y="14" width="6" height="6" fill="#050816"/>
            <rect x="48" y="18" width="6" height="6" fill="#050816"/>
            <rect x="38" y="28" width="6" height="6" fill="#050816"/>
            <rect x="48" y="38" width="6" height="6" fill="#050816"/>
            <rect x="14" y="44" width="6" height="6" fill="#050816"/>
            <rect x="24" y="48" width="6" height="6" fill="#050816"/>
            <rect x="74" y="44" width="6" height="6" fill="#050816"/>
            <rect x="84" y="48" width="6" height="6" fill="#050816"/>
            <rect x="38" y="66" width="6" height="6" fill="#050816"/>
            <rect x="48" y="74" width="6" height="6" fill="#050816"/>
            <rect x="66" y="66" width="6" height="6" fill="#050816"/>
            <rect x="78" y="78" width="6" height="6" fill="#050816"/>
          </svg>
        </div>

        <h4 style="margin-bottom: 6px;">Scan with Your Android Phone</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 24px;">
          Direct Google Play Store download or verified direct APK installation.
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <a href="#" class="btn btn-primary btn-lg" id="confirmPlayStoreBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3l14 9-14 9V3z"/></svg>
            <span>Open in Google Play Store</span>
          </a>

          <button class="btn btn-secondary btn-lg" id="confirmApkDownloadBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Direct APK (v1.2.0 • 24.8MB)</span>
          </button>
        </div>

        <div style="margin-top: 18px; font-size: 0.78rem; color: var(--text-muted);">
          SHA-256: 8f4c82b1...32d9 • Free • No ads during edit
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast-notice" id="toastNotice" role="alert" aria-live="polite">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toastMessage">Success!</span>
  </div>

  ${scripts()}
</body>
</html>`;
}

/* ──────────────────────────────────────────────────────────────────
   PAGE DEFINITIONS
   ────────────────────────────────────────────────────────────────── */

const PAGES = [];

/* ── 1. PRIVACY POLICY ─────────────────────────────────────────── */
PAGES.push({
  path: 'pages/privacy-policy.html',
  data: page({
    title: 'Privacy Policy – ClearCut Background Remover',
    metaDesc: 'ClearCut Privacy Policy. Your photos never leave your device. No uploads, no servers, no tracking.',
    canonical: '/pages/privacy-policy',
    activeNav: 'About',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container" style="max-width:820px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Privacy Policy'}])}
        <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:40px;">
          <span class="section-tag">Last Updated: October ${YEAR}</span>
          <h1 class="section-title">Privacy Policy</h1>
          <p class="section-desc">ClearCut is built with a privacy-first architecture. We believe your personal photos are exactly that—personal.</p>
        </div>
        <div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.35);border-radius:16px;padding:24px;margin-bottom:40px;display:flex;gap:16px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div><strong style="color:#34D399;display:block;margin-bottom:6px;">TL;DR – Your Photos Never Leave Your Phone</strong>All background removal is performed locally on your device. We have no servers. We store no photos. We collect no personal data.</div>
        </div>

        ${[
          {title:'1. On-Device Processing Only', body:'ClearCut uses a neural network model that runs entirely within your Android device\'s memory and processor. When you select a photo, it is loaded directly from your device storage and processed locally. The resulting cutout is saved back to your device. At no point is your image transmitted over the internet or sent to any external server, cloud service, or third-party API.'},
          {title:'2. No Personal Data Collection', body:'ClearCut does not collect your name, email address, phone number, device identifiers, or any other personally identifiable information (PII). We do not require you to create an account, log in, or register. There is no user database.'},
          {title:'3. Camera & Storage Permissions', body:'ClearCut requests Android storage and camera permissions solely to allow you to (a) select photos from your gallery, (b) take a photo with your camera, and (c) save edited images back to your device. These permissions are used entirely on-device and do not enable any form of remote access to your files.'},
          {title:'4. No Advertising or Analytics SDKs', body:'ClearCut does not embed third-party advertising networks, behavioral analytics SDKs, or social media trackers. The app is distributed through Google Play, which may collect standard anonymized crash and stability diagnostics under Google\'s own developer terms, separate from ClearCut.'},
          {title:'5. Edit History', body:'The History screen stores references to previously edited images. This data is stored exclusively in your device\'s local storage (Room database). It is never backed up to the cloud or transmitted to us. You may clear your history at any time via Settings → Clear History.'},
          {title:'6. Children\'s Privacy', body:'ClearCut is a general-purpose photo editing app. It does not knowingly collect any information from children under 13. If you believe a child has provided personal information, please contact us so we may investigate.'},
          {title:'7. Changes to This Policy', body:'We may update this Privacy Policy from time to time. We will notify users via an in-app notice when changes are material. Continued use of the app constitutes acceptance of the revised policy.'},
          {title:'8. Contact Us', body:`If you have any privacy concerns or questions, please contact us at <a href="mailto:${EMAIL}" style="color:#60A5FA;">${EMAIL}</a>. We aim to respond within 48 hours.`},
        ].map(s=>`
          <div class="animate-in" style="margin-bottom:32px;">
            <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:12px;color:#fff;">${s.title}</h2>
            <p style="font-size:1rem;color:var(--text-secondary);line-height:1.75;">${s.body}</p>
          </div>`).join('')}
      </div>
    </section>
    ${ctaBanner('Experience True Privacy-First Background Removal')}`,
  })
});

/* ── 2. TERMS OF SERVICE ───────────────────────────────────────── */
PAGES.push({
  path: 'pages/terms-of-service.html',
  data: page({
    title: 'Terms of Service – ClearCut Background Remover',
    metaDesc: 'ClearCut Terms of Service. Free app license, intellectual property rights, and usage conditions.',
    canonical: '/pages/terms-of-service',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container" style="max-width:820px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Terms of Service'}])}
        <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:40px;">
          <span class="section-tag">Effective: October ${YEAR}</span>
          <h1 class="section-title">Terms of Service</h1>
          <p class="section-desc">Please read these terms before using ClearCut. By installing or using the app, you agree to be bound by them.</p>
        </div>
        ${[
          {title:'1. Acceptance of Terms', body:'By downloading, installing, or using ClearCut ("the App"), you agree to these Terms of Service ("Terms"). If you do not agree, please uninstall the app and do not use it.'},
          {title:'2. License Grant', body:'ClearCut grants you a revocable, non-exclusive, non-transferable, royalty-free license to use the App for personal and commercial photo editing on Android devices you own or control, subject to these Terms.'},
          {title:'3. Your Content and IP Rights', body:'You retain full ownership, copyright, and all intellectual property rights to every image you process with ClearCut. The App claims zero ownership, license, or rights over your photos. We do not access, view, or use your images.'},
          {title:'4. Permitted Use', body:'You may use ClearCut for personal projects, freelance work, commercial product photography, social media content, and any other lawful purpose. You may not use the App to process illegal content, violate third-party intellectual property rights, or engage in deceptive trade practices.'},
          {title:'5. Disclaimer of Warranties', body:'The App is provided "as is" and "as available" without warranties of any kind. We do not warrant that segmentation results will be perfect on all images or device hardware configurations. AI models have limitations on complex hair, fine detail, and low-contrast edges.'},
          {title:'6. Limitation of Liability', body:'To the maximum extent permitted by applicable law, ClearCut and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App.'},
          {title:'7. Updates and Modifications', body:'We reserve the right to update, modify, or discontinue the App at any time. We will endeavor to provide notice of significant changes via in-app notifications.'},
          {title:'8. Governing Law', body:'These Terms shall be governed by applicable laws. Any disputes shall be resolved in good faith. If resolution fails, you agree to binding arbitration.'},
          {title:'9. Contact', body:`For legal inquiries, contact us at <a href="mailto:${EMAIL}" style="color:#60A5FA;">${EMAIL}</a>.`},
        ].map(s=>`
          <div class="animate-in" style="margin-bottom:32px;">
            <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:12px;color:#fff;">${s.title}</h2>
            <p style="font-size:1rem;color:var(--text-secondary);line-height:1.75;">${s.body}</p>
          </div>`).join('')}
      </div>
    </section>`
  })
});

/* ── 3. ABOUT ──────────────────────────────────────────────────── */
PAGES.push({
  path: 'pages/about.html',
  data: page({
    title: 'About ClearCut – Free Offline Android Background Remover',
    metaDesc: 'Learn the story behind ClearCut – the 100% free, offline Android background remover built to protect your privacy.',
    canonical: '/pages/about',
    activeNav: 'About',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container" style="max-width:900px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'About'}])}
        <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:50px;">
          <span class="section-tag">Our Story</span>
          <h1 class="section-title">Why We Built <span class="gradient-text">ClearCut</span></h1>
          <p class="section-desc">We were frustrated that every good background remover required an account, an internet connection, charged a subscription, or stamped a watermark on your photos. ClearCut was the solution we needed for ourselves—and now we're sharing it free with the world.</p>
        </div>

        <div class="features-grid" style="grid-template-columns:repeat(2,1fr);margin-bottom:60px;">
          ${[
            {icon:'🎯',title:'The Mission',body:'Make professional-grade background removal free and accessible for every Android user on the planet—no gatekeeping, no subscriptions.'},
            {icon:'🛡️',title:'The Privacy Promise',body:'We believe your photos are private. That is why ClearCut uses on-device AI. Your images never leave your phone, ever.'},
            {icon:'⚡',title:'Speed First',body:'Removing a background should take under a second. Our neural network is optimized specifically for mobile hardware.'},
            {icon:'🌍',title:'Built for Everyone',body:'Works without internet in remote areas, on flights, in hospitals. Designed for users in all connectivity environments.'},
          ].map(f=>`
          <div class="feature-card animate-in">
            <div class="feature-icon-wrapper"><span style="font-size:1.6rem;">${f.icon}</span></div>
            <h3>${f.title}</h3>
            <p>${f.body}</p>
          </div>`).join('')}
        </div>

        <div class="privacy-architecture-card animate-in" style="margin-bottom:48px;">
          <h2 style="font-size:1.75rem;font-weight:800;margin-bottom:16px;">ClearCut by the Numbers</h2>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:28px;text-align:center;">
            ${[
              {num:'100%',label:'Free Forever'},
              {num:'0',label:'Watermarks Added'},
              {num:'0',label:'Photos Uploaded'},
              {num:'0',label:'Accounts Required'},
            ].map(s=>`<div>
              <div style="font-size:2.5rem;font-weight:800;background:var(--grad-cut-text);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${s.num}</div>
              <div style="font-size:.9rem;color:var(--text-secondary);margin-top:6px;">${s.label}</div>
            </div>`).join('')}
          </div>
        </div>

        <div class="animate-in">
          <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:16px;">The Team</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;margin-bottom:20px;">
            ClearCut was created by a small team of indie Android developers and machine learning engineers who are passionate about privacy, performance, and making great tools that don't cost money to use well.
          </p>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;">
            We actively maintain the app and listen to user feedback. Have a feature request or found a bug? 
            <a href="/pages/contact.html" style="color:#60A5FA;">Contact us</a> — we genuinely read every message.
          </p>
        </div>
      </div>
    </section>
    ${ctaBanner()}`
  })
});

/* ── 4. CONTACT ────────────────────────────────────────────────── */
PAGES.push({
  path: 'pages/contact.html',
  data: page({
    title: 'Contact & Support – ClearCut Background Remover',
    metaDesc: 'Contact the ClearCut team for support, bug reports, feature requests, or general feedback.',
    canonical: '/pages/contact',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container" style="max-width:760px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Contact'}])}
        <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:44px;">
          <span class="section-tag">We're Here to Help</span>
          <h1 class="section-title">Contact & <span class="gradient-text">Support</span></h1>
          <p class="section-desc">Have a question, bug report, or feature idea? Send us a message and we'll get back to you within 48 hours.</p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:44px;">
          ${[
            {icon:'🐛',title:'Bug Reports',desc:'Found something broken? Tell us exactly what happened and your Android version.',href:`mailto:${EMAIL}?subject=Bug Report`},
            {icon:'💡',title:'Feature Requests',desc:'Have an idea for a Pro Feature? We\'d love to hear what would make ClearCut better for you.',href:`mailto:${EMAIL}?subject=Feature Request`},
            {icon:'🆘',title:'Technical Support',desc:'App crashes, slow processing, or export issues? We\'ll help debug it step by step.',href:`mailto:${EMAIL}?subject=Technical Support`},
            {icon:'💌',title:'General Feedback',desc:'Just want to share your experience or say hello? That\'s welcome too.',href:`mailto:${EMAIL}?subject=General Feedback`},
          ].map(c=>`
          <div class="trust-card animate-in" style="flex-direction:column;gap:12px;">
            <div style="font-size:2rem;">${c.icon}</div>
            <h3>${c.title}</h3>
            <p style="font-size:.9rem;">${c.desc}</p>
            <a href="${c.href}" class="btn btn-secondary btn-sm" style="margin-top:auto;align-self:flex-start;">Send Message</a>
          </div>`).join('')}
        </div>

        <div class="privacy-architecture-card animate-in">
          <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:20px;">Send a Message</h2>
          <form id="contactForm" style="display:flex;flex-direction:column;gap:18px;">
            <div class="form-group">
              <label for="cName" style="font-size:.9rem;font-weight:600;color:#fff;display:block;margin-bottom:8px;">Your Name</label>
              <input type="text" id="cName" class="form-input" placeholder="Alex Smith" required>
            </div>
            <div class="form-group">
              <label for="cEmail" style="font-size:.9rem;font-weight:600;color:#fff;display:block;margin-bottom:8px;">Email Address</label>
              <input type="email" id="cEmail" class="form-input" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label for="cTopic" style="font-size:.9rem;font-weight:600;color:#fff;display:block;margin-bottom:8px;">Topic</label>
              <select id="cTopic" class="form-select">
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Technical Support</option>
              </select>
            </div>
            <div class="form-group">
              <label for="cMsg" style="font-size:.9rem;font-weight:600;color:#fff;display:block;margin-bottom:8px;">Message</label>
              <textarea id="cMsg" class="form-textarea" rows="5" placeholder="How can we help?" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">Send Message</button>
          </form>
        </div>
      </div>
    </section>
    <script>document.getElementById('contactForm')?.addEventListener('submit',e=>{e.preventDefault();e.target.innerHTML='<div style="text-align:center;padding:32px;"><div style="font-size:3rem;">✅</div><h3 style="margin-top:12px;">Message Sent!</h3><p style="color:var(--text-secondary);margin-top:8px;">We\'ll get back to you within 48 hours.</p></div>';});</script>`
  })
});

/* ── 5. CHANGELOG ──────────────────────────────────────────────── */
PAGES.push({
  path: 'pages/changelog.html',
  data: page({
    title: 'Changelog – ClearCut Background Remover App Updates',
    metaDesc: 'See what\'s new in ClearCut. Version history, bug fixes, and upcoming features for the Android background remover app.',
    canonical: '/pages/changelog',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container" style="max-width:820px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Changelog'}])}
        <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:44px;">
          <span class="section-tag">What's New</span>
          <h1 class="section-title">Changelog & <span class="gradient-text">Version History</span></h1>
          <p class="section-desc">ClearCut is actively maintained. Here is a full history of every update, fix, and improvement.</p>
        </div>

        ${[
          {version:'v1.2.0',date:'October 2026',badge:'Latest',badgeColor:'rgba(16,185,129,.2)',badgeText:'#34D399',items:[
            {good:true,text:'New gradient background presets (Sunset, Cyberpunk, Aurora, Electric, Studio Dark)'},
            {good:true,text:'Improved edge detection for hair and fur with new V2 segmentation model'},
            {good:true,text:'History screen: tap to re-export any previous cutout in original resolution'},
            {good:true,text:'AMOLED true-black dark theme for battery savings on OLED screens'},
            {good:true,text:'Performance: 35% faster AI inference on Snapdragon 8 Gen 2+'},
          ]},
          {version:'v1.1.0',date:'August 2026',badge:'',badgeColor:'',badgeText:'',items:[
            {good:true,text:'Custom image background: choose any gallery photo as backdrop'},
            {good:true,text:'New Crop tool with preset aspect ratios (Square, 4:3, 16:9, Passport)'},
            {good:true,text:'Export quality selector: Best Quality or Balanced in Settings'},
            {good:true,text:'Brightness and contrast adjustment sliders in editor'},
            {good:false,text:'Fixed crash on Android 8.0 when selecting very large images (>20MP)'},
          ]},
          {version:'v1.0.0',date:'June 2026',badge:'Launch',badgeColor:'rgba(47,107,255,.2)',badgeText:'#60A5FA',items:[
            {good:true,text:'Initial public release on Google Play Store'},
            {good:true,text:'On-device AI background removal with no internet required'},
            {good:true,text:'Solid color backgrounds: white, black, grey, red, orange, yellow, green, blue, purple, pink'},
            {good:true,text:'Camera capture and gallery picker'},
            {good:true,text:'High-quality PNG and JPEG export'},
          ]},
          {version:'Coming Soon',date:'Q1 2027',badge:'Roadmap',badgeColor:'rgba(123,63,242,.2)',badgeText:'#A78BFA',items:[
            {good:true,text:'Batch background removal (process multiple photos at once)'},
            {good:true,text:'AI shadow generator (add realistic drop shadows behind cutouts)'},
            {good:true,text:'Magic erase brush for manual edge touchup'},
            {good:true,text:'AI background generation (describe a scene, generate the backdrop)'},
          ]},
        ].map(v=>`
          <div class="privacy-architecture-card animate-in" style="margin-bottom:28px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
              <div style="display:flex;align-items:center;gap:16px;">
                <h2 style="font-size:1.5rem;font-weight:800;">${v.version}</h2>
                ${v.badge?`<span style="padding:4px 12px;border-radius:999px;background:${v.badgeColor};color:${v.badgeText};font-size:.8rem;font-weight:700;">${v.badge}</span>`:''}
              </div>
              <span style="font-size:.88rem;color:var(--text-muted);">${v.date}</span>
            </div>
            ${v.items.map(it=>checkItem(it.text,it.good)).join('')}
          </div>`).join('')}
      </div>
    </section>
    ${ctaBanner()}`
  })
});

/* ── 6. REMOVE.BG ALTERNATIVE ──────────────────────────────────── */
PAGES.push({
  path: 'pages/remove-bg-alternative.html',
  data: page({
    title: 'Best remove.bg Alternative Free – No Sign-Up, Works Offline | ClearCut',
    metaDesc: 'Looking for a remove.bg alternative that\'s free and works offline? ClearCut removes backgrounds on your Android phone with no account, no watermark, and no internet.',
    keywords: 'remove.bg alternative free, remove bg alternative no sign up, remove.bg offline alternative, background remover no account',
    canonical: '/pages/remove-bg-alternative',
    head: faqSchema([
      {q:'Is ClearCut a free remove.bg alternative?',a:'Yes. ClearCut is completely free with no usage limits or watermarks, whereas remove.bg\'s free tier limits downloads to 0.25MP preview images.'},
      {q:'Does ClearCut work offline unlike remove.bg?',a:'Yes. ClearCut uses on-device AI and works with no internet connection. remove.bg requires an internet connection and uploads your photo to their servers.'},
      {q:'Do I need an account for ClearCut?',a:'No. ClearCut requires zero sign-up. You can remove backgrounds immediately after installing the app.'},
    ]),
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'remove.bg Alternative'}])}
        <div class="hero-grid" style="gap:48px;">
          <div class="hero-content">
            <div class="hero-chip"><span class="pulse-dot"></span>High-Intent Comparison</div>
            <h1 class="hero-title">The Best <span class="gradient-text">remove.bg Alternative</span> – Free, Offline & No Sign-Up</h1>
            <p class="hero-subtitle">remove.bg is a great tool, but its free tier has real limitations: 0.25MP output, mandatory account registration, and all your photos are uploaded to their servers. ClearCut is a 100% free Android alternative that works completely offline.</p>
            <div class="hero-actions" style="margin-bottom:0;">
              ${playBtn()}
              <a href="/pages/how-to/remove-background-android.html" class="btn btn-secondary btn-lg">See How It Works</a>
            </div>
          </div>
          <div>${slider('/assets/portrait.jpg','url(#portrait-mask)','Drag to compare: original photo vs. ClearCut cutout')}</div>
        </div>
      </div>
    </section>

    <section class="section" id="comparison" style="padding:60px 0;">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Factual Comparison</span>
          <h2 class="section-title">ClearCut vs <span class="gradient-text">remove.bg</span></h2>
          <p class="section-desc">A factual, side-by-side comparison based on publicly available information as of ${YEAR}.</p>
        </div>
        ${comparisonTable([
          {feature:'Price',clearcut:'✔ Free Forever',others:[{name:'remove.bg',val:'✖ Free tier: 1 preview/month; paid plans from $9/month',good:false}]},
          {feature:'Output Resolution (Free Tier)',clearcut:'✔ Full original camera resolution (up to 4K+)',others:[{name:'remove.bg',val:'✖ 0.25 megapixel preview on free tier',good:false}]},
          {feature:'Account Required',clearcut:'✔ No account or email needed',others:[{name:'remove.bg',val:'✖ Account required to download',good:false}]},
          {feature:'Watermark',clearcut:'✔ Zero watermark on exports',others:[{name:'remove.bg',val:'✔ No watermark (but low resolution on free)',good:true}]},
          {feature:'Works Offline',clearcut:'✔ 100% offline after installation',others:[{name:'remove.bg',val:'✖ Requires internet; photos uploaded to servers',good:false}]},
          {feature:'Photo Privacy',clearcut:'✔ Never leaves your device',others:[{name:'remove.bg',val:'✖ Photos uploaded to remove.bg servers',good:false}]},
          {feature:'Platform',clearcut:'✔ Android app (native, fast)',others:[{name:'remove.bg',val:'Web + limited iOS app (no dedicated Android)',good:false}]},
          {feature:'Batch Processing',clearcut:'Coming soon (Pro Feature)',others:[{name:'remove.bg',val:'Available on paid plans',good:true}]},
        ])}
        <p style="font-size:.82rem;color:var(--text-muted);margin-top:16px;">Data sourced from publicly available pricing pages and product documentation. Verified October ${YEAR}. Pricing may change—always verify at the vendor's site.</p>
      </div>
    </section>

    <section class="section" style="padding:40px 0 60px;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Switch to <span class="gradient-text">ClearCut?</span></h2>
        </div>
        <div class="features-grid">
          ${[
            {icon:'🔒',title:'Your Photos Stay Private',body:'remove.bg uploads every image you process to their cloud servers. ClearCut runs entirely on your phone\'s processor. Zero network requests.'},
            {icon:'📶',title:'Works Without Internet',body:'On a plane? In a basement? In a rural area? ClearCut works anywhere, anytime. No Wi-Fi or mobile data consumption.'},
            {icon:'💰',title:'Genuinely Free, No Tricks',body:'No credit system, no monthly limits, no expiring trial. Every feature in ClearCut is free forever with no watermark.'},
            {icon:'📱',title:'Native Android App',body:'Built specifically for Android with hardware-optimized AI inference. Faster, smoother, and more integrated than a mobile web experience.'},
            {icon:'🎨',title:'Full Editor Built In',body:'Add solid colors, gradients, or custom photo backgrounds. Crop and adjust brightness. All in one app.'},
            {icon:'📂',title:'Persistent Edit History',body:'All your cutouts are saved locally in the History screen. Re-export or share them anytime.'},
          ].map(f=>`
          <div class="feature-card animate-in">
            <div class="feature-icon-wrapper"><span style="font-size:1.6rem;">${f.icon}</span></div>
            <h3>${f.title}</h3>
            <p>${f.body}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section" id="faq" style="padding:40px 0 60px;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Frequently Asked <span class="gradient-text">Questions</span></h2>
        </div>
        ${faqBlock([
          {q:'Is ClearCut a free remove.bg alternative?',a:'Yes. ClearCut is entirely free with no per-image charges or watermarks. remove.bg\'s free tier delivers 0.25MP preview images and requires an account.'},
          {q:'Does ClearCut work offline unlike remove.bg?',a:'Yes. ClearCut uses on-device AI and requires no internet connection after installation. remove.bg processes images on remote servers and requires internet access.'},
          {q:'Is the output quality comparable to remove.bg?',a:'ClearCut exports at full original camera resolution (up to 4K+). remove.bg\'s free tier is limited to 0.25MP. Paid remove.bg plans offer higher resolution.'},
          {q:'Does ClearCut have an API or web version?',a:'ClearCut is currently an Android app. A web tool is available at /pages/free-online-background-remover.html. An API is not available in the free version.'},
          {q:'Is my data safe with ClearCut?',a:'Completely. ClearCut processes all images locally on your device. No images are ever transmitted to external servers.'},
        ])}
      </div>
    </section>
    ${ctaBanner('Try the Best remove.bg Alternative – Free on Android')}`
  })
});

/* ── 7. PHOTOROOM ALTERNATIVE ──────────────────────────────────── */
PAGES.push({
  path: 'pages/photoroom-alternative.html',
  data: page({
    title: 'Best PhotoRoom Alternative No Subscription – Free Offline | ClearCut',
    metaDesc: 'Skip PhotoRoom\'s subscription. ClearCut removes backgrounds for free on Android with no account, no monthly fee, and no internet needed.',
    keywords: 'PhotoRoom alternative no subscription, PhotoRoom free alternative, background remover no subscription Android',
    canonical: '/pages/photoroom-alternative',
    head: faqSchema([
      {q:'Is ClearCut a free PhotoRoom alternative?',a:'Yes. ClearCut is completely free with no subscription, unlike PhotoRoom which requires a paid plan for full-resolution exports and advanced features.'},
      {q:'Does ClearCut work without internet like an offline app?',a:'Yes. ClearCut uses on-device AI and works fully offline. PhotoRoom requires an internet connection.'},
    ]),
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'PhotoRoom Alternative'}])}
        <div class="hero-grid" style="gap:48px;">
          <div class="hero-content">
            <div class="hero-chip"><span class="pulse-dot"></span>No Subscription Needed</div>
            <h1 class="hero-title"><span class="gradient-text">PhotoRoom Alternative</span> – Free Forever, No Monthly Fees</h1>
            <p class="hero-subtitle">PhotoRoom is popular, but it locks advanced features behind a subscription and requires an internet connection for every edit. ClearCut gives you powerful background removal for free, on-device, with no recurring costs.</p>
            <div class="hero-actions" style="margin-bottom:0;">${playBtn()}</div>
          </div>
          <div>${slider('/assets/sneaker.jpg','url(#sneaker-mask)','Product photo background removal – no subscription required')}</div>
        </div>
      </div>
    </section>

    <section class="section" style="padding:60px 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">ClearCut vs <span class="gradient-text">PhotoRoom</span></h2>
        </div>
        ${comparisonTable([
          {feature:'Price',clearcut:'✔ 100% Free',others:[{name:'PhotoRoom',val:'✖ Subscription required for full features',good:false}]},
          {feature:'Account Required',clearcut:'✔ No account needed',others:[{name:'PhotoRoom',val:'✖ Account required',good:false}]},
          {feature:'Works Offline',clearcut:'✔ Fully offline',others:[{name:'PhotoRoom',val:'✖ Requires internet connection',good:false}]},
          {feature:'Watermark (Free Tier)',clearcut:'✔ Zero watermark',others:[{name:'PhotoRoom',val:'✖ Watermark added on free tier',good:false}]},
          {feature:'Photo Privacy',clearcut:'✔ Photos never uploaded',others:[{name:'PhotoRoom',val:'✖ Photos processed on cloud servers',good:false}]},
          {feature:'Custom Backgrounds',clearcut:'✔ Solid, gradient, custom photo',others:[{name:'PhotoRoom',val:'✔ Advanced AI scene generation (paid)',good:true}]},
          {feature:'Platform',clearcut:'✔ Android (native)',others:[{name:'PhotoRoom',val:'iOS + Android + Web',good:true}]},
        ])}
        <p style="font-size:.82rem;color:var(--text-muted);margin-top:12px;">Data from publicly available product information. Verified October ${YEAR}.</p>
      </div>
    </section>
    ${ctaBanner('Download the Free PhotoRoom Alternative')}`
  })
});

/* ── 8. BEST FREE APPS ──────────────────────────────────────────── */
PAGES.push({
  path: 'pages/best-free-background-remover-apps.html',
  data: page({
    title: '10 Best Free Background Remover Apps for Android in 2026',
    metaDesc: 'Ranked: the best free background remover apps for Android in 2026. Includes offline apps, no-watermark apps, and no-account options.',
    keywords: 'best free background remover app Android, top background remover Android 2026, free background eraser Android',
    canonical: '/pages/best-free-background-remover-apps',
    activeNav: 'Compare',
    head: faqSchema([
      {q:'What is the best free background remover app for Android?',a:'ClearCut is ranked #1 because it is 100% free, works offline, requires no account, and adds no watermark to exported images.'},
      {q:'Which background remover works without internet on Android?',a:'ClearCut is the leading offline background remover for Android, using on-device AI that requires no internet connection.'},
    ]),
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Best Free Apps'}])}
        <div class="section-header">
          <span class="section-tag">Ranked & Reviewed</span>
          <h1 class="section-title">10 Best Free Background Remover <span class="gradient-text">Apps for Android</span> in ${YEAR}</h1>
          <p class="section-desc">We tested every major background remover app available on Android. Here's our honest, factual ranking based on cost, privacy, output quality, and offline capability.</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:28px;margin-bottom:60px;">
          ${[
            {rank:1,name:'ClearCut – Background Remover',badge:'Editor\'s Choice',badgeColor:'rgba(16,185,129,.2)',badgeText:'#34D399',pros:['100% free, forever','Works 100% offline','No account or sign-up','No watermark on exports','Full-resolution exports (up to 4K+)','Photos never leave your device'],cons:['Android only (no iOS or web)','No batch processing yet (coming soon)'],score:'9.8/10',href:'/'},
            {rank:2,name:'Background Eraser – Mobile App',badge:'',badgeColor:'',badgeText:'',pros:['Manual eraser brush for detailed work','Good for complex backgrounds'],cons:['Requires internet for AI mode','Watermark on free tier','Account required'],score:'7.2/10',href:'#'},
            {rank:3,name:'remove.bg (web + limited app)',badge:'',badgeColor:'',badgeText:'',pros:['Excellent AI quality','API available for developers','Multiple integrations'],cons:['Free tier: 0.25MP only','Uploads photos to servers','Requires account','Expensive for heavy use'],score:'7.5/10',href:'#'},
            {rank:4,name:'PhotoRoom',badge:'',badgeColor:'',badgeText:'',pros:['Good product photography templates','AI scene generator'],cons:['Subscription required for full use','Watermark on free tier','Photos uploaded to cloud','Account mandatory'],score:'7.0/10',href:'#'},
          ].map(app=>`
          <div class="privacy-architecture-card animate-in">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
              <div style="display:flex;align-items:center;gap:16px;">
                <div style="width:48px;height:48px;border-radius:14px;background:var(--grad-primary);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:#fff;flex-shrink:0;">#${app.rank}</div>
                <div>
                  <h2 style="font-size:1.35rem;font-weight:800;margin-bottom:4px;">${app.name}</h2>
                  ${app.badge?`<span style="padding:3px 10px;border-radius:999px;background:${app.badgeColor};color:${app.badgeText};font-size:.76rem;font-weight:700;">${app.badge}</span>`:''}
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:1.6rem;font-weight:800;background:var(--grad-cut-text);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${app.score}</div>
                <div style="font-size:.78rem;color:var(--text-muted);">Overall Score</div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
              <div>
                <h4 style="font-size:.88rem;font-weight:700;color:#34D399;margin-bottom:10px;">✔ Pros</h4>
                ${app.pros.map(p=>`<div style="font-size:.88rem;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);color:var(--text-secondary);">• ${p}</div>`).join('')}
              </div>
              <div>
                <h4 style="font-size:.88rem;font-weight:700;color:#F87171;margin-bottom:10px;">✖ Cons</h4>
                ${app.cons.map(c=>`<div style="font-size:.88rem;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);color:var(--text-secondary);">• ${c}</div>`).join('')}
              </div>
            </div>
            ${app.rank===1?`<div style="margin-top:20px;">${playBtn()}</div>`:''}
          </div>`).join('')}
        </div>

        <div class="section-header" style="margin-bottom:32px;">
          <h2 class="section-title">Quick Comparison Table</h2>
        </div>
        ${comparisonTable([
          {feature:'100% Free',clearcut:'✔',others:[{name:'remove.bg',val:'Freemium',good:false},{name:'PhotoRoom',val:'Subscription',good:false}]},
          {feature:'No Account',clearcut:'✔',others:[{name:'remove.bg',val:'✖ Required',good:false},{name:'PhotoRoom',val:'✖ Required',good:false}]},
          {feature:'Offline / No Upload',clearcut:'✔',others:[{name:'remove.bg',val:'✖ Cloud',good:false},{name:'PhotoRoom',val:'✖ Cloud',good:false}]},
          {feature:'No Watermark',clearcut:'✔',others:[{name:'remove.bg',val:'✔ (low-res free)',good:true},{name:'PhotoRoom',val:'✖ Paid only',good:false}]},
          {feature:'Full Resolution',clearcut:'✔ Always',others:[{name:'remove.bg',val:'✖ Paid only',good:false},{name:'PhotoRoom',val:'✖ Paid only',good:false}]},
        ])}
      </div>
    </section>
    ${ctaBanner('Download ClearCut – #1 Free Android Background Remover')}`
  })
});

/* ── 9. OFFLINE BACKGROUND REMOVER ─────────────────────────────── */
PAGES.push({
  path: 'pages/offline-background-remover.html',
  data: page({
    title: 'Background Remover That Works Offline – No Internet Needed | ClearCut',
    metaDesc: 'ClearCut removes backgrounds from photos offline on Android. On-device AI means no internet, no cloud uploads, and instant results anytime.',
    keywords: 'background remover offline Android, offline background eraser, remove background without internet, on device AI background removal',
    canonical: '/pages/offline-background-remover',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Offline Background Remover'}])}
        <div class="hero-grid" style="gap:48px;">
          <div class="hero-content">
            <div class="hero-chip"><span class="pulse-dot"></span>Works Without Internet</div>
            <h1 class="hero-title">Background Remover That <span class="gradient-text">Works Offline</span> on Android</h1>
            <p class="hero-subtitle">Most background remover apps require an internet connection because they process your images on remote servers. ClearCut uses on-device AI—remove backgrounds on planes, in basements, in rural areas, or anywhere without Wi-Fi or mobile data.</p>
            <div class="hero-actions" style="margin-bottom:28px;">${playBtn()}</div>
            <div class="hero-trust-badges">
              <div class="trust-badge-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/></svg>No Wi-Fi Needed</div>
              <div class="trust-badge-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Zero Cloud Uploads</div>
              <div class="trust-badge-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>0 Data Used</div>
            </div>
          </div>
          <div>${slider('/assets/dog.jpg','url(#dog-mask)','Works offline – no internet, no cloud')}</div>
        </div>
      </div>
    </section>

    <section class="section" style="padding:60px 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How Offline AI <span class="gradient-text">Background Removal</span> Works</h2>
          <p class="section-desc">ClearCut uses a compact, mobile-optimized neural network that runs entirely on your phone's chipset—no servers involved.</p>
        </div>
        <div class="timeline-steps-list animate-in">
          ${stepBlock([
            {title:'Model Downloaded Once at Install',desc:'When you install ClearCut from Google Play, the on-device AI model (~18MB) is bundled with the app. It is stored on your device and never needs re-downloading.'},
            {title:'Your Phone Becomes the AI Processor',desc:'When you select a photo, your Android\'s CPU and GPU execute the segmentation model locally in milliseconds. The result is an alpha-masked PNG cutout.'},
            {title:'No Internet Requests Made',desc:'ClearCut makes zero network calls during photo processing. You can verify this in your device\'s data usage settings—ClearCut uses 0 bytes of mobile data.'},
            {title:'Result Saved to Local Gallery',desc:'The exported cutout is saved directly to your device\'s photo gallery. No intermediate cloud storage involved.'},
          ])}
        </div>
      </div>
    </section>
    ${ctaBanner('Download the Offline Background Remover')}`
  })
});

/* ── 10. NO WATERMARK ───────────────────────────────────────────── */
PAGES.push({
  path: 'pages/background-remover-no-watermark.html',
  data: page({
    title: 'Background Remover Without Watermark – Free & Full Resolution | ClearCut',
    metaDesc: 'ClearCut removes backgrounds with zero watermark on every export. Free, full resolution, no subscription needed. The only background remover that\'s truly free.',
    keywords: 'background remover without watermark, background eraser no watermark, remove background free no watermark Android',
    canonical: '/pages/background-remover-no-watermark',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'No Watermark'}])}
        <div class="hero-grid" style="gap:48px;">
          <div class="hero-content">
            <div class="hero-chip"><span class="pulse-dot"></span>Zero Watermark – Forever Free</div>
            <h1 class="hero-title">Background Remover <span class="gradient-text">Without Watermark</span> – 100% Free</h1>
            <p class="hero-subtitle">Tired of apps that stamp a logo on your photo unless you pay? ClearCut has never added a watermark to a single export. Every image you remove the background from is yours—clean, full-resolution, and watermark-free.</p>
            <div class="hero-actions" style="margin-bottom:0;">${playBtn()}</div>
          </div>
          <div>
            ${slider('/assets/portrait.jpg','url(#portrait-mask)','Clean export – no logo, no watermark, no branding')}
            <div style="margin-top:16px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:16px 20px;display:flex;gap:12px;align-items:center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style="font-size:.9rem;"><strong>Clean PNG, No Watermark</strong> – verified on every export</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    ${ctaBanner('Export Watermark-Free Images – Download ClearCut')}`
  })
});

/* ── 11. NO SIGNUP ──────────────────────────────────────────────── */
PAGES.push({
  path: 'pages/background-remover-no-signup.html',
  data: page({
    title: 'Background Remover No Sign Up – Start Instantly | ClearCut',
    metaDesc: 'Remove backgrounds instantly with no account, no email, no password. ClearCut works the moment you install it on Android.',
    keywords: 'background remover no sign up, background eraser no account, remove background without registration Android',
    canonical: '/pages/background-remover-no-signup',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'No Sign-Up'}])}
        <div class="hero-grid" style="gap:48px;">
          <div class="hero-content">
            <div class="hero-chip"><span class="pulse-dot"></span>No Account Required</div>
            <h1 class="hero-title">Background Remover <span class="gradient-text">Without Sign Up</span> – Open & Start</h1>
            <p class="hero-subtitle">Why should removing a background require creating an account, verifying your email, or handing over personal information? ClearCut asks for nothing. Install, open, and start removing backgrounds in seconds.</p>
            <div class="hero-actions" style="margin-bottom:24px;">${playBtn()}</div>
            <div style="display:flex;flex-direction:column;gap:12px;">
              ${[
                'No email address required',
                'No Google or Facebook login',
                'No phone number verification',
                'No password to remember',
                'No personal data stored anywhere',
              ].map(t=>checkItem(t,true)).join('')}
            </div>
          </div>
          <div>${slider('/assets/man_portrait.jpg','url(#man-mask)','No account needed – remove backgrounds instantly')}</div>
        </div>
      </div>
    </section>
    ${ctaBanner('Download ClearCut – No Sign-Up Required')}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   USE-CASE PAGES (12–20)
   ────────────────────────────────────────────────────────────────── */

const USE_CASES = [
  {
    path:'pages/passport-photo-background-remover.html',
    slug:'/pages/passport-photo-background-remover',
    title:'Passport Photo Background Remover – Change to White or Blue | ClearCut',
    metaDesc:'Make a passport photo on your Android phone. ClearCut removes the background and lets you apply official white or plain blue. No studio needed.',
    keywords:'passport photo background remover, passport photo maker Android, change passport photo background white',
    img:'/assets/man_portrait.jpg',mask:'url(#man-mask)',
    h1:'Passport Photo Background Remover for Android',
    subtitle:'Take your own passport photo at home and replace the background with official plain white or light blue—no photography studio or account needed.',
    useCase:'Passport & ID Photos',
    features:['Change background to plain white or solid color','Works without internet—fully offline','Full-resolution export (no compression)','Crop to passport photo dimensions (e.g. 35×45mm)','Zero watermark on exported image'],
    faqs:[
      {q:'Can I use ClearCut to make a passport photo?',a:'Yes. Take a photo against any background, use ClearCut to remove it, set a solid white or light blue background, then crop to standard passport dimensions.'},
      {q:'What background color is required for passport photos?',a:'Most countries require a plain white or off-white background. Some require light grey or light blue. Check your country\'s official passport photo requirements.'},
      {q:'Will the exported photo be high enough quality?',a:'Yes. ClearCut exports at full original camera resolution. For best results, use your phone\'s main rear camera in good lighting.'},
    ],
  },
  {
    path:'pages/product-photo-background-remover.html',
    slug:'/pages/product-photo-background-remover',
    title:'Product Photo Background Remover – Free for E-Commerce & Etsy Sellers | ClearCut',
    metaDesc:'Remove product photo backgrounds for free on Android. Perfect for Amazon, Etsy, Shopify, and eBay sellers. White background, full resolution, no watermark.',
    keywords:'product photo background remover, e-commerce background remover Android, remove product background white Etsy Amazon',
    img:'/assets/sneaker.jpg',mask:'url(#sneaker-mask)',
    h1:'Product Photo Background Remover for E-Commerce Sellers',
    subtitle:'Create professional white-background product photos for Amazon, Etsy, Shopify, and eBay. Free, offline, and full-resolution—no studio required.',
    useCase:'E-Commerce & Etsy',
    features:['Remove messy home backgrounds from product shots','Apply clean white background (Amazon / marketplace standard)','Export at original camera resolution for print-quality images','Process photos on the go from your phone','Zero cost – no per-image fees or subscriptions'],
    faqs:[
      {q:'Can I use ClearCut for Amazon product photos?',a:'Yes. Amazon requires pure white backgrounds (RGB 255,255,255). ClearCut lets you apply a white solid background to any product cutout.'},
      {q:'Does ClearCut work for jewelry and small products?',a:'ClearCut works best on objects with clear contrast between product and background. Jewelry on a contrasting surface works well. Very reflective or transparent products may need manual touch-up.'},
      {q:'How many product photos can I remove backgrounds from?',a:'Unlimited. ClearCut has no per-image limit. Batch processing is coming in a future update.'},
    ],
  },
  {
    path:'pages/profile-picture-background-remover.html',
    slug:'/pages/profile-picture-background-remover',
    title:'Profile Picture Background Remover – LinkedIn, Twitter, CV | ClearCut',
    metaDesc:'Create a professional profile picture by removing the background with ClearCut. Free Android app, no account, works offline.',
    keywords:'profile picture background remover Android, LinkedIn profile photo background, remove background profile picture free',
    img:'/assets/portrait.jpg',mask:'url(#portrait-mask)',
    h1:'Profile Picture Background Remover for LinkedIn, CV & Social Media',
    subtitle:'Create a clean, professional headshot for LinkedIn, your CV, Twitter, or any platform by removing the background and applying a neutral solid color.',
    useCase:'Profile & LinkedIn Photos',
    features:['Remove cluttered home or office backgrounds','Apply clean white, grey, or solid color backdrop','Export in square (1:1) format ideal for profile pictures','Works completely offline—no internet required','No account, no watermark, no subscription'],
    faqs:[
      {q:'What background color is best for a LinkedIn profile photo?',a:'Plain white, light grey, or a soft solid color typically look most professional. Avoid busy patterns or dark backgrounds that compete with your face.'},
      {q:'Can I crop to a square after removing the background?',a:'Yes. ClearCut includes a Crop tool with preset aspect ratios including 1:1 square, ideal for profile pictures.'},
    ],
  },
  {
    path:'pages/youtube-thumbnail-background-remover.html',
    slug:'/pages/youtube-thumbnail-background-remover',
    title:'YouTube Thumbnail Background Remover – Stand Out in Search | ClearCut',
    metaDesc:'Cut yourself or any subject out of a photo for YouTube thumbnails. Free, offline, no watermark. Boost click-through rates with ClearCut.',
    keywords:'YouTube thumbnail background remover, cut out background YouTube thumbnail Android, thumbnail maker remove background',
    img:'/assets/man_portrait.jpg',mask:'url(#man-mask)',
    h1:'YouTube Thumbnail Background Remover for Creators',
    subtitle:'Cut out your face or any subject and place it on bold colorful gradients or custom images to create high-CTR YouTube thumbnails that stand out.',
    useCase:'YouTube Creators',
    features:['Extract your face/upper body for classic YouTube thumbnail style','Add vibrant gradient or solid color backdrops','Apply on striking custom photo backgrounds','Export at 1280×720 thumbnail resolution','Free, offline, zero watermark'],
    faqs:[
      {q:'What resolution should YouTube thumbnails be?',a:'YouTube recommends 1280×720 pixels (16:9 aspect ratio) at 72 DPI minimum. ClearCut exports at full camera resolution, so you can crop to exact dimensions.'},
      {q:'Can I add text to thumbnails in ClearCut?',a:'ClearCut is focused on background removal and backdrop replacement. For text overlays, export your cutout from ClearCut and use a design tool like Canva.'},
    ],
  },
  {
    path:'pages/sticker-maker-background-remover.html',
    slug:'/pages/sticker-maker-background-remover',
    title:'Sticker Maker – Remove Background & Create PNG Stickers | ClearCut',
    metaDesc:'Make custom stickers from any photo with ClearCut. Remove the background, export as transparent PNG, and use in WhatsApp, Telegram, or print.',
    keywords:'sticker maker background remover Android, make WhatsApp stickers remove background, transparent PNG sticker maker',
    img:'/assets/dog.jpg',mask:'url(#dog-mask)',
    h1:'Sticker Maker – Background Remover for Custom Stickers',
    subtitle:'Turn any photo into a custom sticker. Remove the background, get a clean transparent PNG, and use it in WhatsApp, Telegram, or print sticker sheets.',
    useCase:'Stickers & Collages',
    features:['Export transparent PNG ready for sticker apps','Perfect for pet stickers, person stickers, and object stickers','Works offline – create stickers without data usage','Full-resolution export for sharp print stickers','No watermark on exported transparent PNGs'],
    faqs:[
      {q:'How do I make WhatsApp stickers with ClearCut?',a:'Remove the background in ClearCut, export as PNG with a transparent background, then use a WhatsApp sticker maker app (like Sticker Maker Studio) to package your transparent PNGs into a sticker pack.'},
      {q:'Can I make circular or shaped stickers?',a:'ClearCut exports rectangular transparent PNGs. Use a sticker cutting app or print service to add custom shapes, borders, and die-cut options.'},
    ],
  },
  {
    path:'pages/white-background-photo-maker.html',
    slug:'/pages/white-background-photo-maker',
    title:'White Background Photo Maker – Free Android App | ClearCut',
    metaDesc:'Change any photo background to pure white instantly with ClearCut. Free Android app. Perfect for e-commerce, passports, and professional headshots.',
    keywords:'white background photo maker Android, change photo background to white free, pure white background photo app',
    img:'/assets/portrait.jpg',mask:'url(#portrait-mask)',
    h1:'White Background Photo Maker for Android',
    subtitle:'Replace any background with clean, pure white (RGB 255,255,255) in seconds. Essential for Amazon sellers, passport photos, and professional headshots.',
    useCase:'White Background Photos',
    features:['Apply pure white background (marketplace standard)','Works for people, products, pets, and objects','Offline processing – no internet needed','Full HD export – print-ready quality','Zero watermark, 100% free'],
    faqs:[
      {q:'Is the white background pure white (255,255,255)?',a:'Yes. When you select the white solid color swatch, ClearCut applies RGB 255,255,255 — the pure white required by Amazon, Etsy, and most marketplaces.'},
      {q:'Will the edges look clean against a white background?',a:'ClearCut\'s AI is optimized for clean edges. For best results, photograph your subject against a contrasting background (not white) so the AI can detect the boundary accurately.'},
    ],
  },
  {
    path:'pages/transparent-background-maker.html',
    slug:'/pages/transparent-background-maker',
    title:'Transparent Background Maker – Export PNG for Free | ClearCut',
    metaDesc:'Make any photo background transparent with ClearCut. Export as PNG with full alpha transparency, free on Android, no internet or account needed.',
    keywords:'transparent background maker Android, make photo background transparent PNG, transparent PNG maker free Android',
    img:'/assets/sneaker.jpg',mask:'url(#sneaker-mask)',
    h1:'Transparent Background Maker – Free PNG Export on Android',
    subtitle:'Extract any subject and export a transparent PNG with a clean alpha channel. Ideal for logos, stickers, graphic design, presentations, and printing.',
    useCase:'Transparent PNGs',
    features:['Export transparent PNG with alpha channel','Preview cutout on checkerboard pattern (industry standard)','Works offline – no cloud processing','Full-resolution PNG output','Compatible with Photoshop, Figma, Canva, and PowerPoint'],
    faqs:[
      {q:'What format does ClearCut use for transparent exports?',a:'ClearCut exports transparent images as PNG with a full alpha channel. JPEG does not support transparency—always choose PNG for transparent backgrounds.'},
      {q:'Can I use transparent PNGs from ClearCut in Canva or Photoshop?',a:'Yes. The transparent PNGs exported by ClearCut are standard PNG files compatible with any design tool including Canva, Adobe Photoshop, Figma, and PowerPoint.'},
    ],
  },
  {
    path:'pages/change-photo-background-color.html',
    slug:'/pages/change-photo-background-color',
    title:'Change Photo Background Color – Any Color, Free | ClearCut',
    metaDesc:'Change the background color of any photo to white, black, red, blue, or any custom color. Free Android app. Works offline. No watermark.',
    keywords:'change photo background color Android, replace photo background color free, background color changer Android',
    img:'/assets/portrait.jpg',mask:'url(#portrait-mask)',
    h1:'Change Photo Background Color – Free on Android',
    subtitle:'Replace the background of any photo with a solid color of your choice: white, black, grey, red, blue, purple, or any custom hex color you pick.',
    useCase:'Custom Background Colors',
    features:['10 preset colors: white, black, grey, red, orange, yellow, green, blue, purple, pink','Custom color picker for any hex/RGB color','Apply gradients for modern aesthetic looks','Works offline on Android','Zero watermark, full resolution export'],
    faqs:[
      {q:'Can I pick a specific hex color code for the background?',a:'Yes. ClearCut includes a color picker that lets you enter any custom color. Tap the palette icon in the Solid Color section to pick your exact shade.'},
      {q:'Can I apply gradient backgrounds?',a:'Yes. ClearCut\'s Gradient section includes multiple presets and the ability to select a custom gradient direction and colors.'},
    ],
  },
  {
    path:'pages/instagram-background-remover.html',
    slug:'/pages/instagram-background-remover',
    title:'Instagram Background Remover – Free for Stories & Reels | ClearCut',
    metaDesc:'Remove backgrounds from Instagram photos and create stunning Stories, Reels, and posts. Free Android app that works offline with no account.',
    keywords:'Instagram background remover Android, remove background Instagram photo, background remover for Instagram Stories',
    img:'/assets/portrait.jpg',mask:'url(#portrait-mask)',
    h1:'Instagram Background Remover for Stories, Reels & Posts',
    subtitle:'Cut out yourself, your pet, or any subject to create stunning Instagram Stories, Reels cutouts, and aesthetic collages. Free, offline, no watermark.',
    useCase:'Instagram & Social Media',
    features:['Perfect for Instagram Stories with gradient or image backgrounds','Create cutout overlays for Reels transitions','Export in 1:1, 4:5, and 9:16 aspect ratios for Instagram','Works offline – no data usage while creating content','Share directly from ClearCut to Instagram'],
    faqs:[
      {q:'What size should photos be for Instagram?',a:'Instagram square posts are 1:1 (1080×1080px). Stories and Reels use 9:16 (1080×1920px). Portrait posts use 4:5 (1080×1350px). ClearCut\'s Crop tool supports all these ratios.'},
      {q:'Can I share directly to Instagram from ClearCut?',a:'Yes. After processing, tap the Share button and select Instagram from the share sheet.'},
    ],
  },
];

USE_CASES.forEach(uc => {
  PAGES.push({
    path: uc.path,
    data: page({
      title: uc.title,
      metaDesc: uc.metaDesc,
      keywords: uc.keywords,
      canonical: uc.slug,
      head: faqSchema(uc.faqs),
      body: `
      <section class="section" style="padding-top:48px;">
        <div class="container">
          ${breadcrumb([{href:'/',label:'Home'},{href:uc.path.replace('pages/','../'),label:uc.useCase}])}
          <div class="hero-grid" style="gap:48px;">
            <div class="hero-content">
              <div class="hero-chip"><span class="pulse-dot"></span>${uc.useCase}</div>
              <h1 class="hero-title"><span class="gradient-text">${uc.h1}</span></h1>
              <p class="hero-subtitle">${uc.subtitle}</p>
              <div class="hero-actions" style="margin-bottom:24px;">${playBtn()}</div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                ${uc.features.map(f=>checkItem(f,true)).join('')}
              </div>
            </div>
            <div>${slider(uc.img,uc.mask,'Drag to see before & after')}</div>
          </div>
        </div>
      </section>

      <section class="section" style="padding:50px 0;">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">How to <span class="gradient-text">Remove the Background</span></h2>
          </div>
          <div class="timeline-steps-list animate-in">
            ${stepBlock([
              {title:'Install ClearCut (Free)',desc:'Download ClearCut from Google Play. No account, no payment, no sign-up required.'},
              {title:'Select Your Photo',desc:'Open the app and pick an image from your gallery or snap a new one with your camera.'},
              {title:'AI Removes the Background',desc:'ClearCut\'s on-device AI analyzes and removes the background in under 2 seconds. No internet needed.'},
              {title:'Choose Your New Background',desc:`Apply a ${uc.useCase.toLowerCase()} background: solid color, gradient, or your own photo.`},
              {title:'Export and Share',desc:'Save the full-resolution PNG or JPEG to your gallery. Zero watermark.'},
            ])}
          </div>
        </div>
      </section>

      <section class="section" style="padding:40px 0 60px;">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Frequently Asked <span class="gradient-text">Questions</span></h2>
          </div>
          ${faqBlock(uc.faqs)}
        </div>
      </section>
      ${ctaBanner('Download ClearCut Free – ' + uc.useCase)}`
    })
  });
});

/* ──────────────────────────────────────────────────────────────────
   HOW-TO GUIDES (21–26)
   ────────────────────────────────────────────────────────────────── */

const GUIDES = [
  {
    path:'pages/how-to/remove-background-android.html',
    slug:'/pages/how-to/remove-background-android',
    title:'How to Remove a Background from a Photo on Android – Step by Step',
    metaDesc:'Step-by-step guide: how to remove a background from a photo on Android using ClearCut. Free, offline, no account needed.',
    keywords:'how to remove background Android photo, remove background from photo Android step by step, background removal tutorial Android',
    h1:'How to Remove a Background from a Photo on Android',
    intro:'Removing a background from a photo on Android has never been easier. With ClearCut, you don\'t need desktop software, a subscription, or an internet connection. This guide walks you through every step.',
    steps:[
      {title:'Download ClearCut from Google Play',desc:'ClearCut is free to install. No account or credit card required. The AI model (~18MB) is bundled with the app and works offline immediately.'},
      {title:'Open ClearCut and Tap "Select Photo"',desc:'Launch the app and choose your image source: Gallery (choose an existing photo), Camera (take a new photo), or Sample Photos (try a built-in demo image).'},
      {title:'Wait 1–2 Seconds for AI Processing',desc:'ClearCut\'s on-device neural network analyzes every pixel in the photo and separates the foreground subject from the background. A progress bar shows the status.'},
      {title:'Review the Cutout on the Editor Screen',desc:'The result is shown against a grey checkerboard pattern (indicating transparency). Zoom in to inspect edges. Use the Adjust tool to fine-tune brightness if needed.'},
      {title:'Choose a Background (Optional)',desc:'Tap Background to apply a solid color, gradient, or custom photo. Or leave it transparent to export as a PNG with a clear alpha channel.'},
      {title:'Export or Share Your Image',desc:'Tap Save to export the result to your gallery at full resolution, or tap Share to send it directly to WhatsApp, Instagram, email, or any other app.'},
    ],
    tips:'For the cleanest edges, photograph your subject against a background that contrasts with it. Avoid photographing a person in black against a dark wall.',
    faqs:[
      {q:'Does this work without an internet connection?',a:'Yes. ClearCut processes all images on your device. No internet or Wi-Fi required.'},
      {q:'Which Android versions are supported?',a:'ClearCut supports Android 8.0 (Oreo) through Android 15. It is optimized for Snapdragon, Dimensity, Exynos, and Google Tensor chips.'},
      {q:'Is there a limit on how many photos I can edit?',a:'No limit at all. Edit as many photos as you like, completely free.'},
      {q:'What file format does ClearCut export?',a:'PNG (for transparent backgrounds) and JPEG (for solid/photo backgrounds). PNG preserves the alpha channel for full transparency.'},
    ],
  },
  {
    path:'pages/how-to/make-photo-background-transparent.html',
    slug:'/pages/how-to/make-photo-background-transparent',
    title:'How to Make a Photo Background Transparent on Android – Free PNG',
    metaDesc:'Make any photo background transparent on Android with ClearCut. Export a clean transparent PNG with full alpha channel. Free, offline, no account.',
    keywords:'how to make photo background transparent Android, transparent background photo Android, make PNG transparent background free',
    h1:'How to Make a Photo Background Transparent on Android',
    intro:'A transparent background (also called an alpha channel) allows you to place your subject on any backdrop in design tools, presentations, or sticker apps. Here\'s how to create one on Android using ClearCut.',
    steps:[
      {title:'Install ClearCut (Free, Android)',desc:'Download from Google Play. No sign-up, no subscription. Works offline immediately after install.'},
      {title:'Select Your Photo',desc:'Open ClearCut and tap "Choose from Gallery" or "Take Photo". Choose the image whose background you want to make transparent.'},
      {title:'Let the AI Remove the Background',desc:'ClearCut processes the image on-device in 1–2 seconds. The background is detected and removed automatically. You\'ll see your subject on a grey checkerboard (= transparency).'},
      {title:'Keep the Background as Transparent',desc:'Do not tap on any background color or image. Leave the transparent checkerboard as-is. This ensures the PNG exports with a true alpha channel.'},
      {title:'Export as PNG',desc:'Tap Save and choose PNG format. JPEG cannot store transparency — always use PNG for transparent exports. ClearCut selects PNG automatically when no background is applied.'},
      {title:'Use in Canva, Figma, or Print',desc:'Your PNG is now ready to use in any design tool. Drop it into Canva, Figma, Adobe Photoshop, PowerPoint, or order transparent sticker prints.'},
    ],
    tips:'PNG files with transparency are larger than JPEGs. This is normal. For web use, you can compress the PNG with a tool like TinyPNG after exporting.',
    faqs:[
      {q:'Can I make a transparent background without any apps?',a:'On Android, you need an app with AI background removal. ClearCut is the most capable free offline option. Web tools like remove.bg also work but require internet and an account.'},
      {q:'Does ClearCut support 16-bit or 32-bit PNG?',a:'ClearCut exports standard 8-bit RGBA PNG files, which is the format compatible with all design tools and web browsers.'},
      {q:'Why is my exported PNG showing a white background in some apps?',a:'Some apps do not support transparent PNGs and display a white fallback. Use a PNG-supporting viewer or design tool. The transparency is preserved in the file.'},
    ],
  },
  {
    path:'pages/how-to/change-background-to-white.html',
    slug:'/pages/how-to/change-background-to-white',
    title:'How to Change a Photo Background to White – Free Android Guide',
    metaDesc:'Change any photo background to pure white in seconds using ClearCut on Android. Perfect for passports, product photos, and LinkedIn headshots.',
    keywords:'change photo background to white Android, make photo background white free, white background photo maker Android',
    h1:'How to Change a Photo Background to White on Android',
    intro:'A white background is the standard for product listings, passport photos, and professional headshots. This guide shows you how to achieve a clean, pure white background on any photo using ClearCut on Android.',
    steps:[
      {title:'Install ClearCut from Google Play (Free)',desc:'No account needed. Download, open, and you\'re ready immediately.'},
      {title:'Select the Photo You Want to Edit',desc:'Tap "Choose from Gallery" and select any photo—a product shot, headshot, or any subject you want on a white background.'},
      {title:'Wait for AI Background Removal (1–2 sec)',desc:'ClearCut automatically detects and removes the background. You\'ll see your subject floating on a transparent checkerboard.'},
      {title:'Tap "Background" → "Solid Color" → White',desc:'In the editor, tap the Background tool. Select "Solid Colors" and choose the white swatch (first option). The background instantly becomes pure white (RGB 255,255,255).'},
      {title:'Check the Edges',desc:'Zoom in to inspect the cutout edges against white. If any artifacts are visible, the Adjust tool lets you fine-tune edge smoothing.'},
      {title:'Export Your White-Background Photo',desc:'Tap Save. Export as JPEG for the smallest file size (JPEG on white background has no downside since there\'s no transparency). Share to your gallery or direct to an app.'},
    ],
    tips:'Amazon and most marketplaces require pure white (RGB 255,255,255). ClearCut\'s white swatch matches this specification exactly.',
    faqs:[
      {q:'Is ClearCut\'s white background pure white (RGB 255,255,255)?',a:'Yes. Selecting the white swatch applies pure white, matching Amazon, Etsy, and marketplace requirements.'},
      {q:'My subject has white parts (like a white shirt) — will those disappear?',a:'ClearCut\'s AI uses shape and context to distinguish subject from background. However, very similar colors at the boundary can cause slight blending. Photograph light subjects against a contrasting background for best results.'},
      {q:'Can I use this for Amazon product photos?',a:'Yes. Amazon\'s image requirements include a pure white background for main product images. ClearCut\'s white background meets this specification.'},
    ],
  },
  {
    path:'pages/how-to/remove-background-without-internet.html',
    slug:'/pages/how-to/remove-background-without-internet',
    title:'How to Remove a Background Without Internet – Offline Android Guide',
    metaDesc:'Remove photo backgrounds offline on Android with no internet connection. ClearCut uses on-device AI and works anywhere — planes, remote areas, hospitals.',
    keywords:'remove background without internet Android, offline background remover guide, remove background no wifi Android',
    h1:'How to Remove a Background Without Internet Connection on Android',
    intro:'Most background removal apps silently upload your photos to remote servers — which means they don\'t work without internet. ClearCut is different: it uses on-device AI that runs fully offline. Here\'s how to use it.',
    steps:[
      {title:'Install ClearCut While You Have Internet (One-Time)',desc:'Download ClearCut from Google Play. The AI model is bundled with the app (~18MB total). After installation, you never need internet again for editing.'},
      {title:'Enable Airplane Mode (Optional Test)',desc:'To verify it works offline: turn on Airplane Mode or disable Wi-Fi and mobile data. ClearCut will still open and function perfectly.'},
      {title:'Select a Photo and Process It',desc:'Tap "Choose from Gallery", select any photo, and ClearCut will remove the background on your device\'s processor. No network requests are made.'},
      {title:'Check Your Data Usage (Verification)',desc:'Open Android Settings → Apps → ClearCut → Data Usage. You\'ll see 0 bytes of mobile data used for any editing session.'},
      {title:'Edit, Apply Backgrounds, and Export',desc:'Apply any background color, gradient, or photo backdrop. Export your final image — all locally, all offline.'},
    ],
    tips:'ClearCut\'s offline capability is ideal for healthcare professionals, journalists, and travelers who deal with sensitive photos and cannot risk cloud uploads.',
    faqs:[
      {q:'How does ClearCut remove backgrounds without internet?',a:'The AI segmentation model is stored on your device after installation. Android\'s hardware (CPU + GPU) executes the model locally without any server communication.'},
      {q:'Does ClearCut ever make network requests?',a:'ClearCut does not make network requests during photo editing. The only network communication occurs during app installation and update downloads via Google Play.'},
      {q:'Is this safer for sensitive or private photos?',a:'Yes. Medical photos, legal documents, ID photos, and personal images can be processed with zero risk of interception or unauthorized server access.'},
    ],
  },
  {
    path:'pages/how-to/make-sticker-from-photo.html',
    slug:'/pages/how-to/make-sticker-from-photo',
    title:'How to Make a Sticker from a Photo on Android – Free PNG Sticker Maker',
    metaDesc:'Turn any photo into a transparent PNG sticker on Android with ClearCut. Use for WhatsApp, Telegram sticker packs, or custom print stickers.',
    keywords:'how to make sticker from photo Android, make WhatsApp sticker Android free, photo sticker maker transparent PNG',
    h1:'How to Make a Sticker from a Photo on Android',
    intro:'Creating a custom sticker from a photo is fun and surprisingly simple. The key step is removing the background to get a transparent PNG of your subject—then it can be used in sticker apps, messaging, or printed as a physical sticker.',
    steps:[
      {title:'Take or Choose Your Photo',desc:'Pick a clear photo of a person, pet, or object with a reasonably contrasting background. Good lighting dramatically improves cutout quality.'},
      {title:'Open ClearCut and Select the Photo',desc:'Install and open ClearCut (free, no account). Tap "Choose from Gallery" and select your photo.'},
      {title:'AI Creates the Cutout',desc:'Within 1–2 seconds, ClearCut\'s on-device AI removes the background. Your subject appears on a transparent checkerboard.'},
      {title:'Export as PNG (Keep Transparent)',desc:'Do not apply any background. Tap Save and export as PNG. This gives you a clean transparent sticker ready to use.'},
      {title:'Import to a Sticker App',desc:'Open a sticker maker app (e.g. Sticker Maker Studio for WhatsApp, or Telegram\'s built-in sticker creator) and import your transparent PNG from the gallery.'},
      {title:'Share in WhatsApp, Telegram, or Print',desc:'Package your sticker in the app and send it. Or upload to a print service for physical sticker sheets.'},
    ],
    tips:'For the best stickers, use photos with sharp focus on your subject and a background that clearly contrasts with it. High contrast = cleaner cutout edges.',
    faqs:[
      {q:'Can I add a colored border (outline) to my sticker?',a:'ClearCut focuses on background removal. For border/outline effects, import your transparent PNG into a design app like Canva or use a dedicated sticker border app.'},
      {q:'What size should my sticker PNG be for WhatsApp?',a:'WhatsApp stickers must be 512×512 pixels. Telegram stickers should be at least 512px on the longest side. ClearCut exports at original resolution—resize in a photo editor if needed.'},
      {q:'Can I make animated stickers?',a:'ClearCut creates static PNG stickers. Animated sticker creation requires a separate video editing workflow.'},
    ],
  },
  {
    path:'pages/how-to/create-passport-photo-at-home.html',
    slug:'/pages/how-to/create-passport-photo-at-home',
    title:'How to Create a Passport Photo at Home Using Your Android Phone',
    metaDesc:'Make your own passport photo at home with your Android phone and ClearCut. Change background to white, crop to official size, and print or download.',
    keywords:'how to make passport photo at home Android, DIY passport photo Android, passport photo background white Android',
    h1:'How to Create a Passport Photo at Home with Your Android Phone',
    intro:'Professional passport photo studios charge $10–$25 per photo. You can achieve the same result at home using your Android camera and ClearCut for free. Here\'s a step-by-step guide that meets official passport photo requirements for most countries.',
    steps:[
      {title:'Check Your Country\'s Photo Requirements',desc:'Before photographing, look up the official passport photo specifications for your country: background color (white or off-white is most common), dimensions (e.g. 35×45mm for EU, 2×2 inches for US), and expression/glasses rules.'},
      {title:'Set Up Your Shot Correctly',desc:'Stand or sit 3–4 feet from a plain, neutral-colored wall (not white — contrast helps the AI). Use good natural lighting (face a window). Ask someone to take the photo, or use a tripod and timer. Keep a neutral expression, eyes open and looking at the camera.'},
      {title:'Take the Photo with Your Main Camera',desc:'Use your phone\'s rear main camera (not the wide-angle or ultra-wide). Shoot at full resolution. Make sure your full head, ears, and top of shoulders are visible.'},
      {title:'Open ClearCut and Remove the Background',desc:'Open ClearCut, select the photo, and let the AI remove the background in 1–2 seconds. The background is replaced with transparency (checkerboard pattern).'},
      {title:'Apply a Plain White Background',desc:'Tap Background → Solid Colors → White. This applies pure white (RGB 255,255,255) — the standard required by most passport photo services worldwide.'},
      {title:'Crop to the Required Dimensions',desc:'Tap Crop, select Custom Ratio, and enter your country\'s required dimensions (e.g. 35×45mm or 2×2 inches ratio). Center your face in the frame per the official template.'},
      {title:'Export and Print',desc:'Tap Save to export at full camera resolution. Send to a print shop, use a passport photo printing app, or print at home on 4×6 photo paper.'},
    ],
    tips:'Many countries require the head to occupy 70–80% of the frame and eyes to be at a specific height. Download your country\'s official template image to overlay for precise framing.',
    faqs:[
      {q:'Are DIY passport photos accepted?',a:'In most countries, yes — if they meet the official specifications. The US, UK, EU, Canada, and Australia all accept digital passport photos that comply with their published guidelines.'},
      {q:'What if my photo is rejected?',a:'Common rejection reasons: wrong background color, glasses, shadows on face, incorrect head size. Re-shoot following the guidelines. ClearCut\'s white background meets the color requirement.'},
      {q:'Can I use the front (selfie) camera?',a:'The rear main camera produces better quality. If using the selfie camera, ensure the resolution is high enough and have someone else take the photo to avoid the selfie angle.'},
      {q:'Is ClearCut free for this?',a:'Yes. ClearCut is 100% free. No subscription or account required.'},
    ],
  },
];

GUIDES.forEach(g => {
  PAGES.push({
    path: g.path,
    data: page({
      title: g.title,
      metaDesc: g.metaDesc,
      keywords: g.keywords,
      canonical: g.slug,
      activeNav: 'Guides',
      head: faqSchema(g.faqs),
      body: `
      <section class="section" style="padding-top:48px;">
        <div class="container" style="max-width:900px;">
          ${breadcrumb([{href:'/',label:'Home'},{href:'/pages/how-to/remove-background-android.html',label:'Guides'},{href:'#',label:g.h1.substring(0,40)+'...'}])}
          <div class="section-header" style="text-align:left;max-width:100%;margin-bottom:44px;">
            <span class="section-tag">Step-by-Step Guide</span>
            <h1 class="section-title"><span class="gradient-text">${g.h1}</span></h1>
            <p class="section-desc">${g.intro}</p>
          </div>

          <div style="margin-bottom:48px;">
            ${slider('/assets/portrait.jpg','url(#portrait-mask)','Before and after – on-device background removal')}
          </div>

          <h2 style="font-size:1.6rem;font-weight:800;margin-bottom:28px;">Step-by-Step Instructions</h2>
          <div class="timeline-steps-list animate-in" style="margin-bottom:40px;">
            ${stepBlock(g.steps)}
          </div>

          <div style="background:rgba(47,107,255,.1);border:1px solid rgba(47,107,255,.3);border-radius:16px;padding:22px 24px;margin-bottom:48px;display:flex;gap:16px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div><strong style="color:#93C5FD;">Pro Tip</strong><p style="margin-top:6px;font-size:.94rem;color:var(--text-secondary);">${g.tips}</p></div>
          </div>

          ${ctaBanner('Try ClearCut Free on Android')}

          <h2 style="font-size:1.5rem;font-weight:800;margin:40px 0 24px;">Frequently Asked Questions</h2>
          ${faqBlock(g.faqs)}
        </div>
      </section>`
    })
  });
});

/* ──────────────────────────────────────────────────────────────────
   BLOG INDEX
   ────────────────────────────────────────────────────────────────── */

const BLOG_POSTS = [
  {slug:'best-free-background-remover-apps-2026',title:'10 Best Free Background Remover Apps for Android in 2026',date:'October 10, 2026',readTime:'8 min read',tag:'Comparison',desc:'We tested every major background remover app on Android and ranked them by price, quality, privacy, and offline capability.'},
  {slug:'offline-background-removal-privacy',title:'Why Offline Background Removal Is Better for Your Privacy',date:'October 5, 2026',readTime:'5 min read',tag:'Privacy',desc:'When you upload a photo to a cloud-based background remover, where does it actually go? We explain the risks and the safer alternative.'},
  {slug:'how-background-removal-ai-works',title:'How Background Removal AI Works – Simple Explanation',date:'September 28, 2026',readTime:'6 min read',tag:'Technology',desc:'A plain-English explanation of the neural networks behind automatic background removal—no PhD required.'},
  {slug:'png-vs-jpg-transparent-images',title:'PNG vs JPG: Which Is Better for Transparent Images?',date:'September 20, 2026',readTime:'4 min read',tag:'Formats',desc:'PNG or JPEG? The answer for transparent backgrounds is clear—but here\'s everything you need to know about each format.'},
];

PAGES.push({
  path: 'pages/blog/index.html',
  data: page({
    title: 'Blog – ClearCut Background Remover Tips, Guides & News',
    metaDesc: 'ClearCut blog: tips, guides, and news about background removal, Android photo editing, AI technology, and privacy.',
    canonical: '/pages/blog/',
    activeNav: 'Blog',
    body: `
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Blog'}])}
        <div class="section-header">
          <span class="section-tag">Tips, Guides & News</span>
          <h1 class="section-title">ClearCut <span class="gradient-text">Blog</span></h1>
          <p class="section-desc">Background removal tips, Android photo editing guides, and insights on AI technology and digital privacy.</p>
        </div>

        <div class="features-grid" style="grid-template-columns:repeat(2,1fr);">
          ${BLOG_POSTS.map(p=>`
          <a href="/pages/blog/${p.slug}.html" class="feature-card animate-in" style="text-decoration:none;display:block;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              ${badge(p.tag)}
              <span style="font-size:.78rem;color:var(--text-muted);">${p.readTime}</span>
            </div>
            <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:10px;color:#fff;">${p.title}</h2>
            <p style="font-size:.9rem;color:var(--text-secondary);line-height:1.6;">${p.desc}</p>
            <div style="margin-top:16px;font-size:.82rem;color:var(--text-muted);">${p.date}</div>
          </a>`).join('')}
        </div>
      </div>
    </section>
    ${ctaBanner()}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   BLOG POST: Best Apps 2026
   ────────────────────────────────────────────────────────────────── */
PAGES.push({
  path:'pages/blog/best-free-background-remover-apps-2026.html',
  data: page({
    title:'10 Best Free Background Remover Apps for Android in 2026 | ClearCut Blog',
    metaDesc:'Ranked: the 10 best free background remover apps for Android in 2026. Tested for quality, privacy, offline support, and no-watermark exports.',
    keywords:'best background remover apps Android 2026, free background eraser Android, top background removal app',
    canonical:'/pages/blog/best-free-background-remover-apps-2026',
    activeNav:'Blog',
    body:`
    <article class="section" style="padding-top:48px;">
      <div class="container" style="max-width:860px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'/pages/blog/',label:'Blog'},{href:'#',label:'Best Apps 2026'}])}
        <header style="margin-bottom:44px;">
          ${badge('Comparison')} <span style="font-size:.82rem;color:var(--text-muted);margin-left:12px;">October 10, ${YEAR} · 8 min read</span>
          <h1 class="section-title" style="margin-top:16px;">10 Best Free Background Remover Apps <span class="gradient-text">for Android in ${YEAR}</span></h1>
          <p class="section-desc">We tested every major background remover app available on the Google Play Store and ranked them on five criteria: cost (truly free vs freemium), output quality, account requirements, offline capability, and privacy (photo upload vs on-device).</p>
        </header>

        <div style="background:rgba(47,107,255,.1);border:1px solid rgba(47,107,255,.3);border-radius:16px;padding:22px 28px;margin-bottom:44px;">
          <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:12px;">Ranking Criteria</h2>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
            ${['✔ Genuinely free (no watermark on export)','✔ No account or sign-up requirement','✔ Offline capability (no photo upload)','✔ AI edge quality on portraits and products','✔ Export resolution on the free tier','✔ Platform: native Android app vs web wrapper'].map(c=>`<div style="font-size:.9rem;color:var(--text-secondary);">${c}</div>`).join('')}
          </div>
        </div>

        ${[
          {rank:1,name:'ClearCut – Background Remover',verdict:'🏆 Best Overall',color:'rgba(16,185,129,.15)',borderColor:'rgba(16,185,129,.4)',body:'ClearCut earns the top spot by being the only background remover that is simultaneously 100% free, works offline, requires no account, and exports at full resolution with zero watermark. The on-device AI quality is competitive with cloud alternatives. Available exclusively on Android. <a href="/" style="color:#60A5FA;">Download ClearCut →</a>'},
          {rank:2,name:'remove.bg (Web + Limited App)',verdict:'Best Quality (Paid)',color:'rgba(47,107,255,.1)',borderColor:'rgba(47,107,255,.25)',body:'remove.bg produces some of the sharpest cutouts available, particularly for hair and complex edges. The free tier is severely limited (0.25MP downloads, account required). Full-resolution downloads start at $9/month or $0.20/image. Photos are processed on their servers.'},
          {rank:3,name:'PhotoRoom',verdict:'Best for Ecommerce (Paid)',color:'rgba(47,107,255,.1)',borderColor:'rgba(47,107,255,.25)',body:'PhotoRoom shines for product photography with its studio templates and AI scene replacement. The free tier adds watermarks and requires an account. A paid subscription ($9.99+/month) is needed for clean exports. Requires internet and uploads photos to the cloud.'},
          {rank:4,name:'Background Eraser',verdict:'Good Manual Tool',color:'rgba(47,107,255,.1)',borderColor:'rgba(47,107,255,.25)',body:'A solid manual eraser tool for precise edge work. The AI mode requires internet and a basic account. Free tier has resolution limits. Best used in combination with an automatic tool for rough cutouts followed by manual cleanup.'},
        ].map(app=>`
        <div class="animate-in" style="background:${app.color};border:1px solid ${app.borderColor};border-radius:18px;padding:28px;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <span style="font-size:1.6rem;font-weight:800;color:var(--text-muted);">#${app.rank}</span>
            <div>
              <h2 style="font-size:1.25rem;font-weight:800;">${app.name}</h2>
              <span style="font-size:.8rem;color:#A78BFA;font-weight:600;">${app.verdict}</span>
            </div>
          </div>
          <p style="font-size:.96rem;color:var(--text-secondary);line-height:1.75;">${app.body}</p>
        </div>`).join('')}

        <h2 style="font-size:1.5rem;font-weight:800;margin:40px 0 20px;">Quick Comparison Table</h2>
        ${comparisonTable([
          {feature:'Truly Free (No Watermark)',clearcut:'✔ Yes',others:[{name:'remove.bg',val:'✖ Freemium',good:false},{name:'PhotoRoom',val:'✖ Subscription',good:false}]},
          {feature:'No Account',clearcut:'✔ None',others:[{name:'remove.bg',val:'✖ Required',good:false},{name:'PhotoRoom',val:'✖ Required',good:false}]},
          {feature:'Offline',clearcut:'✔ Fully offline',others:[{name:'remove.bg',val:'✖ Cloud only',good:false},{name:'PhotoRoom',val:'✖ Cloud only',good:false}]},
          {feature:'Photos Uploaded',clearcut:'✔ Never',others:[{name:'remove.bg',val:'✖ To servers',good:false},{name:'PhotoRoom',val:'✖ To servers',good:false}]},
        ])}

        <div style="margin-top:44px;">
          <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:16px;">Our Recommendation</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.75;">For the vast majority of Android users, ClearCut is the clear winner. It is the only app that delivers professional results without any cost, account requirement, internet dependency, or photo privacy risk. If you need advanced web APIs or batch cloud processing, remove.bg's paid plans are worth considering.</p>
        </div>
      </div>
    </article>
    ${ctaBanner('#1 Ranked – Download ClearCut Free')}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   BLOG POST: Privacy
   ────────────────────────────────────────────────────────────────── */
PAGES.push({
  path:'pages/blog/offline-background-removal-privacy.html',
  data: page({
    title:'Why Offline Background Removal Is Better for Your Privacy | ClearCut Blog',
    metaDesc:'When you upload a photo to a cloud background remover, where does it go? We explain the risks and why on-device AI is the privacy-safe alternative.',
    canonical:'/pages/blog/offline-background-removal-privacy',
    activeNav:'Blog',
    body:`
    <article class="section" style="padding-top:48px;">
      <div class="container" style="max-width:860px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'/pages/blog/',label:'Blog'},{href:'#',label:'Privacy'}])}
        ${badge('Privacy')} <span style="font-size:.82rem;color:var(--text-muted);margin-left:12px;">October 5, ${YEAR} · 5 min read</span>
        <h1 class="section-title" style="margin-top:16px;">Why Offline Background Removal Is <span class="gradient-text">Better for Your Privacy</span></h1>
        <p class="section-desc">Every time you use a cloud-based background remover, you are sending your photos to a stranger's server. Let's examine what that actually means.</p>

        ${[
          {title:'What Happens When You Upload a Photo to a Cloud App',body:'When you drag an image into remove.bg, PhotoRoom, or any web-based background remover, your photo is transmitted via HTTPS to their servers. A server-side neural network processes the segmentation. The resulting cutout is sent back to you. Your original image may be retained for quality audits, abuse detection, model training (if permitted by terms), or a retention period defined in their privacy policy. Even with HTTPS encryption, the photo exists—unencrypted—on their servers after receipt.'},
          {title:'Why This Matters for Personal and Sensitive Photos',body:'Many people remove backgrounds from photos they consider private: ID documents, passport photos, medical images, photos of children, intimate portraits, or business documents. Uploading these to a third-party server means you\'re trusting that company\'s security practices, data retention policies, employee access controls, and breach response. High-profile cloud storage breaches have compromised hundreds of millions of images.'},
          {title:'On-Device AI: The Privacy-First Alternative',body:'ClearCut runs a compact neural network entirely within your Android phone\'s processor. The segmentation computation happens in RAM, the result is saved to your device\'s storage, and zero network requests are made during the process. There are no intermediate servers, no logs of which images you edited, and no third-party risk. The AI model is bundled with the app at installation.'},
          {title:'Verifying ClearCut Makes No Network Requests',body:'You can independently verify this with Android\'s built-in data usage tracker. Open Settings → Apps → ClearCut → Data Usage. After editing several photos, you will see 0 bytes of mobile data consumed. Alternatively, enable Airplane Mode and confirm ClearCut still functions identically.'},
          {title:'When Cloud Processing Is Acceptable',body:'Cloud-based background removal is not inherently evil—it may be acceptable for non-sensitive images like product photos of inanimate objects. However, for any photo containing a person, document, location, or identifiable private information, on-device processing is the safer choice.'},
        ].map(s=>`
        <div class="animate-in" style="margin-bottom:36px;">
          <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:12px;">${s.title}</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;">${s.body}</p>
        </div>`).join('')}
      </div>
    </article>
    ${ctaBanner('Switch to Private, Offline Background Removal')}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   BLOG POST: How AI Works
   ────────────────────────────────────────────────────────────────── */
PAGES.push({
  path:'pages/blog/how-background-removal-ai-works.html',
  data: page({
    title:'How Background Removal AI Works – Simple Explanation | ClearCut Blog',
    metaDesc:'A plain-English explanation of the AI technology behind automatic background removal. How neural networks detect and separate subjects from backgrounds.',
    canonical:'/pages/blog/how-background-removal-ai-works',
    activeNav:'Blog',
    body:`
    <article class="section" style="padding-top:48px;">
      <div class="container" style="max-width:860px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'/pages/blog/',label:'Blog'},{href:'#',label:'How AI Works'}])}
        ${badge('Technology')} <span style="font-size:.82rem;color:var(--text-muted);margin-left:12px;">September 28, ${YEAR} · 6 min read</span>
        <h1 class="section-title" style="margin-top:16px;">How Background Removal AI Works — <span class="gradient-text">Simple Explanation</span></h1>
        <p class="section-desc">No PhD required. Here's a clear, plain-English explanation of how modern AI tools like ClearCut automatically detect and separate subjects from photo backgrounds.</p>

        ${[
          {title:'The Problem: What Is "Background"?',body:'To a human, it\'s obvious which part of a photo is the "subject" and which is the "background." To a computer looking at a grid of millions of colored pixels, there is no inherent difference. Background removal AI has to learn to make this distinction—which is the same visual intelligence that makes us perceive objects as separate from their environment.'},
          {title:'Step 1 – The Neural Network Learns from Examples',body:'Background removal AI is trained on large datasets of photos where humans have manually marked which pixels are "subject" and which are "background." The network—typically a U-Net or transformer architecture for mobile—adjusts millions of internal parameters until it can correctly classify pixels it has never seen before.'},
          {title:'Step 2 – Semantic Segmentation',body:'When you load a photo into ClearCut, the neural network performs a task called semantic segmentation. It analyzes the image in layers, from coarse shapes (is this a person? a product? an animal?) down to fine edge details. Each pixel receives a probability score: "90% background, 10% foreground." Pixels above a threshold are marked as subject; below, as background.'},
          {title:'Step 3 – Edge Refinement',body:'Coarse segmentation leaves jagged or blurry edges. ClearCut\'s second-stage refinement pass analyzes the high-frequency detail at the boundary between subject and background—particularly challenging for hair, fur, and transparent materials. This pass sharpens the alpha mask to produce smooth, natural-looking cutout edges.'},
          {title:'Step 4 – Mobile Optimization',body:'Full-size neural networks require server-grade GPUs. ClearCut uses a compressed, quantized model that runs on Android\'s mobile chipset (CPU + GPU + neural processing unit). Quantization reduces model weights from 32-bit floats to 8-bit integers, enabling fast inference in under 2 seconds on mid-range Android devices.'},
          {title:'Why On-Device AI Is Now Possible',body:'Five years ago, background removal required cloud servers because mobile chips were too slow. Modern Android chipsets (Snapdragon 8 Gen series, Dimensity 9000+, Exynos 2 series, Google Tensor) include dedicated neural processing units (NPUs) that can execute optimized AI models at 10–30 trillion operations per second—fast enough for real-time photo processing entirely on your phone.'},
        ].map(s=>`
        <div class="animate-in" style="margin-bottom:36px;">
          <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:12px;">${s.title}</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;">${s.body}</p>
        </div>`).join('')}
      </div>
    </article>
    ${ctaBanner('Experience On-Device AI Background Removal')}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   BLOG POST: PNG vs JPG
   ────────────────────────────────────────────────────────────────── */
PAGES.push({
  path:'pages/blog/png-vs-jpg-transparent-images.html',
  data: page({
    title:'PNG vs JPG for Transparent Images – Which Format to Use? | ClearCut Blog',
    metaDesc:'PNG vs JPG: which image format is better for transparent backgrounds? We explain the difference, when to use each, and how ClearCut handles both.',
    canonical:'/pages/blog/png-vs-jpg-transparent-images',
    activeNav:'Blog',
    body:`
    <article class="section" style="padding-top:48px;">
      <div class="container" style="max-width:860px;">
        ${breadcrumb([{href:'/',label:'Home'},{href:'/pages/blog/',label:'Blog'},{href:'#',label:'PNG vs JPG'}])}
        ${badge('Formats')} <span style="font-size:.82rem;color:var(--text-muted);margin-left:12px;">September 20, ${YEAR} · 4 min read</span>
        <h1 class="section-title" style="margin-top:16px;">PNG vs JPG: Which Is Better for <span class="gradient-text">Transparent Images?</span></h1>
        <p class="section-desc">The short answer: use PNG for transparent backgrounds, always. But the full picture is more nuanced—here's everything you need to know.</p>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:40px 0;">
          <div style="background:rgba(47,107,255,.1);border:1px solid rgba(47,107,255,.3);border-radius:16px;padding:24px;">
            <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:14px;">PNG – Portable Network Graphics</h2>
            ${[
              {good:true,text:'Supports full alpha channel (transparency)'},
              {good:true,text:'Lossless compression (no quality degradation)'},
              {good:true,text:'Best for logos, cutouts, illustrations'},
              {good:false,text:'Larger file size than JPEG'},
              {good:false,text:'Slower to load on very large files'},
            ].map(i=>checkItem(i.text,i.good)).join('')}
          </div>
          <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:16px;padding:24px;">
            <h2 style="font-size:1.25rem;font-weight:800;margin-bottom:14px;">JPEG / JPG – Joint Photographic Group</h2>
            ${[
              {good:false,text:'Does NOT support transparency'},
              {good:false,text:'Lossy compression (some quality loss)'},
              {good:true,text:'Much smaller file sizes for photos'},
              {good:true,text:'Best for photographs with solid backgrounds'},
              {good:true,text:'Universally supported everywhere'},
            ].map(i=>checkItem(i.text,i.good)).join('')}
          </div>
        </div>

        ${[
          {title:'Why JPEG Cannot Be Transparent',body:'JPEG was designed in 1992 for compressing photographs. Its format specification does not include an alpha channel (the data layer that stores per-pixel transparency). When a JPEG is saved, any transparency information is simply discarded and replaced with white or black. This is why you\'ll sometimes see "broken" transparent images displayed with a white background—someone saved a PNG as JPEG.'},
          {title:'PNG: The Right Choice for Cutouts',body:'PNG (Portable Network Graphics) was designed specifically to support transparency via an alpha channel—an additional layer alongside Red, Green, and Blue that stores 0–255 opacity for each pixel. ClearCut automatically exports PNG format when you choose to keep the background transparent.'},
          {title:'When to Use JPEG Instead',body:'If you\'ve applied a solid color or photo background to your ClearCut result, there\'s no transparency to preserve—so JPEG is perfectly fine and produces a smaller, faster file. ClearCut exports JPEG when a background is applied. For social media posts or email attachments with solid backgrounds, JPEG is the practical choice.'},
          {title:'File Size Comparison',body:'A 12MP cutout with transparency as PNG: ~4–8MB. The same image as JPEG (solid white background, 85% quality): ~2–3MB. WebP (a newer format supported in Android): ~1.5–2MB with alpha support. ClearCut currently exports PNG and JPEG. WebP export is planned for a future update.'},
          {title:'Which Format Does ClearCut Export?',body:'ClearCut intelligently selects the format based on your background choice. Transparent background → PNG (alpha preserved). Solid color or photo background → JPEG (smaller file, no transparency needed). You can also manually select the export format in Settings → Output Format.'},
        ].map(s=>`
        <div class="animate-in" style="margin-bottom:36px;">
          <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:12px;">${s.title}</h2>
          <p style="font-size:1rem;color:var(--text-secondary);line-height:1.8;">${s.body}</p>
        </div>`).join('')}
      </div>
    </article>
    ${ctaBanner('Export Clean PNGs and JPEGs with ClearCut')}`
  })
});

/* ──────────────────────────────────────────────────────────────────
   FREE WEB TOOL PAGE
   ────────────────────────────────────────────────────────────────── */
PAGES.push({
  path:'pages/free-online-background-remover.html',
  data: page({
    title:'Free Online Background Remover – Try in Browser | ClearCut',
    metaDesc:'Try ClearCut\'s browser-based background removal tool. Upload a photo, select a new background, and export. 100% free, no account needed.',
    keywords:'free online background remover, background remover online free no sign up, remove background from photo browser',
    canonical:'/pages/free-online-background-remover',
    activeNav:'🔥 Free Tool',
    body:`
    <section class="section" style="padding-top:48px;">
      <div class="container">
        ${breadcrumb([{href:'/',label:'Home'},{href:'#',label:'Free Online Tool'}])}
        <div class="section-header">
          <span class="section-tag">🔥 Browser-Based Tool</span>
          <h1 class="section-title">Free Online Background Remover – <span class="gradient-text">Try in Your Browser</span></h1>
          <p class="section-desc">Upload any photo and see a simulated background removal preview right in your browser. For the full AI-powered experience with 4K export, download the free ClearCut Android app.</p>
        </div>

        <!-- Embedded Playground (same as homepage playground) -->
        <div class="playground-wrapper" id="webToolWrapper">
          <div class="playground-grid">
            <div class="playground-stage-container">
              <div class="playground-stage checkerboard-pattern" id="webStage">
                <div class="scanning-bar" id="webScanBar"></div>
                <div class="playground-subject-wrap" id="webSubjectWrap">
                  <img src="/assets/portrait.jpg" alt="Subject" id="webImg" style="clip-path:url(#portrait-mask);width:100%;height:100%;object-fit:cover;">
                  <canvas id="webCanvas" style="display:none;"></canvas>
                </div>
              </div>
              <div class="sample-selector-row">
                <span class="sample-selector-label">Choose Sample:</span>
                <div class="sample-buttons" id="webSamples">
                  <button class="sample-btn active" data-img="/assets/portrait.jpg" data-mask="url(#portrait-mask)">Portrait</button>
                  <button class="sample-btn" data-img="/assets/sneaker.jpg" data-mask="url(#sneaker-mask)">Sneaker</button>
                  <button class="sample-btn" data-img="/assets/dog.jpg" data-mask="url(#dog-mask)">Pet</button>
                  <label class="sample-btn upload-custom-btn" for="webUpload">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Your Photo
                  </label>
                  <input type="file" id="webUpload" accept="image/*" style="display:none;">
                </div>
              </div>
            </div>

            <div class="playground-controls">
              <div>
                <div class="control-group-title">Background Style <span id="webBgLabel" style="color:#60A5FA;font-size:.82rem;">Transparent</span></div>
                <div class="bg-mode-tabs" id="webModeTabs">
                  <button class="bg-mode-tab active" data-mode="transparent">None</button>
                  <button class="bg-mode-tab" data-mode="solid">Color</button>
                  <button class="bg-mode-tab" data-mode="gradient">Gradient</button>
                  <button class="bg-mode-tab" data-mode="image">Photo</button>
                </div>
                <div id="webSwatchBox">
                  <div class="swatches-grid" id="webSolidSwatches" style="display:none;">
                    <button class="swatch-btn" data-color="#FFFFFF" style="background:#FFFFFF"></button>
                    <button class="swatch-btn" data-color="#000000" style="background:#000000"></button>
                    <button class="swatch-btn" data-color="#64748B" style="background:#64748B"></button>
                    <button class="swatch-btn" data-color="#EF4444" style="background:#EF4444"></button>
                    <button class="swatch-btn" data-color="#2F6BFF" style="background:#2F6BFF"></button>
                    <button class="swatch-btn" data-color="#7B3FF2" style="background:#7B3FF2"></button>
                    <button class="swatch-btn" data-color="#10B981" style="background:#10B981"></button>
                    <button class="swatch-btn" data-color="#FF4D8D" style="background:#FF4D8D"></button>
                    <div class="color-picker-wrap">
                      <input type="color" id="webColorPicker" value="#2F6BFF">
                      <span class="color-picker-label">Custom</span>
                    </div>
                  </div>
                  <div class="swatches-grid" id="webGradSwatches" style="display:none;">
                    <button class="swatch-btn" data-grad="linear-gradient(135deg,#FF6B6B,#FFE66D)" style="background:linear-gradient(135deg,#FF6B6B,#FFE66D)"></button>
                    <button class="swatch-btn" data-grad="linear-gradient(135deg,#2F6BFF,#FF4D8D)" style="background:linear-gradient(135deg,#2F6BFF,#FF4D8D)"></button>
                    <button class="swatch-btn" data-grad="linear-gradient(135deg,#10B981,#00F0FF)" style="background:linear-gradient(135deg,#10B981,#00F0FF)"></button>
                    <button class="swatch-btn" data-grad="linear-gradient(135deg,#7B3FF2,#2F6BFF)" style="background:linear-gradient(135deg,#7B3FF2,#2F6BFF)"></button>
                  </div>
                  <div class="scenic-grid" id="webScenic" style="display:none;">
                    <div class="scenic-thumb-btn" data-bgimg="/assets/bg_studio.jpg"><img src="/assets/bg_studio.jpg" alt="Studio"></div>
                    <div class="scenic-thumb-btn" data-bgimg="/assets/bg_sunset.jpg"><img src="/assets/bg_sunset.jpg" alt="Sunset"></div>
                    <div class="scenic-thumb-btn" data-bgimg="/assets/bg_city.jpg"><img src="/assets/bg_city.jpg" alt="City"></div>
                    <div class="scenic-thumb-btn" data-bgimg="/assets/bg_office.jpg"><img src="/assets/bg_office.jpg" alt="Office"></div>
                  </div>
                </div>
              </div>

              <div style="margin-top:20px;padding:20px;background:rgba(47,107,255,.1);border:1px solid rgba(47,107,255,.3);border-radius:16px;text-align:center;">
                <p style="font-size:.88rem;color:var(--text-secondary);margin-bottom:14px;">Want full 4K resolution, offline processing, and all editing tools?</p>
                ${playBtn()}
                <p style="font-size:.76rem;color:var(--text-muted);margin-top:10px;">Android only · Free forever · ~25MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding:60px 0;">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Web Tool vs Android App – <span class="gradient-text">What's the Difference?</span></h2>
        </div>
        ${comparisonTable([
          {feature:'AI Segmentation Quality',clearcut:'⭐⭐⭐⭐⭐ Full on-device neural network',others:[{name:'This Web Preview',val:'⭐⭐⭐ CSS clip-path simulation',good:false}]},
          {feature:'Export Resolution',clearcut:'Full camera resolution (up to 4K+)',others:[{name:'This Web Preview',val:'Browser-limited preview',good:false}]},
          {feature:'Works Offline',clearcut:'✔ Yes, fully offline',others:[{name:'This Web Preview',val:'✖ Requires browser/internet',good:false}]},
          {feature:'Price',clearcut:'✔ 100% Free',others:[{name:'This Web Preview',val:'✔ Free',good:true}]},
          {feature:'Adjust & Crop Tools',clearcut:'✔ Full editor built in',others:[{name:'This Web Preview',val:'✖ Not available',good:false}]},
        ])}
      </div>
    </section>

    <script>
    (function(){
      const stage=document.getElementById('webStage');
      const img=document.getElementById('webImg');
      const canvas=document.getElementById('webCanvas');
      const scanBar=document.getElementById('webScanBar');
      const bgLabel=document.getElementById('webBgLabel');

      function scan(){if(scanBar){scanBar.classList.add('active');setTimeout(()=>scanBar.classList.remove('active'),1800);}}

      // Sample switcher
      document.getElementById('webSamples')?.querySelectorAll('[data-img]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          document.querySelectorAll('#webSamples .sample-btn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          canvas.style.display='none';img.style.display='block';
          img.src=btn.dataset.img;img.style.clipPath=btn.dataset.mask;scan();
        });
      });

      // Upload
      document.getElementById('webUpload')?.addEventListener('change',e=>{
        const f=e.target.files[0];if(!f)return;
        const r=new FileReader();r.onload=ev=>{
          const tmp=new Image();tmp.onload=()=>{
            const c=canvas;const ctx=c.getContext('2d');
            const m=800;let w=tmp.width,h=tmp.height;
            if(w>m||h>m){if(w>h){h=Math.round(h*m/w);w=m;}else{w=Math.round(w*m/h);h=m;}}
            c.width=w;c.height=h;ctx.drawImage(tmp,0,0,w,h);
            const d=ctx.getImageData(0,0,w,h);const px=d.data;
            const corners=[0,(w-1)*4,((h-1)*w)*4,((h-1)*w+w-1)*4];
            let br=0,bg=0,bb=0;corners.forEach(i=>{br+=px[i];bg+=px[i+1];bb+=px[i+2];});br/=4;bg/=4;bb/=4;
            for(let i=0;i<px.length;i+=4){const dist=Math.sqrt((px[i]-br)**2+(px[i+1]-bg)**2+(px[i+2]-bb)**2);if(dist<48)px[i+3]=0;else if(dist<72)px[i+3]=Math.round((dist-48)/24*255);}
            ctx.putImageData(d,0,0);img.style.display='none';canvas.style.display='block';scan();
          };tmp.src=ev.target.result;
        };r.readAsDataURL(f);
      });

      // Mode tabs
      const solid=document.getElementById('webSolidSwatches');
      const grad=document.getElementById('webGradSwatches');
      const scenic=document.getElementById('webScenic');
      document.getElementById('webModeTabs')?.querySelectorAll('.bg-mode-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
          document.querySelectorAll('#webModeTabs .bg-mode-tab').forEach(t=>t.classList.remove('active'));
          tab.classList.add('active');
          solid.style.display='none';grad.style.display='none';scenic.style.display='none';
          stage.style.backgroundColor='';stage.style.backgroundImage='';stage.style.backgroundSize='';
          stage.classList.remove('checkerboard-pattern');
          const m=tab.dataset.mode;
          if(m==='transparent'){stage.classList.add('checkerboard-pattern');bgLabel.textContent='Transparent';}
          else if(m==='solid'){solid.style.display='flex';setBg('#2F6BFF','Electric Blue');}
          else if(m==='gradient'){grad.style.display='flex';setBg('linear-gradient(135deg,#2F6BFF,#FF4D8D)','Cyberpunk','grad');}
          else if(m==='image'){scenic.style.display='grid';setBg('/assets/bg_studio.jpg','Studio Loft','img');}
        });
      });

      function setBg(val,label,type='color'){
        if(type==='color'){stage.style.backgroundColor=val;stage.style.backgroundImage='';}
        else if(type==='grad'){stage.style.backgroundImage=val;stage.style.backgroundColor='';}
        else if(type==='img'){stage.style.backgroundImage='url("'+val+'")';stage.style.backgroundSize='cover';stage.style.backgroundPosition='center';}
        bgLabel.textContent=label;
      }

      solid?.querySelectorAll('.swatch-btn').forEach(b=>b.addEventListener('click',()=>setBg(b.dataset.color,b.title||b.dataset.color)));
      document.getElementById('webColorPicker')?.addEventListener('input',e=>setBg(e.target.value,'Custom'));
      grad?.querySelectorAll('.swatch-btn').forEach(b=>b.addEventListener('click',()=>setBg(b.dataset.grad,b.title||'Gradient','grad')));
      scenic?.querySelectorAll('.scenic-thumb-btn').forEach(b=>b.addEventListener('click',()=>setBg(b.dataset.bgimg,b.title||'Photo','img')));
    })();
    </script>`
  })
});

/* ──────────────────────────────────────────────────────────────────
   WRITE ALL FILES
   ────────────────────────────────────────────────────────────────── */

let written = 0;
let errors = 0;

PAGES.forEach(p => {
  const fullPath = resolve(ROOT, p.path);
  const dir = dirname(fullPath);

  // Ensure directory exists
  try {
    mkdirSync(dir, { recursive: true });
  } catch {}

  try {
    writeFileSync(fullPath, p.data, 'utf8');
    console.log(`✓ ${p.path}`);
    written++;
  } catch (err) {
    console.error(`✗ ${p.path}: ${err.message}`);
    errors++;
  }
});

console.log(`\n📦 Generated ${written} pages. ${errors} errors.`);
