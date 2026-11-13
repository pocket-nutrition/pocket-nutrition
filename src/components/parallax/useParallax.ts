import {useEffect, type RefObject} from 'react';

/** A layer's --amp from parallax.css, which narrows it on small screens and lets sections tune it. */
function amplitudeOf(layer: HTMLElement): number {
  return parseFloat(getComputedStyle(layer).getPropertyValue('--amp')) || 0;
}

/**
 * Scroll-linked drift for a .parallax-scene's layers in browsers without CSS scroll-driven
 * animations (parallax.css handles the others). Mirrors the CSS keyframes: a layer is offset by
 * (speed - 1) × t × --amp, where t runs from 1 (scene entering at the bottom) through
 * 0 (scene centred) to -1 (scene leaving at the top). Reduced motion keeps every layer still.
 */
export default function useParallax(sceneRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || CSS.supports('animation-timeline: view()')) {
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const layers = Array.from(scene.querySelectorAll<HTMLElement>('[data-speed]'));
    let amplitudes = layers.map(amplitudeOf);
    let frame = 0;
    let visible = true;

    const update = () => {
      frame = 0;
      const box = scene.getBoundingClientRect();
      const viewport = window.innerHeight;
      const reach = (viewport + box.height) / 2;
      const t = Math.max(-1, Math.min(1, (box.top + box.height / 2 - viewport / 2) / reach));
      layers.forEach((layer, index) => {
        const amplitude = reduceMotion.matches ? 0 : amplitudes[index];
        const offset = (Number(layer.dataset.speed) - 1) * t * amplitude;
        layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const queue = () => {
      if (visible && !frame) {
        frame = requestAnimationFrame(update);
      }
    };
    const resize = () => {
      amplitudes = layers.map(amplitudeOf);
      queue();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      queue();
    });

    observer.observe(scene);
    window.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('resize', resize);
    reduceMotion.addEventListener('change', queue);
    queue();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', resize);
      reduceMotion.removeEventListener('change', queue);
      cancelAnimationFrame(frame);
      layers.forEach((layer) => {
        layer.style.transform = '';
      });
    };
  }, [sceneRef]);
}
