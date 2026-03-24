import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

/* Generate a fine glass grain — very small particles, near-invisible */
const navNoiseUrl = (() => {
  if (typeof document === "undefined") return "";
  const size = 48;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const imageData = ctx.createImageData(size, size);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 8; // barely-there grain
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
})();

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "/" },
    { label: "Pricing", href: "/pricing" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 flex justify-center w-full z-50 transition-all duration-500 ease-out"
      style={{ padding: scrolled ? "12px 16px" : "0px" }}
    >
      <motion.div
        className="relative flex items-center justify-between px-3 transition-all duration-500 ease-out overflow-hidden"
        style={{
          maxWidth: scrolled ? "800px" : "100%",
          width: "100%",
          paddingTop: scrolled ? "12px" : "16px",
          paddingBottom: scrolled ? "12px" : "16px",
          borderRadius: scrolled ? "50px" : "0px",
          backgroundColor: scrolled
            ? "hsla(var(--transparent) / 0.35)"
            : "transparent",
          backdropFilter: scrolled ? "blur(5px) saturate(100%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(5px) saturate(100%)" : "none",
          boxShadow: scrolled
            ? "0 18px 48px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
            : "none",
          borderWidth: scrolled ? ".5px" : "0px",
          borderStyle: "solid",
          borderColor: scrolled
            ? "hsla(transparent / 0.08)"
            : "transparent",
        }}
      >
        {/* Glass effect layers */}
        {scrolled && (
          <>
            {/* Fine grain texture */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[50px]"
              style={{
                backgroundImage: `url(${navNoiseUrl})`,
                backgroundRepeat: "repeat",
                opacity: 0.4,
                mixBlendMode: "soft-light",
              }}
            />
            {/* Top-edge refraction highlight */}
            <div
              className="absolute inset-x-0 top-0 h-[1px] pointer-events-none rounded-[50px]"
              style={{
                background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent 90%)",
              }}
            />
          </>
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <span className="text-lg font-bold text-foreground hidden sm:inline">
            dispatchCore
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 relative z-10">
          {navItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              {item.href.startsWith("#") ? (
                <a
                  href={item.href}
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.href}
                  className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <motion.div
          className="hidden md:block relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-5 py-2 text-sm text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center relative z-10"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </motion.button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-foreground" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a
                    href={item.href}
                    className="text-base text-foreground font-medium"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
                  onClick={toggleMenu}
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
