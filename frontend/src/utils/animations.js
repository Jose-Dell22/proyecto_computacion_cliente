import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(ScrollTrigger, CSSPlugin);

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
  fadeInOnScroll: (elements, options = {}) => {
    if (!elements || elements.length === 0) return;
    
    try {
      gsap.set(elements, { opacity: 0, y: 30 });
      
      const animation = gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
      
      return animation;
    } catch (error) {
      console.error('Error in fadeInOnScroll:', error);
      try {
        gsap.set(elements, { opacity: 1, y: 0 });
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }
    }
  },

  slideInOnScroll: (elements, options = {}) => {
    if (!elements || elements.length === 0) return;
    
    try {
      gsap.set(elements, { opacity: 0, x: -50 });
      
      const animation = gsap.to(elements, {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
      
      return animation;
    } catch (error) {
      console.error('Error in slideInOnScroll:', error);
      try {
        gsap.set(elements, { opacity: 1, x: 0 });
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }
    }
  },

  scaleInOnScroll: (elements, options = {}) => {
    if (!elements || elements.length === 0) return;
    
    try {
      gsap.set(elements, { opacity: 0, scale: 0.9 });
      
      const animation = gsap.to(elements, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.3,
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
      
      return animation;
    } catch (error) {
      console.error('Error in scaleInOnScroll:', error);
      try {
        gsap.set(elements, { opacity: 1, scale: 1 });
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }
    }
  }
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

export const createStaggeredCardAnimation = (cardElements, options = {}) => {
  if (!cardElements || cardElements.length === 0) return;
  
  try {
    // Set initial state immediately
    gsap.set(cardElements, { opacity: 0, y: 20, scale: 0.98 });
    
    // Animate them in with immediate visibility
    const animation = gsap.to(cardElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.2)',
      delay: 0.2, // Very short delay
      scrollTrigger: {
        trigger: cardElements[0],
        start: 'top 90%', // Trigger later
        end: 'bottom 10%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // Force visibility when scrolling into view
          gsap.to(cardElements, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 });
        },
        onLeaveBack: () => {
          // Hide when scrolling up past
          gsap.to(cardElements, { opacity: 0, y: 20, scale: 0.98, duration: 0.3 });
        }
      }
    });
    
    // Fallback: make visible immediately if ScrollTrigger doesn't work
    setTimeout(() => {
      const firstCard = cardElements[0];
      if (firstCard) {
        const rect = firstCard.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          gsap.to(cardElements, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 });
        }
      }
    }, 500);
    
    return animation;
  } catch (error) {
    console.error('Error in staggered card animation:', error);
    // Fallback: make elements visible immediately
    try {
      gsap.set(cardElements, { opacity: 1, y: 0, scale: 1 });
    } catch (fallbackError) {
      console.error('Fallback animation failed:', fallbackError);
    }
  }
};

export const killAllAnimations = () => {
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

export default animations;
