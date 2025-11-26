// ABOUTME: Animation configuration constants inspired by immersive-g.com
// ABOUTME: Provides standardized timing, easing, and animation patterns

/**
 * Easing curves from immersive-g.com for consistent motion design
 * These create sophisticated, professional animations
 */
export const EASING = {
  /**
   * Default easing for most animations
   * cubic-bezier(0.445, 0.05, 0.55, 0.95)
   * Smooth ease-in-out with slight emphasis on deceleration
   */
  default: [0.445, 0.05, 0.55, 0.95] as const,

  /**
   * Easing for hover states and quick transitions
   * cubic-bezier(0.39, 0.575, 0.565, 1)
   * Snappy ease-out that feels responsive
   */
  easeOut: [0.39, 0.575, 0.565, 1] as const,

  /**
   * Sharp easing for exit animations and dismissals
   * cubic-bezier(0.4, 0, 0, 1)
   * Quick, decisive motion
   */
  sharp: [0.4, 0, 0, 1] as const,

  /**
   * Gentle easing for subtle movements
   * cubic-bezier(0.2, 0, 0, 1)
   * Very smooth, barely noticeable
   */
  gentle: [0.2, 0, 0, 1] as const,
} as const;

/**
 * Standard durations for animations
 * Based on immersive-g.com timing patterns
 */
export const DURATION = {
  /** Fast interactions: hover states, small UI changes */
  fast: 0.3,

  /** Default animations: fades, slides, most transitions */
  default: 0.7,

  /** Slow, deliberate animations: hero reveals, major transitions */
  slow: 1.2,

  /** Loading and initialization sequences */
  loading: 0.75,
} as const;

/**
 * Stagger delays for sequential reveals
 */
export const STAGGER = {
  /** Cards, buttons, list items */
  cards: 0.1,

  /** Individual text characters (kinetic typography) */
  text: 0.02,

  /** Large sections or major layout elements */
  sections: 0.2,
} as const;

/**
 * Animation variants for Framer Motion
 * Pre-configured for consistent usage across components
 */
export const ANIMATION_VARIANTS = {
  /**
   * Fade in from below (most common pattern)
   */
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },

  /**
   * Fade in without movement
   */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  /**
   * Scale in (for modals, popups)
   */
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  /**
   * Slide in from right (for panels, sidebars)
   */
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
} as const;

/**
 * Scroll trigger configuration defaults
 * For GSAP ScrollTrigger animations
 */
export const SCROLL_CONFIG = {
  /** Start animation when element is 80% down viewport */
  defaultStart: 'top 80%',

  /** End when element is 50% down viewport */
  defaultEnd: 'top 50%',

  /** Standard scrub value for scroll-linked animations */
  scrub: {
    tight: true,      // Immediate response (immersive-g style)
    smooth: 1,        // Slight lag for smoother feel
    slow: 2,          // More pronounced lag
  },

  /** Markers for development (disable in production) */
  markers: process.env.NODE_ENV === 'development',
} as const;

/**
 * Helper function to create consistent Framer Motion transition
 */
export function createTransition(
  duration: number = DURATION.default,
  easing: readonly number[] = EASING.default,
  delay: number = 0
) {
  return {
    duration,
    ease: easing as any,
    delay,
  };
}

/**
 * Helper function to create GSAP easing string
 */
export function toGSAPEasing(easing: readonly number[]): string {
  return `cubic-bezier(${easing.join(',')})`;
}

/**
 * Viewport configuration for Framer Motion whileInView
 */
export const VIEWPORT_CONFIG = {
  /** Trigger once when scrolling down */
  once: true,

  /** Start animation slightly before element enters viewport */
  margin: '-100px',

  /** Minimum visible amount to trigger (0.3 = 30%) */
  amount: 0.3,
} as const;

/**
 * Performance hints for animated elements
 * Add these to elements that will animate for better performance
 */
export const WILL_CHANGE = {
  transform: 'transform',
  opacity: 'opacity',
  transformOpacity: 'transform, opacity',
} as const;

/**
 * 60fps-optimized duration tokens for micro-interactions
 * Inspired by 60fps.design philosophy: buttery smooth, purposeful motion
 */
export const DURATION_60FPS = {
  /** 120ms - Press, hover, focus states (instant feedback) */
  micro: 0.12,

  /** 160ms - Extended micro interactions */
  microLong: 0.16,

  /** 200ms - Menu pop, pill expand, dropdown reveal */
  short: 0.2,

  /** 240ms - Extended short interactions */
  shortLong: 0.24,

  /** 320ms - Card reveals, section entrances */
  enter: 0.32,

  /** 420ms - Extended entrance animations */
  enterLong: 0.42,

  /** 5000ms - Ambient floating, subtle pulse animations */
  ambient: 5,
} as const;

/**
 * 60fps-optimized easing curves
 * Crafted for natural, delightful motion
 */
export const EASING_60FPS = {
  /** Soft ease-out for warm, calm reveals - cubic-bezier(0.25, 0.1, 0.25, 1) */
  easeOutSoft: [0.25, 0.1, 0.25, 1] as const,

  /** Standard ease-in-out for balanced motion - cubic-bezier(0.4, 0, 0.2, 1) */
  easeInOutStandard: [0.4, 0, 0.2, 1] as const,

  /** Sharp ease-in for quick starts - cubic-bezier(0.4, 0, 1, 1) */
  easeInSharp: [0.4, 0, 1, 1] as const,

  /** Emphasized ease-out for button press - cubic-bezier(0, 0, 0.2, 1) */
  easeOutEmphasized: [0, 0, 0.2, 1] as const,
} as const;

/**
 * Spring physics configurations for natural, weighted motion
 * Parameters: type, stiffness (responsiveness), damping (bounce), mass (weight)
 */
export const SPRING_60FPS = {
  /** Polaroid/card wobble - playful spring with visible bounce */
  polaroidWobble: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
    mass: 0.8,
  },

  /** Paper settle - softer spring for lightweight elements */
  paperSettle: {
    type: 'spring' as const,
    stiffness: 250,
    damping: 18,
    mass: 1,
  },

  /** Button press - snappy response */
  buttonPress: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 20,
    mass: 0.5,
  },

  /** Dropdown expansion - smooth spatial reveal */
  dropdownExpand: {
    type: 'spring' as const,
    stiffness: 350,
    damping: 25,
    mass: 0.6,
  },
} as const;

/**
 * Stagger timing for sequential reveals
 * Fine-tuned for 60fps micro-interactions
 */
export const STAGGER_60FPS = {
  /** Card grid reveals (tighter than default) */
  cards: 0.06,

  /** Dropdown menu items */
  menuItems: 0.04,

  /** Text character reveals */
  textChars: 0.02,

  /** Icon cluster animations */
  icons: 0.08,
} as const;

/**
 * Transform values for consistent micro-interactions
 * Pre-defined values ensure design consistency
 */
export const TRANSFORM_60FPS = {
  /** Hover lift - 3px up */
  hoverLiftY: -3,

  /** Press scale - 2% shrink */
  pressScale: 0.98,

  /** Card rotation on hover - 0.5° tilt */
  cardRotate: 0.5,

  /** Card rotation extended - 1° tilt */
  cardRotateExtended: 1,

  /** Horizontal shake for errors - 3px */
  shakeX: 3,

  /** Icon pulse scale - 5% larger */
  iconPulse: 1.05,

  /** Success stamp scale sequence */
  stampScale: 1.03,
} as const;

/**
 * Loading screen configuration
 * Controls counter animation and exit behavior
 */
export const LOADER_CONFIG = {
  /** Duration for 0→100 counter animation (seconds) */
  counterDuration: 2.5,

  /** Easing for counter animation */
  counterEase: 'power2.inOut',

  /** Delay before exit animation starts (seconds) */
  exitDelay: 0.3,

  /** Duration for slide-up exit animation (seconds) */
  exitDuration: 0.8,

  /** Easing for exit animation - custom cubic bezier for smooth out */
  exitEase: 'power3.inOut',
} as const;

/**
 * Custom cursor configuration
 * Controls cursor sizes, smoothness, and behavior
 */
export const CURSOR_CONFIG = {
  /** Inner dot size in pixels */
  dotSize: 8,

  /** Outer ring size in pixels */
  ringSize: 40,

  /** Ring size when hovering interactive elements */
  ringHoverSize: 60,

  /** Ring size when clicking */
  ringClickSize: 32,

  /** Lerp smoothness for ring follow (0-1, lower = smoother) */
  ringSmoothing: 0.15,

  /** Hide cursor on touch devices */
  hideOnTouch: true,

  /** Mix blend mode for cursor elements */
  mixBlendMode: 'difference' as const,
} as const;

/**
 * Reveal animation stagger timings
 * For orchestrating sequential content reveals after loading
 */
export const REVEAL_STAGGER = {
  /** Base delay before reveal sequence starts (seconds) */
  baseDelay: 0.2,

  /** Floating name overlay reveal */
  floatingName: 0.3,

  /** Info grid cells stagger */
  infoCells: 0.15,

  /** CTA buttons stagger */
  ctaButtons: 0.1,

  /** Parking note reveal */
  parkingNote: 0.2,

  /** Marquee footer reveal */
  marquee: 0.3,

  /** Default reveal duration */
  duration: 0.7,

  /** Reveal easing - smooth ease out */
  ease: [0.25, 0.1, 0.25, 1] as const,
} as const;

/**
 * WebGL canvas configuration
 * For liquid distortion shader effect
 */
export const CANVAS_CONFIG = {
  /** Mouse influence radius (0-1 normalized) */
  mouseRadius: 0.3,

  /** Distortion intensity */
  distortionStrength: 0.15,

  /** Ambient noise speed */
  noiseSpeed: 0.3,

  /** Ambient noise amplitude */
  noiseAmplitude: 0.05,
} as const;
