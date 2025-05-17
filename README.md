# Idle Incremental

A minimalist idle incremental game. Built with React, Vite, and Capacitor. Play in the browser or install as an Android app.

## Run locally

```bash
npm install
npm run dev
```

## Build for web

```bash
npm run build
```

## Build Android APK

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Then build the APK from Android Studio.

## Optional: sound effects

Add `click.mp3`, `purchase.mp3`, and `prestige.mp3` in `public/sounds/` for button and prestige sounds. The game runs without them.
