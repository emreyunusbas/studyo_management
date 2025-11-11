/**
 * Web-specific styles and responsive design utilities
 */

import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

const isWeb = Platform.OS === 'web';

// Web-specific global styles
export const webStyles = StyleSheet.create({
  // Container with max width for desktop
  container: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },

  // Scrollable content area
  scrollableContent: {
    flex: 1,
    width: '100%',
  },

  // Card with hover effect
  hoverCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...(isWeb && {
      cursor: 'pointer' as any,
      transition: 'all 0.2s ease-in-out',
    }),
  },

  // Button with hover effect
  hoverButton: {
    ...(isWeb && {
      cursor: 'pointer' as any,
      transition: 'all 0.2s ease-in-out',
    }),
  },

  // Grid layout for desktop
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  // Grid item (responsive)
  gridItem: {
    minWidth: 280,
    flex: 1,
  },

  // Two column layout
  twoColumns: {
    flexDirection: 'row',
    gap: 20,
  },

  // Column (for two column layout)
  column: {
    flex: 1,
    minWidth: 300,
  },

  // Sidebar layout
  sidebarLayout: {
    flexDirection: 'row',
    gap: 24,
  },

  // Main content in sidebar layout
  sidebarMain: {
    flex: 3,
    minWidth: 600,
  },

  // Sidebar content
  sidebarContent: {
    flex: 1,
    minWidth: 280,
  },

  // Form container with max width
  formContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },

  // Modal container for web
  modalContainer: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },

  // Desktop-friendly input
  desktopInput: {
    ...(isWeb && {
      outlineStyle: 'none' as any,
    }),
  },

  // Header with gradient (web-optimized)
  gradientHeader: {
    ...(isWeb && {
      backgroundImage: `linear-gradient(135deg, ${Colors.primary}, ${Colors.primaryDark})`,
    }),
  },

  // Shadow for web
  webShadow: {
    ...(isWeb && {
      boxShadow: '0 4px 12px rgba(184, 255, 60, 0.15)' as any,
    }),
  },

  // Hover effect utilities
  hoverScale: {
    ...(isWeb && {
      ':hover': {
        transform: 'scale(1.02)',
      } as any,
    }),
  },

  // Text selection color
  textSelectable: {
    ...(isWeb && {
      userSelect: 'text' as any,
    }),
  },

  // Disable text selection
  noSelect: {
    ...(isWeb && {
      userSelect: 'none' as any,
    }),
  },
});

// Responsive breakpoints
export const responsive = {
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
  wide: '@media (min-width: 1440px)',
};

// Helper function to get responsive padding
export const getResponsivePadding = (base: number = 20): number => {
  if (!isWeb) return base;

  // On web, we can't detect screen size in StyleSheet
  // This should be used with useState and Dimensions.addEventListener
  return base;
};

// Helper function to add hover styles (for inline styles)
export const addHoverStyle = (baseStyle: any, hoverStyle: any) => {
  if (!isWeb) return baseStyle;

  return {
    ...baseStyle,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    // Note: Inline hover styles require libraries like @emotion or styled-components
    // This is a placeholder for the pattern
  };
};

// Web-specific accessibility helpers
export const webA11y = {
  // Add proper button role
  button: isWeb
    ? {
        role: 'button' as any,
        tabIndex: 0 as any,
      }
    : {},

  // Add proper link role
  link: isWeb
    ? {
        role: 'link' as any,
        tabIndex: 0 as any,
      }
    : {},

  // Add proper heading role
  heading: (level: number = 1) =>
    isWeb
      ? {
          role: 'heading' as any,
          'aria-level': level as any,
        }
      : {},
};

export default webStyles;
