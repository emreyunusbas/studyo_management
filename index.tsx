import React from 'react';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
const ctx = require.context('./app');
const App = () => <ExpoRoot context={ctx} />;

registerRootComponent(App);
