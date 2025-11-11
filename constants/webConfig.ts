/**
 * Web-specific configuration and utilities
 */

import { Platform, Dimensions } from 'react-native';

// Check if running on web
export const isWeb = Platform.OS === 'web';

// Responsive breakpoints
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

// Get current screen size category
export const getScreenSize = () => {
  const { width } = Dimensions.get('window');

  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
};

// Check if current screen is desktop or larger
export const isDesktop = () => {
  const screenSize = getScreenSize();
  return screenSize === 'desktop' || screenSize === 'wide';
};

// Check if current screen is tablet or larger
export const isTabletOrLarger = () => {
  const screenSize = getScreenSize();
  return screenSize !== 'mobile';
};

// Web-specific maximum widths for better desktop experience
export const maxWidths = {
  content: 1200, // Main content area
  form: 600,     // Forms and modals
  card: 400,     // Individual cards
};

// Get responsive padding based on screen size
export const getResponsivePadding = () => {
  const screenSize = getScreenSize();

  switch (screenSize) {
    case 'wide':
      return 40;
    case 'desktop':
      return 32;
    case 'tablet':
      return 24;
    default:
      return 20;
  }
};

// Get responsive column count for grid layouts
export const getGridColumns = () => {
  const screenSize = getScreenSize();

  switch (screenSize) {
    case 'wide':
      return 4;
    case 'desktop':
      return 3;
    case 'tablet':
      return 2;
    default:
      return 1;
  }
};

// Web-specific hover effects
export const webHoverStyle = isWeb
  ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }
  : {};

// Keyboard shortcuts configuration for web
export const keyboardShortcuts = {
  newMember: 'n',
  newSession: 's',
  search: '/',
  settings: ',',
  home: 'h',
};

// Web-specific meta tags for SEO (can be used with react-helmet or similar)
export const webMetaTags = {
  title: 'Pilates Salon Yönetimi',
  description: 'Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması',
  keywords: 'pilates, stüdyo, yönetim, fitness, seans, üye takibi',
  author: 'Emre Yunus Baş',
  ogTitle: 'Pilates Salon Yönetimi',
  ogDescription: 'Modern ve kullanıcı dostu pilates stüdyo yönetim uygulaması',
  ogImage: '/assets/og-image.png',
};

// Export all utilities
export default {
  isWeb,
  breakpoints,
  getScreenSize,
  isDesktop,
  isTabletOrLarger,
  maxWidths,
  getResponsivePadding,
  getGridColumns,
  webHoverStyle,
  keyboardShortcuts,
  webMetaTags,
};
