import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * Full-screen loading screen with Lottie truck animation.
 * Only appears if the page takes longer than `delay` ms to become interactive.
 * If the page loads fast, the user never sees it at all.
 */
export function LoadingScreen({ delay = 600 }: { delay?: number }) {
  const [shouldShow, setShouldShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show the loading screen if the page hasn't loaded within `delay` ms
    const showTimer = setTimeout(() => setShouldShow(true), delay);

    const dismiss = () => {
      clearTimeout(showTimer);
      // Small buffer so the animation doesn't flash for 1 frame
      setTimeout(() => setDismissed(true), shouldShow ? 800 : 0);
    };

    // Dismiss once the page is fully interactive
    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
    }

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("load", dismiss);
    };
  }, [delay, shouldShow]);

  // Never mounted — page loaded fast
  if (!shouldShow || dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6"
          style={{
            background: "linear-gradient(135deg, hsl(20 10% 8%) 0%, hsl(20 8% 14%) 40%, hsl(20 6% 10%) 100%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <DotLottieReact
            src="/Untitled file.lottie"
            loop
            autoplay
            className="w-40 h-40 md:w-56 md:h-56"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm font-medium text-white/50 tracking-widest uppercase"
          >
            dispatchCore
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
