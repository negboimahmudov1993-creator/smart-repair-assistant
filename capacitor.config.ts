import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jolremont.app',
  appName: 'JOL-Remont',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'umnyj-remontnyj-pomoshhnik-1.vercel.app',
      '*.vercel.app'
    ]
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
