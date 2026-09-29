# KudoPay – Creator Payments & Rewards App

KudoPay lets fans and supporters send tips, coins, and gifts to their favourite creators with instant receipts and offline support.

## Live Web App (PWA)
- **Live URL:** https://talha142.github.io/giftflow/
- Fully installable on iOS and Android: open the link and tap "Add to Home Screen".
- Offline ready with Service Worker and LocalStorage persistence.

## Quick Options
1. **Instant Web / PWA:**
   Host the project on GitHub Pages, Vercel, or Netlify.
2. **Android APK (Capacitor):**
   ```bash
   npm install
   npm run setup      # adds Android project + generates icons
   npm run apk        # debug APK -> android/app/build/outputs/apk/debug/app-debug.apk
   ```
3. **iOS:**
   ```bash
   npm i @capacitor/ios && npx cap add ios && npx cap open ios
   ```
