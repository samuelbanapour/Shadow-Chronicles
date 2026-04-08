# Dark Sovereign RPG — Google Play Store Guide

This guide walks you through publishing Dark Sovereign as an Android app on Google Play using a **Trusted Web Activity (TWA)** — Google's official method for wrapping PWAs as Play Store apps.

## What Has Already Been Set Up

- **PWA manifest** (`public/manifest.webmanifest`) — app name, icons, theme colors, display mode
- **All icon sizes** — 72×72 through 512×512 PNG, plus maskable icons for Android adaptive icons
- **Service worker** (via vite-plugin-pwa) — enables offline play after first load
- **Favicon** — `public/favicon.ico`
- **Digital Asset Links** placeholder — `public/.well-known/assetlinks.json`
- **Full meta tags** in `index.html` for iOS/Android PWA install

---

## Step 1: Deploy Your App

Your app must be live at an HTTPS URL first. Replit Deployments handle this — click **"Publish"** in Replit.

Your deployed URL will be something like:  
`https://dark-sovereign.replit.app/`

---

## Step 2: Install Bubblewrap (Google's TWA Tool)

On your local machine (Windows, Mac, or Linux):

```bash
npm install -g @bubblewrap/cli
bubblewrap --version
```

You'll also need:
- **Java JDK 8+**: https://adoptium.net/
- **Android SDK**: Install Android Studio from https://developer.android.com/studio

---

## Step 3: Generate the Android Project

```bash
mkdir dark-sovereign-android
cd dark-sovereign-android
bubblewrap init --manifest https://YOUR_DEPLOYED_URL/manifest.webmanifest
```

Fill in the prompts:
| Field | Value |
|-------|-------|
| Package ID | `com.darksovereign.rpg` (or your preferred ID) |
| App name | `Dark Sovereign RPG` |
| Short name | `Dark Sovereign` |
| Start URL | `/` |
| Theme color | `#0a0203` |
| Background color | `#0a0203` |
| Display mode | `standalone` |

---

## Step 4: Set Up Digital Asset Links

This links your Android app to your web domain, allowing the app to open your site without the browser bar.

1. Build the APK first (Step 5) to get your signing key fingerprint:
   ```bash
   bubblewrap build
   ```

2. Get your SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```

3. Update `public/.well-known/assetlinks.json` with your fingerprint:
   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.darksovereign.rpg",
         "sha256_cert_fingerprints": [
           "AB:CD:EF:..."  ← your actual fingerprint here
         ]
       }
     }
   ]
   ```

4. Re-deploy your app so the `assetlinks.json` is live at:
   `https://your-domain.replit.app/.well-known/assetlinks.json`

5. Verify with Google's tool:
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://YOUR_URL&relation=delegate_permission/common.handle_all_urls

---

## Step 5: Build the APK / AAB

```bash
# Build release App Bundle (required for Play Store)
bubblewrap build

# This produces:
# - app-release-bundle.aab  ← upload this to Play Store
# - app-release-signed.apk  ← for local testing
```

Test on a device:
```bash
bubblewrap install
```

---

## Step 6: Create a Google Play Developer Account

1. Go to https://play.google.com/console
2. Pay the one-time $25 registration fee
3. Complete developer profile (name, address, etc.)

---

## Step 7: Submit to Google Play

1. In Play Console → **Create app**
2. App type: **App** (not Game, unless you want Google Play Games features)
   - Actually, choose **Game** for better discoverability
3. Upload your **app-release-bundle.aab** to the Internal Testing track first
4. Fill in the store listing:
   - **Title**: Dark Sovereign RPG
   - **Short description**: A dark fantasy RPG where your choices forge a villain's destiny.
   - **Full description**: (use the description from the manifest)
   - **Category**: Role Playing
   - **Content rating**: Complete the questionnaire (expect Teen/Mature for dark themes)
   - **Screenshots**: Take screenshots at 1080×1920 (phone) and 2560×1600 (tablet)
5. Upload icons:
   - **High-res icon**: 512×512 PNG — use `/public/icons/icon-512x512.png`
   - **Feature graphic**: 1024×500 PNG — create this separately
6. Complete the content rating questionnaire
7. Set pricing (Free recommended)
8. Submit for review

---

## Content Rating Notes

Dark Sovereign contains:
- Dark themes and violence (choices result in deaths)
- Moral complexity and evil character options
- No real-money purchases, gambling, or explicit content

Expected rating: **Teen (T)** from ESRB / **PEGI 12-16**

---

## Updating the App

After any changes:
1. Redeploy the Replit app (the TWA will automatically serve the new version)
2. To update the Play Store listing or APK, increment the `versionCode` in Bubblewrap's `twa-manifest.json` and rebuild

---

## Alternative: PWABuilder (Easier Option)

If Bubblewrap feels complex, Microsoft's **PWABuilder** is a simpler browser-based tool:

1. Go to https://www.pwabuilder.com/
2. Enter your deployed URL
3. Click "Package for stores" → "Google Play"
4. Download the generated Android project
5. Open in Android Studio → build → upload to Play Console

PWABuilder handles most of the TWA configuration automatically.

---

## Checklist Before Submission

- [ ] App deployed at HTTPS URL on Replit
- [ ] `manifest.webmanifest` accessible at `https://your-url/manifest.webmanifest`
- [ ] All icons present (72px through 512px, plus maskable variants)
- [ ] `assetlinks.json` live at `https://your-url/.well-known/assetlinks.json`
- [ ] SHA-256 fingerprint in `assetlinks.json` matches your signing key
- [ ] APK/AAB built and tested on a physical device
- [ ] Play Console account created ($25 fee paid)
- [ ] Store listing complete (screenshots, descriptions, icons)
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL provided (required by Google Play)

---

## Privacy Policy

Google Play requires a privacy policy. Since the game stores data only in the user's local browser storage (no servers, no accounts, no data collection), you can use a simple template:

> Dark Sovereign RPG does not collect, store, or transmit any personal data. Game progress is stored locally on your device using browser storage and is never sent to any server.

Host this as a simple webpage and provide the URL in Play Console.
