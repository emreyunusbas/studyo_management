/**
 * HTML Root - Custom HTML for web platform
 * This file is used by Expo Router to customize the HTML root element on web
 */

import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* PWA primary color */}
        <meta name="theme-color" content="#B8FF3C" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* SEO */}
        <meta name="description" content="Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması. Üye yönetimi, seans planlama, finans takibi ve detaylı raporlama." />
        <meta name="keywords" content="pilates, stüdyo yönetim, üye takibi, seans planlama, fitness yönetim" />
        <meta name="author" content="Pilates Salon Yönetimi" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pilates Salon Yönetimi" />
        <meta property="og:description" content="Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması" />
        <meta property="og:image" content="/assets/icon.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Pilates Salon Yönetimi" />
        <meta property="twitter:description" content="Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Disable body scrolling on web */}
        <ScrollViewStyleReset />

        {/* Custom styles for web */}
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              box-sizing: border-box;
            }
            html, body, #root {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: #0A0A0B;
              overflow: hidden;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            #root {
              display: flex;
              flex-direction: column;
            }
            /* Custom scrollbar for web */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            ::-webkit-scrollbar-track {
              background: #1A1A1D;
            }
            ::-webkit-scrollbar-thumb {
              background: #B8FF3C;
              border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #9FE01A;
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
