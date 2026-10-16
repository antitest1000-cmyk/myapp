import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Root
        main: resolve(__dirname, 'index.html'),

        // Trust & Legal
        privacy: resolve(__dirname, 'pages/privacy-policy.html'),
        terms: resolve(__dirname, 'pages/terms-of-service.html'),
        about: resolve(__dirname, 'pages/about.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
        changelog: resolve(__dirname, 'pages/changelog.html'),

        // Comparison / Alternative Pages
        'remove-bg-alternative': resolve(__dirname, 'pages/remove-bg-alternative.html'),
        'photoroom-alternative': resolve(__dirname, 'pages/photoroom-alternative.html'),
        'best-free-background-remover-apps': resolve(__dirname, 'pages/best-free-background-remover-apps.html'),
        'offline-background-remover': resolve(__dirname, 'pages/offline-background-remover.html'),
        'background-remover-no-watermark': resolve(__dirname, 'pages/background-remover-no-watermark.html'),
        'background-remover-no-signup': resolve(__dirname, 'pages/background-remover-no-signup.html'),

        // Use-case Pages
        'passport-photo': resolve(__dirname, 'pages/passport-photo-background-remover.html'),
        'product-photo': resolve(__dirname, 'pages/product-photo-background-remover.html'),
        'profile-picture': resolve(__dirname, 'pages/profile-picture-background-remover.html'),
        'youtube-thumbnail': resolve(__dirname, 'pages/youtube-thumbnail-background-remover.html'),
        'sticker-maker': resolve(__dirname, 'pages/sticker-maker-background-remover.html'),
        'white-background': resolve(__dirname, 'pages/white-background-photo-maker.html'),
        'transparent-bg': resolve(__dirname, 'pages/transparent-background-maker.html'),
        'change-bg-color': resolve(__dirname, 'pages/change-photo-background-color.html'),
        'instagram-bg': resolve(__dirname, 'pages/instagram-background-remover.html'),

        // How-To Guides
        'guide-android': resolve(__dirname, 'pages/how-to/remove-background-android.html'),
        'guide-transparent': resolve(__dirname, 'pages/how-to/make-photo-background-transparent.html'),
        'guide-white': resolve(__dirname, 'pages/how-to/change-background-to-white.html'),
        'guide-offline': resolve(__dirname, 'pages/how-to/remove-background-without-internet.html'),
        'guide-sticker': resolve(__dirname, 'pages/how-to/make-sticker-from-photo.html'),
        'guide-passport': resolve(__dirname, 'pages/how-to/create-passport-photo-at-home.html'),

        // Blog
        'blog-index': resolve(__dirname, 'pages/blog/index.html'),
        'blog-post-1': resolve(__dirname, 'pages/blog/best-free-background-remover-apps-2026.html'),
        'blog-post-2': resolve(__dirname, 'pages/blog/offline-background-removal-privacy.html'),
        'blog-post-3': resolve(__dirname, 'pages/blog/how-background-removal-ai-works.html'),
        'blog-post-4': resolve(__dirname, 'pages/blog/png-vs-jpg-transparent-images.html'),

        // Free Web Tool
        'free-tool': resolve(__dirname, 'pages/free-online-background-remover.html'),
      }
    }
  }
});
