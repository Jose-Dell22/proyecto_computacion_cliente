import { useEffect } from "react";
import { gsap } from "gsap";
import { refreshScrollTrigger } from "../utils/animations";

/**
 * Ejecuta animaciones GSAP en un contexto aislado y revierte al desmontar.
 */
export function useGsapScroll(setup, deps = []) {
  useEffect(() => {
    const ctx = gsap.context(setup);

    const refreshId = requestAnimationFrame(() => {
      refreshScrollTrigger();
      requestAnimationFrame(() => refreshScrollTrigger());
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
      refreshScrollTrigger();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
