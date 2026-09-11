'use client';

import { useEffect, useRef } from 'react';

import { NameMark } from './name-mark';

const RADIUS = 58;
const PUSH = 7;

export function InteractiveName() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const dots = Array.from(svg.querySelectorAll('circle')).map((dot) => ({
      dot,
      cx: dot.cx.baseVal.value,
      cy: dot.cy.baseVal.value,
    }));
    const { width: viewWidth, height: viewHeight } = svg.viewBox.baseVal;
    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    const reset = () => {
      for (const { dot } of dots) dot.style.transform = '';
    };

    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') return;

      const bounds = svg.getBoundingClientRect();
      if (!bounds.width) return;

      const unit = viewWidth / bounds.width;
      const pointerX = (event.clientX - bounds.left) * unit;
      const pointerY = (event.clientY - bounds.top) * unit;

      if (
        pointerX < -RADIUS ||
        pointerY < -RADIUS ||
        pointerX > viewWidth + RADIUS ||
        pointerY > viewHeight + RADIUS
      ) {
        reset();
        return;
      }

      for (const { dot, cx, cy } of dots) {
        const dx = cx - pointerX;
        const dy = cy - pointerY;
        const distance = Math.hypot(dx, dy);
        if (distance >= RADIUS) {
          dot.style.transform = '';
          continue;
        }
        const falloff = 1 - distance / RADIUS;
        const offset = (PUSH * falloff * falloff) / (distance || 1);
        dot.style.transform = `translate(${dx * offset}px, ${dy * offset}px)`;
      }
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    media.addEventListener('change', reset);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
      media.removeEventListener('change', reset);
      reset();
    };
  }, []);

  return (
    <span className='relative block w-full max-w-101'>
      <span className='block opacity-85'>
        <NameMark className='interactive-name overflow-visible' ref={svgRef} />
      </span>
    </span>
  );
}
