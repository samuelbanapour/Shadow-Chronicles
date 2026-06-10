# Dark Sovereign RPG — Android app with AdMob

This replaces the old **Trusted Web Activity** (TWA) wrapper with a **Capacitor** app so the
game can show real **Google AdMob** ads. It loads the same live site
(`https://shadow-chronicles-1.onrender.com`) exactly like the TWA did — same backend, login,
and Play Billing — but now the native Google Mobile Ads SDK runs on top of it.

✅ Verified on an emulator: the game loads and a real AdMob **test banner** renders at the bottom.

---

## What shows ads

| Ad type | Where it's triggered | Needs web redeploy? |
|---|---|---|
| **Banner** (bottom) | Native shell — `MainActivity.java` injects JS on every page load | No |
| **Interstitial** (full screen) | The game calls `showInterstitial()` (wired into the "return to title" break) | Yes |
| **Rewarded** (optional) | Call `showRewarded()` from the game where you want it | Yes |

The banner works immediately. Interstitial/rewarded only fire once you deploy the web changes
(below), because the live site loaded in the app must contain that code.

---

## 🔴 Before you go live: replace the TEST ad IDs

Everything currently uses Google's **official test IDs** (safe, but earn no money). Clicking your
own *real* ads gets your AdMob account banned, so only swap these in when you're ready to ship.
Create an app + ad units at https://apps.admob.com, then replace **4 IDs in 3 files**:

1. **App ID** — `android/app/src/main/AndroidManifest.xml`
   `com.google.android.gms.ads.APPLICATION_ID` → your `ca-app-pub-…~…`
2. **Banner unit** — `android/app/src/main/java/app/replit/shadow_chronicle__samuelb100/twa/MainActivity.java`
   the `adId:` in `ADMOB_BOOTSTRAP_JS` → your banner `ca-app-pub-…/…`
3. **Interstitial + Rewarded units** — `…/Shadow-Chronicles-main/artifacts/evil-rpg/src/services/ads.ts`
   `TEST_INTERSTITIAL_ID` and `TEST_REWARDED_ID` → your units.
   Also set `isTesting: false` / drop `initializeForTesting` once you have real IDs.

---

## Rebuild the app (AAB for Play / APK to sideload)

```bash
cd ~/shadow-chronicles-app
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"

npx cap sync android
cd android
./gradlew :app:bundleRelease   # -> app/build/outputs/bundle/release/app-release.aab  (upload to Play)
./gradlew :app:assembleRelease # -> app/build/outputs/apk/release/app-release.apk      (sideload to test)
```

Bump `versionCode` in `android/app/build.gradle` before every Play upload (currently **3**; old TWA was 2).

## Deploy the web changes (for interstitials)

In `…/Shadow-Chronicles-main`:
```bash
pnpm install                                  # picks up the two new @capacitor deps in evil-rpg
# build & deploy evil-rpg through your normal Replit → Render flow
```
The new code is inert in a browser (`Capacitor.isNativePlatform()` guard), so the website is unaffected.

---

## ✅ Publishing — signing resolved (2026-06-09)

The first upload was rejected ("signed with the wrong key"). **Fixed:** the original Bubblewrap
upload key was recovered from `/Volumes/Claude/shadow-chronicles-twa/android.keystore`, copied to
`~/shadow-chronicles-app/android-original.keystore`, and the build now signs with it. Verified the
output AAB carries the exact certificate Play expects:

- SHA1 `B1:3E:EB:35:DF:CA:22:01:D2:2C:18:9D:BE:C7:BF:13:38:35:A7:F9` ✅
- SHA256 `1A:BC:42:35:47:50:35:67:8A:FC:9B:3E:FF:B7:03:60:B9:96:64:D5:06:D4:99:26:B9:A5:68:51:EF:DD:C0:A7` ✅
- Owner `CN=Sammy Banapour, O=Game Dev Solo`, alias `android`

So just **upload `app/build/outputs/bundle/release/app-release.aab` to Play** — it will be accepted as
an update. No upload-key reset needed.

🔒 **Back up these two things** (without them you can never update the app again):
- `android-original.keystore` (and the original at `/Volumes/Claude/shadow-chronicles-twa/android.keystore`)
- its password — stored in `android/keystore.properties`

The new `release.keystore` / `upload_certificate.pem` from the earlier attempt are now unused and can be ignored.

---

## Notes / things to check on a real device

- **Login:** the old TWA opened pages in real Chrome; Capacitor uses a WebView. If your Google
  sign-in uses an OAuth redirect, test it — embedded WebViews are sometimes blocked by Google
  sign-in. (Local/guest play is unaffected.)
- **Banner overlap:** the bottom banner sits over the last ~50dp of the page. If it covers any game
  UI, add `padding-bottom` to the web app on native, or move the banner to `TOP_CENTER` in
  `MainActivity.java`.
- The `System UI isn't responding` popup seen during testing is a headless-emulator glitch, not the app.
