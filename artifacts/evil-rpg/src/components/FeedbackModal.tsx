import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, CheckCircle } from 'lucide-react';
import { useSubmitFeedback } from '@workspace/api-client-react';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  chapter?: number;
  scene?: string;
}

export default function FeedbackModal({ open, onClose, chapter, scene }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate: submitFeedback, isPending } = useSubmitFeedback({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      },
    },
  });

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    submitFeedback({
      data: {
        rating,
        chapter: chapter ?? null,
        scene: scene ?? null,
        comment: comment.trim() || null,
      },
    });
  };

  const displayRating = hoveredRating || rating;

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
                  <CheckCircle className="w-10 h-10 text-blood" />
                  <div className="font-display text-lg text-foreground">Feedback Received</div>
                  <p className="font-lore italic text-sm text-muted-foreground">
                    Your words shall be heard, dark sovereign.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-foreground tracking-wide">Playtester Feedback</h2>
                    <div className="rune-divider text-[0.5rem]">ᚠᛖᛖᛞᛒᚨᚲᚲ</div>
                    {(chapter || scene) && (
                      <div className="text-[0.6rem] text-muted-foreground/50 font-sans uppercase tracking-widest pt-1">
                        {chapter && `Chapter ${chapter}`}{chapter && scene && ' · '}{scene}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/60 font-sans uppercase">
                      Rating
                    </label>
                    <div
                      className="flex gap-1"
                      onMouseLeave={() => setHoveredRating(0)}
                      data-testid="feedback-star-row"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          data-testid={`feedback-star-${star}`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              star <= displayRating
                                ? 'fill-blood text-blood'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating === 0 && (
                      <p className="text-[0.6rem] text-blood/50 font-sans">Select a rating to continue</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[0.6rem] tracking-[0.3em] text-muted-foreground/60 font-sans uppercase">
                      Comments <span className="text-muted-foreground/30">(optional)</span>
                    </label>
                    <textarea
                      data-testid="feedback-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts, dark one..."
                      rows={4}
                      className="w-full bg-black/30 border border-border/40 text-foreground font-lore text-sm placeholder:text-muted-foreground/30 p-3 resize-none focus:outline-none focus:border-blood/40 transition-colors"
                    />
                  </div>

                  <button
                    data-testid="feedback-submit"
                    onClick={handleSubmit}
                    disabled={rating === 0 || isPending}
                    className={`w-full py-3 border flex items-center justify-center gap-2 font-sans text-sm tracking-widest uppercase transition-all ${
                      rating > 0
                        ? 'border-blood/50 bg-blood/10 hover:bg-blood/20 text-blood cursor-pointer'
                        : 'border-muted/20 bg-muted/5 text-muted-foreground/30 cursor-not-allowed'
                    }`}
                  >
                    {isPending ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        Submitting...
                      </motion.span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Feedback
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
