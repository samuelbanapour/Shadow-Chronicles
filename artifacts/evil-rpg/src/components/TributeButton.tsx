import { useEffect, useState } from 'react';
import { Crown, X } from 'lucide-react';
import {
  detectAmazonIAP,
  onMonetizationChange,
  purchaseTribute,
  restoreTribute,
  isAmazonAvailable,
  isSupporter,
  TIP_TIERS,
} from '@/services/monetization';

/**
 * "Tribute to the Crown" — optional Amazon IAP tip. Renders nothing unless the
 * native Amazon IAP plugin responds (i.e. only on the Amazon Fire build), so it
 * never appears on Google Play or the web.
 */
export default function TributeButton() {
  const [available, setAvailable] = useState(isAmazonAvailable());
  const [supporter, setSupporter] = useState(isSupporter());
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    const unsub = onMonetizationChange((s) => {
      setAvailable(s.available);
      setSupporter(s.supporter);
    });
    void detectAmazonIAP();
    return unsub;
  }, []);

  if (!available) return null;

  const handleTip = async (sku: string) => {
    if (pending) return;
    setPending(true);
    const ok = await purchaseTribute(sku);
    setPending(false);
    if (ok) {
      setOpen(false);
      setThanks(true);
    }
  };

  if (supporter) {
    return (
      <div
        data-testid="patron-badge"
        className="fixed bottom-5 left-5 z-[150] flex items-center gap-2 px-4 py-2.5 border border-gold/50 bg-black/80 text-gold text-xs font-sans tracking-widest uppercase backdrop-blur-sm"
      >
        <Crown className="w-3.5 h-3.5" /> Patron
      </div>
    );
  }

  return (
    <>
      <button
        data-testid="tribute-btn"
        onClick={() => setOpen(true)}
        title="Pay tribute to support the developer"
        className="fixed bottom-5 left-5 z-[150] flex items-center gap-2 px-4 py-2.5 border border-blood/50 bg-black/80 hover:bg-blood/20 hover:border-blood text-blood text-xs font-sans tracking-widest uppercase transition-all shadow-lg backdrop-blur-sm"
      >
        <Crown className="w-3.5 h-3.5" /> Tribute
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm border border-blood/40 bg-card/95 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-blood font-bold tracking-wide">Tribute to the Crown</h2>
              <button
                onClick={() => !pending && setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-lore italic text-sm text-muted-foreground">
              This game is free. If it has earned your darkness, you may offer tribute to its maker.
              There is no reward but my thanks.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TIP_TIERS.map((t) => (
                <button
                  key={t.sku}
                  disabled={pending}
                  onClick={() => handleTip(t.sku)}
                  className="py-3 border border-blood/40 bg-blood/5 hover:bg-blood/20 text-blood text-sm font-sans tracking-wider transition-all disabled:opacity-50"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              disabled={pending}
              onClick={async () => {
                setPending(true);
                await restoreTribute();
                setPending(false);
              }}
              className="w-full text-[0.65rem] text-muted-foreground hover:text-foreground tracking-widest uppercase disabled:opacity-50"
            >
              Restore purchase
            </button>
            {pending && <p className="text-center text-xs text-blood/70 font-sans">The Crown listens…</p>}
          </div>
        </div>
      )}

      {thanks && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-6 cursor-pointer"
          onClick={() => setThanks(false)}
        >
          <div className="text-center space-y-3">
            <Crown className="w-10 h-10 text-gold mx-auto" />
            <p className="font-display text-xl text-gold">Your tribute is received.</p>
            <p className="font-lore italic text-sm text-muted-foreground">Thank you, patron. Tap to continue.</p>
          </div>
        </div>
      )}
    </>
  );
}
