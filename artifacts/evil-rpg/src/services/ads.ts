/**
 * AdMob helpers for the native (Capacitor) build of the game.
 *
 * The bottom **banner** is shown automatically by the native app shell (MainActivity),
 * so it needs nothing here. This module adds optional **interstitial** and **rewarded**
 * ads that the game triggers at natural breaks (e.g. returning to the title screen).
 *
 * Everything here is a no-op in a normal web browser — guarded by isNativePlatform() —
 * so the same deployed site is safe on the web and monetized inside the Android app.
 *
 * NOTE: these use Google's OFFICIAL TEST ad units. Replace the IDs below with your real
 * AdMob ad-unit IDs (from https://apps.admob.com) before publishing for real revenue.
 * Clicking your own *real* ads will get your AdMob account banned.
 */
import { Capacitor } from '@capacitor/core';
import { AdMob, type AdOptions, type RewardAdOptions } from '@capacitor-community/admob';

const TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';

const isNative = Capacitor.isNativePlatform();
let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!isNative) return Promise.resolve();
  if (!initPromise) {
    initPromise = AdMob.initialize({ initializeForTesting: true }).catch((err) => {
      // Reset so a later call can retry.
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

/**
 * Show a full-screen interstitial ad. Safe to call anywhere: it does nothing in a
 * browser and never throws. Best used at natural breaks, not mid-action.
 */
export async function showInterstitial(): Promise<void> {
  if (!isNative) return;
  try {
    await ensureInit();
    const options: AdOptions = { adId: TEST_INTERSTITIAL_ID, isTesting: true };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (err) {
    console.warn('[ads] interstitial skipped:', err);
  }
}

/**
 * Show a rewarded video ad. Resolves true only if the user watched it through and
 * earned the reward. Returns false in a browser or on any error.
 */
export async function showRewarded(): Promise<boolean> {
  if (!isNative) return false;
  try {
    await ensureInit();
    const options: RewardAdOptions = { adId: TEST_REWARDED_ID, isTesting: true };
    await AdMob.prepareRewardVideoAd(options);
    const reward = await AdMob.showRewardVideoAd();
    return reward != null && reward.amount > 0;
  } catch (err) {
    console.warn('[ads] rewarded skipped:', err);
    return false;
  }
}

/** True when running inside the native Android app (where ads are active). */
export const adsEnabled = isNative;
