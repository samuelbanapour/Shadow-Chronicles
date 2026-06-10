import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.replit.shadow_chronicle__samuelb100.twa',
  appName: 'Dark Sov',
  webDir: 'www',
  // Load the live game from Render, exactly like the old Trusted Web Activity did.
  // The native AdMob SDK is layered on top of this WebView.
  server: {
    url: 'https://shadow-chronicles-1.onrender.com',
    cleartext: false,
    // Keep these hosts inside the app's WebView; everything else opens in the browser.
    allowNavigation: ['shadow-chronicles-1.onrender.com'],
  },
  android: {
    // AdMob requires a hardware-accelerated, non-cleartext WebView; defaults are fine.
    backgroundColor: '#0A0203',
  },
};

export default config;
