import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { useSubmitFeedback } from '@workspace/api-client-react';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  playerName?: string;
  playerClass?: string;
  chapter?: number;
  scene?: string;
}

const RATINGS = [
  { value: 'terrible', label: 'Terrible', emoji: '💀' },
  { value: 'bad', label: 'Bad', emoji: '😞' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'good', label: 'Good', emoji: '😊' },
  { value: 'amazing', label: 'Amazing', emoji: '🔥' },
] as const;

type Rating = typeof RATINGS[number]['value'];

export default function FeedbackModal({ open, onClose, playerName, playerClass }: FeedbackModalProps) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitFeedback, isPending } = useSubmitFeedback({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2500);
      },
    },
  });

  const handleClose = () => {
    setRating(null);
    setMessage('');
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!rating || !message.trim()) return;
    submitFeedback({
      data: {
        rating,
        message: message.trim(),
        playerName: playerName ?? null,
        playerClass: playerClass ?? null,
      },
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="feedback-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[200]"
            onClick={handleClose}
          />
          <motion.div
            key="feedback-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[201] w-full max-w-md px-4"
          >
            <div className="card-parchment p-6 space-y-5 border border-blood/30 relative">
              <button
                data-testid="feedback-modal-close"
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <CheckCircle className="w-10 h-10 text-gold" />
                  <div className="font-display text-lg text-foreground">Your words are heard.</div>
                  <p className="font-lore italic text-sm text-muted-foreground">
                    The Dark Council thanks you for your wisdom, dark sovereign.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-foreground tracking-wide">Playtester Feedback</h2>
                    <div className="rune-divider text-[0.5rem]">ᚠᛖᛖᛞᛒᚨᚲᚲ</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/50 font-sans uppercase">
                      How would you rate the experience?
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {RATINGS.map(r => (
                        <button
                          key={r.value}
                          data-testid={`rating-${r.value}`}
                          onClick={() => setRating(r.value)}
                          className={`flex-1 min-w-[4rem] py-2 px-2 border text-center transition-all text-xs font-sans rounded-sm ${
                            rating === r.value
                              ? 'border-accent bg-accent/20 text-foreground'
                              : 'border-border/30 bg-card/40 text-muted-foreground hover:border-muted/50'
                          }`}
                        >
                          <div className="text-lg leading-none mb-0.5">{r.emoji}</div>
                          <div>{r.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/50 font-sans uppercase">
                      Your thoughts
                    </div>
                    <textarea
                      data-testid="feedback-message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="What did you enjoy? What would you change? Any bugs?"
                      rows={4}
                      className="w-full bg-background/50 border border-border/30 text-foreground placeholder-muted-foreground/40 text-sm font-lore p-3 resize-none focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  <button
                    data-testid="button-submit-feedback"
                    onClick={handleSubmit}
                    disabled={!rating || !message.trim() || isPending}
                    className={`w-full py-3 border flex items-center justify-center gap-2 font-sans text-xs tracking-widest uppercase transition-all ${
                      !rating || !message.trim() || isPending
                        ? 'border-muted/20 bg-muted/5 text-muted-foreground/30 cursor-not-allowed'
                        : 'border-accent/50 bg-accent/10 hover:bg-accent/20 text-accent cursor-pointer'
                    }`}
                  >
                    {isPending ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>Send Feedback</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
