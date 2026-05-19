import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function resolveDomElement(el) {
  if (!el) return null;
  if (el instanceof Element) return el;
  return null;
}

const filterElements = (elements) =>
  (Array.isArray(elements) ? elements : [elements])
    .map(resolveDomElement)
    .filter(Boolean);

/** Restaura visibilidad si el scroll ya no disparó la animación */
export function showElementsIfNeeded(elements) {
  const valid = filterElements(elements);
  valid.forEach((el) => {
    const opacity = Number(gsap.getProperty(el, 'opacity'));
    if (opacity < 0.99) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
    }
  });
}

function isInViewport(el, threshold = 0.92) {
  const node = resolveDomElement(el);
  if (!node) return false;
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight * threshold && rect.bottom > 0;
}

function revealVisibleNow(elements, vars) {
  const valid = filterElements(elements);
  if (!valid.length) return;
  gsap.to(valid, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: vars.duration ?? 0.6,
    stagger: vars.stagger ?? 0.08,
    ease: vars.ease ?? 'power2.out',
    overwrite: true,
  });
}

export const animations = {
  fadeIn: (element, options = {}) => {
    const defaults = {
      duration: 1.2,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  slideInLeft: (element, options = {}) => {
    const defaults = {
      duration: 1.2,
      x: -100,
      opacity: 0,
      ease: 'power4.out'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  slideInRight: (element, options = {}) => {
    const defaults = {
      duration: 1,
      x: 100,
      opacity: 0,
      ease: 'power3.out'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  scaleIn: (element, options = {}) => {
    const defaults = {
      duration: 0.8,
      scale: 0.8,
      opacity: 0,
      ease: 'back.out(1.7)'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  rotateIn: (element, options = {}) => {
    const defaults = {
      duration: 1,
      rotation: 360,
      scale: 0,
      opacity: 0,
      ease: 'back.out(1.7)'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  bounce: (element, options = {}) => {
    const defaults = {
      duration: 1,
      y: -50,
      ease: 'bounce.out'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  staggerFadeIn: (elements, options = {}) => {
    const defaults = {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      ease: 'power2.out'
    };
    return gsap.from(elements, { ...defaults, ...options });
  },

  hoverScale: (element, options = {}) => {
    const defaults = {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.inOut'
    };
    return gsap.to(element, defaults);
  },

  hoverRotate: (element, options = {}) => {
    const defaults = {
      rotation: 5,
      duration: 0.3,
      ease: 'power2.inOut'
    };
    return gsap.to(element, defaults);
  },

  parallax: (element, options = {}) => {
    const defaults = {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  textReveal: (element, options = {}) => {
    const defaults = {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: 'power3.out'
    };
    return gsap.from(element, { ...defaults, ...options });
  },

  cardFlip: (element, options = {}) => {
    const defaults = {
      duration: 0.8,
      rotationY: 180,
      ease: 'power2.inOut'
    };
    return gsap.to(element, { ...defaults, ...options });
  },

  imageZoom: (element, options = {}) => {
    const defaults = {
      duration: 0.5,
      scale: 1.1,
      ease: 'power2.inOut'
    };
    return gsap.to(element, { ...defaults, ...options });
  },

  shake: (element, options = {}) => {
    const defaults = {
      duration: 0.5,
      x: 10,
      repeat: 5,
      yoyo: true,
      ease: 'power2.inOut'
    };
    return gsap.to(element, { ...defaults, ...options });
  },

  pulse: (element, options = {}) => {
    const defaults = {
      duration: 1,
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    };
    return gsap.to(element, { ...defaults, ...options });
  }
};

export const scrollTriggerAnimations = {
  fadeInOnScroll: (elements, options = {}) =>
    staggerCardsOnScroll(elements, { y: 30, scale: 1, ...options }),

  slideInOnScroll: (elements, options = {}) => {
    const valid = filterElements(elements);
    if (!valid.length) return;
    gsap.set(valid, { opacity: 0, x: -50 });
    return gsap.to(valid, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: options.trigger || valid[0],
        start: options.start || 'top 85%',
        once: true,
      },
    });
  },

  scaleInOnScroll: (elements, options = {}) =>
    staggerCardsOnScroll(elements, {
      scale: 0.88,
      ease: 'back.out(1.4)',
      ...options,
    }),
};

export const createImageHoverEffect = (imageElement, options = {}) => {
  if (!imageElement) return;
  
  try {
    const defaults = {
      scale: 1.08,
      duration: 0.4,
      ease: 'power2.inOut',
      rotation: 0
    };

    imageElement.addEventListener('mouseenter', () => {
      try {
        gsap.to(imageElement, { 
          ...defaults, 
          ...options,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          zIndex: 10
        });
      } catch (error) {
        console.error('Error in mouseenter animation:', error);
      }
    });

    imageElement.addEventListener('mouseleave', () => {
      try {
        gsap.to(imageElement, { 
          scale: 1, 
          duration: 0.4, 
          ease: 'power2.inOut',
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          zIndex: 1,
          rotation: 0
        });
      } catch (error) {
        console.error('Error in mouseleave animation:', error);
      }
    });
  } catch (error) {
    console.error('Error setting up hover effect:', error);
  }
};

export const createCardEntranceAnimation = (cardElement, options = {}) => {
  const defaults = {
    opacity: 0,
    y: 50,
    scale: 0.9,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: cardElement,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  };
  return gsap.from(cardElement, { ...defaults, ...options });
};

export const animateHeroImages = (imageElements, options = {}) => {
  if (!imageElements || imageElements.length === 0) return;
  
  try {
    const defaults = {
      opacity: 0,
      scale: 1.2,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power2.out'
    };
    return gsap.from(imageElements, { ...defaults, ...options });
  } catch (error) {
    console.error('Error animating hero images:', error);
  }
};

/** Revela un bloque al entrar en viewport */
export const revealOnScroll = (element, options = {}) => {
  const el = filterElements(element)[0];
  if (!el) return;

  const {
    trigger,
    start = 'top 88%',
    y = 40,
    x = 0,
    duration = 0.85,
    delay = 0,
    ease = 'power3.out',
  } = options;

  const scrollTriggerEl = resolveDomElement(trigger) || el;
  if (!scrollTriggerEl) {
    revealVisibleNow([el], { duration });
    return;
  }

  const tween = gsap.from(el, {
    opacity: 1,
    x,
    y,
    duration,
    delay,
    ease,
    scrollTrigger: {
      trigger: scrollTriggerEl,
      start,
      once: true,
      toggleActions: 'play none none none',
    },
  });

  if (isInViewport(el) || isInViewport(scrollTriggerEl)) {
    revealVisibleNow([el], { duration: duration * 0.7 });
  }

  return tween;
};

/** Tarjetas en cascada al hacer scroll */
export const staggerCardsOnScroll = (cards, options = {}) => {
  const valid = filterElements(cards);
  if (valid.length === 0) return;

  const {
    trigger,
    start = 'top 88%',
    stagger = 0.12,
    y = 50,
    scale = 0.9,
    duration = 0.75,
    ease = 'power3.out',
  } = options;

  const scrollTriggerEl =
    resolveDomElement(trigger) ||
    resolveDomElement(valid[0]?.parentElement) ||
    valid[0];

  if (!scrollTriggerEl) {
    revealVisibleNow(valid, { duration, stagger });
    return;
  }

  const tween = gsap.from(valid, {
    opacity: 1,
    y,
    scale,
    duration,
    stagger,
    ease,
    scrollTrigger: {
      trigger: scrollTriggerEl,
      start,
      once: true,
      toggleActions: 'play none none none',
    },
  });

  if (isInViewport(scrollTriggerEl)) {
    revealVisibleNow(valid, { duration: duration * 0.7, stagger });
  }

  return tween;
};

/** Alias retrocompatible */
export const createStaggeredCardAnimation = staggerCardsOnScroll;

/** Hover + zoom de imagen usando un contenedor DOM (no ref de Semantic UI Card) */
export function bindCardInteractions(wrapper, options = {}) {
  const node = resolveDomElement(wrapper);
  if (!node) return;

  const cardEl = node.querySelector('.ui.card') || node;
  if (cardEl instanceof Element) {
    setupCardLiftHover(cardEl, options.lift);
  }

  const img = node.querySelector('img');
  if (img) {
    createImageHoverEffect(img, { scale: options.imageScale ?? 1.06 });
  }
}

/** Elevación de tarjeta completa al hover */
export const setupCardLiftHover = (card, options = {}) => {
  const el = filterElements(card)[0];
  if (!el) return;

  const {
    liftY = -12,
    scale = 1.03,
    shadow = '0 18px 36px rgba(255, 123, 0, 0.35)',
  } = options;

  const onEnter = () => {
    gsap.to(el, {
      y: liftY,
      scale,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: shadow,
    });
  };

  const onLeave = () => {
    gsap.to(el, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      clearProps: 'transform',
    });
  };

  el.addEventListener('mouseenter', onEnter);
  el.addEventListener('mouseleave', onLeave);

  return () => {
    el.removeEventListener('mouseenter', onEnter);
    el.removeEventListener('mouseleave', onLeave);
  };
};

export const killAllAnimations = () => {
  try {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    ScrollTrigger.refresh(); // Refresh ScrollTrigger after cleanup
  } catch (error) {
    console.error('Error killing animations:', error);
  }
};

// Helper function to refresh ScrollTrigger safely
export const refreshScrollTrigger = () => {
  try {
    ScrollTrigger.refresh();
  } catch (error) {
    console.error('Error refreshing ScrollTrigger:', error);
  }
};

export default animations;
