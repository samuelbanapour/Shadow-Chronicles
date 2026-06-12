// ---------------------------------------------------------------------------
// Monetization — optional "Tribute to the Crown" supporter purchase (Amazon IAP)
// ---------------------------------------------------------------------------
// Amazon Fire devices have no Google Play Services, so AdMob can't serve there.
// On the Amazon build, players can instead make a one-time "patron" tip via
// Amazon In-App Purchasing (native MonetizationPlugin).
//
// The native plugin ships in every build, but Amazon IAP only RESPONDS on an
// Amazon device. So we probe it with a timeout: if it answers, we're on Amazon
// and show the Tribute button; otherwise (Google Play, plain web) it stays
// hidden. Every call is a no-op off-Amazon and never throws.
// ---------------------------------------------------------------------------
import { Capacitor, registerPlugin } from '@capacitor/core';

export interface TipTier {
  sku: string;
  amount: number;
  label: string;
}

// Must match the entitlement SKUs created in the Amazon Developer Console.
export const TIP_TIERS: TipTier[] = [
  { sku: 'com.gamedevsolo.darksovereign.tip_1', amount: 1, label: '$1' },
  { sku: 'com.gamedevsolo.darksovereign.tip_3', amount: 2.99, label: '$2.99' },
  { sku: 'com.gamedevsolo.darksovereign.tip_5', amount: 5, label: '$5' },
  { sku: 'com.gamedevsolo.darksovereign.tip_10', amount: 10, label: '$10' },
];
export const DEFAULT_TIP_SKU = 'com.gamedevsolo.darksovereign.tip_3';

interface MonetizationPlugin {
  initialize(): Promise<{ supporter: boolean }>;
  getEntitlements(): Promise<{ supporter: boolean }>;
  purchase(options: { sku: string }): Promise<{ owned: boolean }>;
  restore(): Promise<{ supporter: boolean }>;
}

const Monetization = registerPlugin<MonetizationPlugin>('Monetization');
const isNative = Capacitor.isNativePlatform();

let available = false; // Amazon IAP responded → this is an Amazon device
let supporter = false;

type State = { available: boolean; supporter: boolean };
const listeners = new Set<(s: State) => void>();
function emit(): void {
  const s: State = { available, supporter };
  listeners.forEach((fn) => fn(s));
}

export function onMonetizationChange(fn: (s: State) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function isAmazonAvailable(): boolean {
  return available;
}
export function isSupporter(): boolean {
  return supporter;
}

/**
 * Probe Amazon IAP. Resolves once we know whether to show the Tribute button.
 * On Google Play / web the plugin never responds, so we time out and stay hidden.
 */
export async function detectAmazonIAP(): Promise<void> {
  if (!isNative) return;
  try {
    const res = (await Promise.race([
      Monetization.initialize(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000)),
    ])) as { supporter: boolean };
    available = true;
    supporter = !!res?.supporter;
    emit();
  } catch {
    available = false; // not an Amazon device — keep the Tribute button hidden
  }
}

/** Start an Amazon tip purchase. Returns true if the patron entitlement is owned after. */
export async function purchaseTribute(sku: string = DEFAULT_TIP_SKU): Promise<boolean> {
  if (!isNative || !available) return false;
  try {
    const { owned } = await Monetization.purchase({ sku });
    if (owned) {
      supporter = true;
      emit();
    }
    return owned;
  } catch {
    return false;
  }
}

/** Restore a previously purchased tribute (Amazon requires a restore path). */
export async function restoreTribute(): Promise<boolean> {
  if (!isNative || !available) return supporter;
  try {
    const { supporter: owned } = await Monetization.restore();
    supporter = owned;
    emit();
    return owned;
  } catch {
    return false;
  }
}
