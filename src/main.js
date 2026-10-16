/* ===================================================================
   ClearCut – Background Remover | Official Web App Script
   Features:
   - Sticky Glass Navbar & Mobile Drawer
   - Interactive Before/After Comparison Slider (Touch + Drag + Presets)
   - Real-Time Web Playground (Transparent, Solid Colors, Gradients, Scenic Photos, Custom Upload)
   - 5-Step Interactive Timeline with Realistic Phone Screen Sync
   - 9-Screen Screenshot Gallery with Lightbox Viewer
   - Accordion FAQ
   - Full Modals (Privacy, Terms, Contact Form, Download QR)
   - Confetti Bursts & Toast Notifications
   =================================================================== */

import './style.css';
import confetti from 'canvas-confetti';

// Asset Mappings
const PRESETS = {
  portrait: {
    name: 'Woman Portrait',
    src: '/assets/portrait.jpg',
    mask: 'url(#portrait-mask)'
  },
  sneaker: {
    name: 'Athletic Sneaker',
    src: '/assets/sneaker.jpg',
    mask: 'url(#sneaker-mask)'
  },
  dog: {
    name: 'Golden Retriever Puppy',
    src: '/assets/dog.jpg',
    mask: 'url(#dog-mask)'
  },
  man: {
    name: 'Business Headshot',
    src: '/assets/man_portrait.jpg',
    mask: 'url(#man-mask)'
  }
};

// 9 Screenshot Definitions for Gallery
const GALLERY_SCREENS = {
  splash: {
    title: 'Splash Screen',
    desc: 'Instant initialization of the on-device AI segmentation neural network with zero cloud connection.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: radial-gradient(circle at center, #11183C 0%, #060B1E 100%);">
        <div style="width: 80px; height: 80px; border-radius: 22px; box-shadow: 0 10px 30px rgba(47, 107, 255, 0.5); margin-bottom: 20px;">
          <img src="/assets/logo.svg" alt="ClearCut Logo" style="width: 100%; height: 100%;">
        </div>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px;">ClearCut</h3>
        <p style="font-size: 0.78rem; color: #94A3B8; margin-bottom: 30px;">Background Removal. Made Simple.</p>
        <div style="width: 120px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
          <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #2F6BFF, #7B3FF2); animation: progressLoop 1.5s infinite linear;"></div>
        </div>
        <span style="font-size: 0.7rem; color: #64748B; margin-top: 10px;">Initializing on-device AI...</span>
      </div>
      <style>@keyframes progressLoop { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }</style>
    `
  },
  home: {
    title: 'Home Screen',
    desc: 'Clean dashboard with one-tap image selection, instant camera capture, sample photos, and recent history.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span class="app-topbar-brand">
            <img src="/assets/logo.svg" width="22" height="22" alt="App Icon">
            <span>ClearCut</span>
          </span>
          <span style="font-size: 0.72rem; padding: 4px 8px; background: rgba(47, 107, 255, 0.2); border-radius: 12px; color: #60A5FA;">Free Edition</span>
        </div>

        <div style="margin: 20px 0; text-align: center;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(47, 107, 255, 0.15); border: 1px solid rgba(47, 107, 255, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 4px;">Remove Background</h4>
          <p style="font-size: 0.76rem; color: #94A3B8;">Select any photo to cut out in seconds</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          <button style="background: linear-gradient(135deg, #2F6BFF, #7B3FF2); color: #fff; padding: 12px; border-radius: 14px; font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 15px rgba(47,107,255,0.4);">+ Choose from Gallery</button>
          <button style="background: rgba(255,255,255,0.06); color: #fff; padding: 10px; border-radius: 14px; font-size: 0.82rem;">📷 Open Camera</button>
        </div>

        <span style="font-size: 0.75rem; color: #94A3B8; font-weight: 700; margin-bottom: 8px;">Recent Edits</span>
        <div style="display: flex; gap: 8px; overflow-x: auto;">
          <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; background: #1a2242; flex-shrink: 0;" class="checkerboard-pattern">
            <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#portrait-mask);">
          </div>
          <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; background: #1a2242; flex-shrink: 0;" class="checkerboard-pattern">
            <img src="/assets/sneaker.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#sneaker-mask);">
          </div>
          <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; background: #1a2242; flex-shrink: 0;" class="checkerboard-pattern">
            <img src="/assets/dog.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#dog-mask);">
          </div>
        </div>

        <div style="margin-top: auto; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; text-align: center; font-size: 0.7rem; color: #34D399;">
          🛡️ 100% On-Device AI • No Photos Uploaded
        </div>
      </div>
    `
  },
  picker: {
    title: 'Image Picker',
    desc: 'Browse device albums, snap a live camera capture, or test built-in sample photos with instant tap.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Select Image</span>
          <span style="font-size: 0.75rem; color: #60A5FA;">Albums</span>
        </div>

        <div style="display: flex; gap: 6px; margin-bottom: 12px; font-size: 0.72rem;">
          <span style="padding: 4px 10px; background: #2F6BFF; border-radius: 12px; color: #fff;">All Photos</span>
          <span style="padding: 4px 10px; background: rgba(255,255,255,0.06); border-radius: 12px; color: #94A3B8;">Camera</span>
          <span style="padding: 4px 10px; background: rgba(255,255,255,0.06); border-radius: 12px; color: #94A3B8;">Samples</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; flex: 1;">
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1; border: 2px solid #2F6BFF;"><img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1;"><img src="/assets/sneaker.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1;"><img src="/assets/dog.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1;"><img src="/assets/man_portrait.jpg" style="width: 100%; height: 100%; object-fit: cover;"></div>
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1; background: #1E2640;"></div>
          <div style="border-radius: 8px; overflow: hidden; aspect-ratio: 1; background: #1E2640;"></div>
        </div>

        <div class="app-btn-select" style="margin-top: 10px; margin-bottom: 0;">Select Photo</div>
      </div>
    `
  },
  processing: {
    title: 'Processing Screen',
    desc: 'Local neural network inference with progress indicator ("Removing background... This may take a few seconds").',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center;">
        <div style="position: relative; width: 150px; height: 150px; border-radius: 18px; overflow: hidden; border: 2px solid #2F6BFF; margin-bottom: 24px; box-shadow: 0 0 30px rgba(47,107,255,0.4);">
          <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #00F0FF; box-shadow: 0 0 15px #00F0FF; animation: scanSweep 1.5s infinite alternate;"></div>
        </div>

        <div style="width: 48px; height: 48px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #2F6BFF; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>

        <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">Removing background...</h4>
        <p style="font-size: 0.78rem; color: #94A3B8; max-width: 220px;">This may take a few seconds. Powered by on-device AI.</p>
        <span style="font-size: 0.7rem; color: #10B981; margin-top: 16px;">⚡ Offline • Zero network requests</span>
      </div>
    `
  },
  editor: {
    title: 'Editor Screen',
    desc: 'Transparent cutout displayed on a checkerboard pattern with Adjust, Crop, and Background replacement tools.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Editor</span>
          <span style="font-size: 0.75rem; color: #60A5FA;">Undo ↶</span>
        </div>

        <div style="flex: 1; border-radius: 16px; overflow: hidden; position: relative;" class="checkerboard-pattern">
          <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#portrait-mask);">
        </div>

        <div style="display: flex; justify-content: space-around; margin-top: 14px; padding: 10px 0; background: rgba(0,0,0,0.4); border-radius: 12px; font-size: 0.72rem; color: #94A3B8;">
          <span style="color: #60A5FA; font-weight: 700;">🎨 Background</span>
          <span>⚡ Adjust</span>
          <span>✂️ Crop</span>
          <span>✨ More</span>
        </div>
      </div>
    `
  },
  backgrounds: {
    title: 'Background Options',
    desc: 'Solid Color (white, black, grey, red, orange, yellow, green, blue, purple, pink), Gradient, or custom gallery photo.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Choose Background</span>
          <span style="font-size: 0.75rem; color: #10B981;">Done</span>
        </div>

        <div style="height: 180px; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, #2F6BFF, #FF4D8D); margin-bottom: 14px;">
          <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#portrait-mask);">
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 0.75rem;">
          <span style="color: #60A5FA; font-weight: 700;">Solid Colors</span>
          <span>Gradients</span>
          <span>Image</span>
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #FFFFFF;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #000000;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #64748B;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #EF4444;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #F97316;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #EAB308;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #10B981;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #2F6BFF; border: 2px solid #fff;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #7B3FF2;"></div>
          <div style="width: 26px; height: 26px; border-radius: 50%; background: #FF4D8D;"></div>
        </div>
      </div>
    `
  },
  result: {
    title: 'Result & Share Screen',
    desc: 'Export high-quality image without compression loss or share directly to Instagram, WhatsApp, and other apps.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Final Cutout</span>
          <span style="font-size: 0.72rem; color: #10B981;">Export Ready</span>
        </div>

        <div style="flex: 1; border-radius: 16px; overflow: hidden; margin-bottom: 14px;" class="checkerboard-pattern">
          <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#portrait-mask);">
        </div>

        <div style="background: rgba(16, 185, 129, 0.12); padding: 8px 12px; border-radius: 8px; font-size: 0.74rem; color: #34D399; margin-bottom: 12px; text-align: center;">
          ✓ Best Quality Setting (Full 4K Resolution)
        </div>

        <div style="display: flex; gap: 8px;">
          <button style="flex: 1; background: linear-gradient(135deg, #2F6BFF, #7B3FF2); color: #fff; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 0.82rem; border: none;">Save to Photos</button>
          <button style="background: rgba(255,255,255,0.08); color: #fff; padding: 12px 18px; border-radius: 12px; font-size: 0.82rem; border: none;">Share</button>
        </div>
      </div>
    `
  },
  history: {
    title: 'History Screen',
    desc: 'Browse previously edited images, re-export in high-res, or delete past items with clear history controls.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Edit History</span>
          <span style="font-size: 0.72rem; color: #EF4444;">Clear All</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; overflow-y: auto;">
          <div style="border-radius: 12px; overflow: hidden; background: #161D36; padding: 6px;">
            <div style="aspect-ratio: 1; border-radius: 8px; overflow: hidden;" class="checkerboard-pattern">
              <img src="/assets/portrait.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#portrait-mask);">
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.68rem; color: #94A3B8;">
              <span>Today</span>
              <span>PNG</span>
            </div>
          </div>

          <div style="border-radius: 12px; overflow: hidden; background: #161D36; padding: 6px;">
            <div style="aspect-ratio: 1; border-radius: 8px; overflow: hidden;" class="checkerboard-pattern">
              <img src="/assets/sneaker.jpg" style="width: 100%; height: 100%; object-fit: cover; clip-path: url(#sneaker-mask);">
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 0.68rem; color: #94A3B8;">
              <span>Yesterday</span>
              <span>PNG</span>
            </div>
          </div>
        </div>
      </div>
    `
  },
  settings: {
    title: 'Settings Screen',
    desc: 'AMOLED dark theme toggle, export image quality controls, privacy details, and version information.',
    render: () => `
      <div style="flex: 1; display: flex; flex-direction: column; padding: 14px;">
        <div class="app-topbar">
          <span style="font-size: 0.85rem; font-weight: 700;">Settings</span>
          <span></span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
            <span>Dark Theme</span>
            <span style="color: #60A5FA; font-weight: 700;">AMOLED On</span>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
            <span>Image Quality</span>
            <span style="color: #10B981; font-weight: 700;">Best Quality</span>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
            <span>Output Format</span>
            <span style="color: #94A3B8;">PNG / JPEG</span>
          </div>

          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
            <span>Privacy Information</span>
            <span style="color: #60A5FA;">100% On-Device</span>
          </div>

          <div style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 12px; text-align: center; font-size: 0.82rem; color: #F87171;">
            Clear Edit History
          </div>
        </div>

        <div style="margin-top: auto; text-align: center; font-size: 0.7rem; color: #64748B;">
          ClearCut v1.2.0 (Build 42)<br>
          "Free • Offline • On Your Device"
        </div>
      </div>
    `
  }
};

// ===================================================================
// Initialization on DOM Load
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initPlayground();
  initTimeline();
  initScreenshotsGallery();
  initFAQ();
  initModals();
  initSkiperGallery();
});

// ===================================================================
// 1. Sticky Glass Navbar & Mobile Drawer
// ===================================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ===================================================================
// 2. Hero Interactive Before/After Comparison Slider
// ===================================================================
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const handle = document.getElementById('heroSliderHandle');
  const layerBefore = document.getElementById('heroLayerBefore');
  const presetTabs = document.getElementById('heroPresetTabs');
  const heroCutoutImg = document.getElementById('heroCutoutImg');
  const heroOriginalImg = document.getElementById('heroOriginalImg');

  if (!slider || !handle || !layerBefore) return;

  let isDragging = false;
  let sliderPos = 50; // percentage

  function updateSlider(percent) {
    sliderPos = Math.max(0, Math.min(100, percent));
    handle.style.left = `${sliderPos}%`;
    layerBefore.style.clipPath = `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`;
    slider.setAttribute('aria-valuenow', Math.round(sliderPos));
  }

  function handleMove(clientX) {
    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percent = (offsetX / rect.width) * 100;
    updateSlider(percent);
  }

  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for mobile
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Keyboard accessibility
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      updateSlider(sliderPos - 5);
    } else if (e.key === 'ArrowRight') {
      updateSlider(sliderPos + 5);
    }
  });

  // Preset Switcher Tabs in Hero
  if (presetTabs) {
    presetTabs.querySelectorAll('.preset-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        presetTabs.querySelectorAll('.preset-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const presetKey = btn.dataset.preset;
        const preset = PRESETS[presetKey];
        if (preset) {
          heroOriginalImg.src = preset.src;
          heroCutoutImg.src = preset.src;
          heroCutoutImg.style.clipPath = preset.mask;
        }
      });
    });
  }
}

// ===================================================================
// 3. Real-Time Interactive Playground (Browser Cutout Sandbox)
// ===================================================================
function initPlayground() {
  const stage = document.getElementById('playgroundStage');
  const img = document.getElementById('playgroundImg');
  const canvas = document.getElementById('customUploadCanvas');
  const scanningBar = document.getElementById('scanningBar');
  const sampleButtons = document.getElementById('sampleButtons');
  const userImageUpload = document.getElementById('userImageUpload');
  const bgModeTabs = document.getElementById('bgModeTabs');
  const activeBgName = document.getElementById('activeBgName');
  const solidSwatches = document.getElementById('solidSwatches');
  const gradientSwatches = document.getElementById('gradientSwatches');
  const scenicSwatches = document.getElementById('scenicSwatches');
  const customColorPicker = document.getElementById('customColorPicker');
  const rangeBrightness = document.getElementById('rangeBrightness');
  const valBrightness = document.getElementById('valBrightness');
  const rangeBgBlur = document.getElementById('rangeBgBlur');
  const valBgBlur = document.getElementById('valBgBlur');
  const downloadCutoutBtn = document.getElementById('downloadCutoutBtn');

  if (!stage || !img) return;

  let currentMode = 'transparent';
  let isCustomUploaded = false;

  // Trigger Scanning Laser effect
  function triggerScan() {
    if (scanningBar) {
      scanningBar.classList.add('active');
      setTimeout(() => scanningBar.classList.remove('active'), 1800);
    }
  }

  // Set Background Style
  function setBackground(styleObj, labelText) {
    // Reset background styles on stage
    stage.style.backgroundColor = '';
    stage.style.backgroundImage = '';
    stage.style.backgroundSize = '';
    stage.classList.remove('checkerboard-pattern');

    if (styleObj.type === 'transparent') {
      stage.classList.add('checkerboard-pattern');
    } else if (styleObj.type === 'color') {
      stage.style.backgroundColor = styleObj.value;
    } else if (styleObj.type === 'gradient') {
      stage.style.backgroundImage = styleObj.value;
    } else if (styleObj.type === 'image') {
      stage.style.backgroundImage = `url("${styleObj.value}")`;
      stage.style.backgroundSize = 'cover';
      stage.style.backgroundPosition = 'center';
    }

    if (activeBgName && labelText) {
      activeBgName.textContent = labelText;
    }
  }

  // Switch Sample Preset
  if (sampleButtons) {
    sampleButtons.querySelectorAll('.sample-btn').forEach(btn => {
      if (btn.classList.contains('upload-custom-btn')) return;

      btn.addEventListener('click', () => {
        sampleButtons.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.dataset.sample;
        const preset = PRESETS[key];
        if (preset) {
          isCustomUploaded = false;
          canvas.style.display = 'none';
          img.style.display = 'block';
          img.src = preset.src;
          img.style.clipPath = preset.mask;
          triggerScan();
        }
      });
    });
  }

  // Custom User Image Upload with On-Device Canvas Segmentation
  if (userImageUpload) {
    userImageUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const tempImg = new Image();
        tempImg.onload = () => {
          // Process image on HTML5 canvas
          processCustomCutout(tempImg);
          triggerScan();
          showToast('Uploaded photo processed with on-device segmentation!');
        };
        tempImg.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function processCustomCutout(imageObj) {
    isCustomUploaded = true;
    img.style.display = 'none';
    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const maxDim = 800;
    let w = imageObj.width;
    let h = imageObj.height;

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(imageObj, 0, 0, w, h);

    // Smart background segmentation
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Sample average background color from the four corners
    const corners = [
      0, // top-left
      (w - 1) * 4, // top-right
      ((h - 1) * w) * 4, // bottom-left
      ((h - 1) * w + (w - 1)) * 4 // bottom-right
    ];

    let bgR = 0, bgG = 0, bgB = 0;
    corners.forEach(idx => {
      bgR += data[idx];
      bgG += data[idx + 1];
      bgB += data[idx + 2];
    });
    bgR = bgR / 4;
    bgG = bgG / 4;
    bgB = bgB / 4;

    const threshold = 48;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dist = Math.sqrt(
        (r - bgR) ** 2 +
        (g - bgG) ** 2 +
        (b - bgB) ** 2
      );

      if (dist < threshold) {
        data[i + 3] = 0; // Transparent
      } else if (dist < threshold + 24) {
        // Soft edge feathering
        data[i + 3] = Math.round(((dist - threshold) / 24) * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  // Mode Tabs Switching
  if (bgModeTabs) {
    bgModeTabs.querySelectorAll('.bg-mode-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        bgModeTabs.querySelectorAll('.bg-mode-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        currentMode = tab.dataset.mode;
        solidSwatches.style.display = currentMode === 'solid' ? 'flex' : 'none';
        gradientSwatches.style.display = currentMode === 'gradient' ? 'flex' : 'none';
        scenicSwatches.style.display = currentMode === 'image' ? 'grid' : 'none';

        if (currentMode === 'transparent') {
          setBackground({ type: 'transparent' }, 'Transparent PNG');
        } else if (currentMode === 'solid') {
          setBackground({ type: 'color', value: '#2F6BFF' }, 'Electric Blue');
        } else if (currentMode === 'gradient') {
          setBackground({ type: 'gradient', value: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)' }, 'Sunset Glow');
        } else if (currentMode === 'image') {
          setBackground({ type: 'image', value: '/assets/bg_studio.jpg' }, 'Studio Loft');
        }
      });
    });
  }

  // Solid Color Swatches
  if (solidSwatches) {
    solidSwatches.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        solidSwatches.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const color = btn.dataset.color;
        setBackground({ type: 'color', value: color }, btn.title || color);
      });
    });
  }

  // Custom Color Picker
  if (customColorPicker) {
    customColorPicker.addEventListener('input', (e) => {
      setBackground({ type: 'color', value: e.target.value }, `Hex ${e.target.value.toUpperCase()}`);
    });
  }

  // Gradient Swatches
  if (gradientSwatches) {
    gradientSwatches.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        gradientSwatches.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const grad = btn.dataset.grad;
        setBackground({ type: 'gradient', value: grad }, btn.title || 'Gradient');
      });
    });
  }

  // Scenic Backdrops
  if (scenicSwatches) {
    scenicSwatches.querySelectorAll('.scenic-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        scenicSwatches.querySelectorAll('.scenic-thumb-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const bgImg = btn.dataset.bgimg;
        setBackground({ type: 'image', value: bgImg }, btn.title || 'Scenic Photo');
      });
    });
  }

  // Sliders: Brightness & Background Blur
  if (rangeBrightness) {
    rangeBrightness.addEventListener('input', (e) => {
      const val = e.target.value;
      if (valBrightness) valBrightness.textContent = `${val}%`;
      img.style.filter = `brightness(${val}%)`;
      canvas.style.filter = `brightness(${val}%)`;
    });
  }

  if (rangeBgBlur) {
    rangeBgBlur.addEventListener('input', (e) => {
      const val = e.target.value;
      if (valBgBlur) valBgBlur.textContent = `${val}px`;
      stage.style.filter = val > 0 ? `blur(${val}px)` : 'none';
      // keep subject sharp by neutralizing blur
      img.style.filter = `brightness(${rangeBrightness ? rangeBrightness.value : 100}%)`;
    });
  }

  // Export Cutout Button with Confetti
  if (downloadCutoutBtn) {
    downloadCutoutBtn.addEventListener('click', () => {
      // Fire confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Exporting high-quality cutout image...');

      // Render offscreen canvas and trigger download
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'clearcut-export.png';
        if (isCustomUploaded && canvas) {
          link.href = canvas.toDataURL('image/png');
        } else {
          link.href = img.src;
        }
        link.click();
        showToast('✓ Cutout exported successfully! Full HD quality.');
      }, 500);
    });
  }
}

// ===================================================================
// 4. Interactive 5-Step Timeline (How It Works)
// ===================================================================
function initTimeline() {
  const stepItems = document.querySelectorAll('.step-item');
  if (!stepItems.length) return;

  stepItems.forEach(item => {
    item.addEventListener('click', () => {
      const stepNum = item.dataset.step;
      setActiveStep(stepNum);
    });
  });

  function setActiveStep(num) {
    stepItems.forEach(el => {
      el.classList.toggle('active', el.dataset.step === num);
    });

    for (let i = 1; i <= 5; i++) {
      const screen = document.getElementById(`phoneScreen${i}`);
      if (screen) {
        screen.classList.toggle('active', i.toString() === num.toString());
      }
    }
  }
}

// ===================================================================
// 5. Screenshots Gallery (9 Screens + Lightbox)
// ===================================================================
function initScreenshotsGallery() {
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  const container = document.getElementById('galleryScreenContainer');
  const title = document.getElementById('galleryTitle');
  const desc = document.getElementById('galleryDesc');
  const phoneBox = document.getElementById('galleryPhoneBox');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxContent = document.getElementById('lightboxContent');

  if (!container) return;

  let currentKey = 'splash';

  function renderScreen(key) {
    const screenData = GALLERY_SCREENS[key] || GALLERY_SCREENS.splash;
    currentKey = key;

    container.innerHTML = screenData.render();
    if (title) title.textContent = screenData.title;
    if (desc) desc.textContent = screenData.desc;

    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.screen === key);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.screen;
      renderScreen(key);
    });
  });

  // Initial render
  renderScreen('splash');

  // Open Lightbox on Phone click
  if (phoneBox && lightboxModal && lightboxContent) {
    phoneBox.addEventListener('click', () => {
      const screenData = GALLERY_SCREENS[currentKey];
      lightboxContent.innerHTML = `
        <div class="phone-mockup-frame" style="max-width: 360px; margin: 0 auto; box-shadow: 0 0 60px rgba(47, 107, 255, 0.6);">
          <div class="phone-punchhole"></div>
          <div class="phone-statusbar">
            <span>9:41</span>
            <div class="statusbar-icons">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/></svg>
            </div>
          </div>
          <div class="phone-screen-content" style="min-height: 520px;">
            ${screenData.render()}
          </div>
        </div>
      `;
      lightboxModal.classList.add('open');
    });
  }
}

// ===================================================================
// 6. FAQ Accordion
// ===================================================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other items
      faqItems.forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ===================================================================
// 7. Modals & Toast Handlers
// ===================================================================
function initModals() {
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  const contactModal = document.getElementById('contactModal');
  const downloadModal = document.getElementById('downloadModal');
  const lightboxModal = document.getElementById('lightboxModal');
  const contactForm = document.getElementById('contactForm');
  const confirmPlayStoreBtn = document.getElementById('confirmPlayStoreBtn');
  const confirmApkDownloadBtn = document.getElementById('confirmApkDownloadBtn');

  // Trigger buttons
  document.querySelectorAll('.open-privacy-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  });

  document.querySelectorAll('.open-terms-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(termsModal);
    });
  });

  document.querySelectorAll('.open-contact-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(contactModal);
    });
  });

  document.querySelectorAll('.open-download-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(downloadModal);
    });
  });

  // Close buttons
  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // Close when clicking modal backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // ESC key listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  function openModal(modal) {
    if (!modal) return;
    closeAllModals();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }

  // Contact Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeAllModals();
      confetti({ particleCount: 50, spread: 60 });
      showToast('Thank you! Your message has been sent to support@clearcut.app.');
      contactForm.reset();
    });
  }

  // Download Action Handlers
  if (confirmPlayStoreBtn) {
    confirmPlayStoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confetti({ particleCount: 70, spread: 80 });
      showToast('Opening ClearCut on Google Play Store...');
      closeAllModals();
    });
  }

  if (confirmApkDownloadBtn) {
    confirmApkDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      confetti({ particleCount: 70, spread: 80 });
      showToast('Downloading ClearCut v1.2.0 APK (24.8MB)...');
      closeAllModals();
    });
  }
}

// Global Toast Notification Helper
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ===================================================================
// Skiper UI (@skiper-ui) Interactions
// ===================================================================
function initSkiperGallery() {
  const cards = document.querySelectorAll('.skiper-expand-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const activate = () => {
      cards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    };
    card.addEventListener('mouseenter', activate);
    card.addEventListener('focus', activate);
    card.addEventListener('click', activate);
  });
}
