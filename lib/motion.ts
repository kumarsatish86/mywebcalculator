export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export const staggerContainer = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const transitionSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 36,
};

export const transitionSoft = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};
