/**
 * AdMob helpers for the native (Capacitor) build of the game.
 *
 * The bottom **banner** is shown automatically by the native app shell (MainActivity),
 * so it needs nothing here. This module adds the **interstitial** (and an optional
 * **rewarded**) ad that the game triggers at natural breaks (e.g. returning to the title).
 *
 * Everything here is a no-op in a normal web browser — guarded by isNativePlatform() —
 * so the same deployed site is safe on the web and monetized inside the Android app.
 *
 * Interstitial uses the real "Between Chapters" unit with test mode OFF (live ads).
 * Rewarded is NOT wired up yet and still points at a Google test unit — if you want
 * rewarded ads, create a Rewarded unit in AdMob and replace REWARDED_AD_ID below.
 */
import { Capacitor } from '@capacitor/core';
import { AdMob, type AdOptions, type RewardAdOptions } from '@capacitor-community/admob';

// TEST MODE for closed testing. Real interstitial unit is ca-app-pub-2118348297034183/7265849130.
const INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712'; // Google test interstitial
const REWARDED_AD_ID = 'ca-app-pub-3940256099942544/5224354917'; // TODO: Google test unit — replace with a real Rewarded unit

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
    const options: AdOptions = { adId: INTERSTITIAL_AD_ID, isTesting: true };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (err) {
    console.warn('[ads] interstitial skipped:', err);
  }
}

/**
 * Show a rewarded video ad. Resolves true only if the user watched it through and
 * earned the reward. Returns false in a browser or on any error.
 * NOT called anywhere yet — still on a test unit until you create a real Rewarded unit.
 */
export async function showRewarded(): Promise<boolean> {
  if (!isNative) return false;
  try {
    await ensureInit();
    const options: RewardAdOptions = { adId: REWARDED_AD_ID, isTesting: true };
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
