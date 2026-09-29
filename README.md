# GiftFlow Demo – installable app project
Fully offline. Demo/simulation only. No backend, no real payments.

## Quick options
1. **Instant install (no tools):** host the `www/` folder on any static host over HTTPS, open it on your phone, then "Add to Home Screen". The service worker makes it work offline.
2. **Android APK (needs Node 18+, Android Studio + JDK 17):**
   npm install
   npm run setup      # adds Android project + generates icons
   npm run apk        # debug APK -> android/app/build/outputs/apk/debug/app-debug.apk
   (or `npm run open` and press Run in Android Studio)
3. **iOS:** needs a Mac + Xcode: `npm i @capacitor/ios && npx cap add ios && npx cap open ios`

Edit `www/index.html` (all app code lives there), then `npm run sync`.
Note: in the native app, PNG "Save" may need the Filesystem plugin; Share uses the system share sheet where supported.
