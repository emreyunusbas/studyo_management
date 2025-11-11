/**
 * WebWrapper Component - Provides responsive container for web layouts
 * Automatically centers content on desktop and provides max-width constraints
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { isWeb, getScreenSize, maxWidths } from '@/constants/webConfig';

interface WebWrapperProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: ViewStyle;
  centered?: boolean;
}

export function WebWrapper({
  children,
  maxWidth = maxWidths.content,
  style,
  centered = true,
}: WebWrapperProps) {
  // On mobile or non-web, render children directly
  if (!isWeb) {
    return <>{children}</>;
  }

  const screenSize = getScreenSize();
  const isLargeScreen = screenSize === 'desktop' || screenSize === 'wide';

  // Only apply wrapper on desktop
  if (!isLargeScreen) {
    return <>{children}</>;
  }

  return (
    <View
      style={[
        styles.container,
        centered && styles.centered,
        { maxWidth },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  centered: {
    marginHorizontal: 'auto' as any, // TypeScript doesn't recognize 'auto' but web does
  },
});

// Export web-specific responsive styles
export const webResponsiveStyles = StyleSheet.create({
  // Container for full-width sections
  section: {
    width: '100%',
    maxWidth: maxWidths.content,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  // Grid container for cards
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },

  // Individual grid item
  gridItem: {
    flex: 1,
    minWidth: 300,
  },

  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },

  // Sidebar layout
  sidebar: {
    flexDirection: 'row',
    gap: 24,
  },

  sidebarMain: {
    flex: 3,
  },

  sidebarAside: {
    flex: 1,
    minWidth: 250,
  },

  // Card with hover effect (web only)
  cardHover: isWeb
    ? {
        cursor: 'pointer' as any,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      }
    : {},
});
