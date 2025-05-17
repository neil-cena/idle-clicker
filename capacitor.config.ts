import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.idleincremental.app',
  appName: 'Idle Incremental',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
