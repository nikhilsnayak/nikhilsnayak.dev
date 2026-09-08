'use client';

import { useSpring } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

import portrait from '~/assets/images/portrait-dot-matrix.png';

export function InteractivePortrait({ className }: { className: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const x = useSpring(0, { stiffness: 100, damping: 10, mass: 1 });
  const y = useSpring(0, { stiffness: 100, damping: 10, mass: 1 });
  const strength = useSpring(0, { stiffness: 100, damping: 10, mass: 1 });

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!image || !canvas || !context) return;
    canvas.hidden = true;

    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    // Normalized position of the neckline in this portrait. The head stays untouched.
    const neckline = 0.48;
    let source: ImageData | undefined;
    let patch: ImageData;
    let previous: { left: number; top: number } | undefined;
    let scale = 1;
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (!source || !media.matches) {
        canvas.hidden = true;
        return;
      }

      if (previous) {
        context.putImageData(source, 0, 0, previous.left, previous.top, patch.width, patch.height);
        previous = undefined;
      }

      const push = Math.max(0, Math.min(1, strength.get())) * 6 * scale;
      if (push < 0.01) {
        canvas.hidden = true;
        return;
      }

      const radius = 50 * scale;
      const centerX = x.get() * scale;
      const centerY = y.get() * scale;
      const left = Math.floor(centerX - radius);
      const top = Math.floor(centerY - radius);
      const pixels = source.data;
      const output = patch.data;
      const { width, height } = source;

      for (let row = 0; row < patch.height; row++) {
        const shoulderFade = Math.max(0, Math.min(1, ((top + row) / height - neckline) / 0.12));
        const bodyWeight = shoulderFade * shoulderFade * (3 - 2 * shoulderFade);
        for (let column = 0; column < patch.width; column++) {
          const index = (row * patch.width + column) * 4;
          const dx = left + column - centerX;
          const dy = top + row - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          output[index + 3] = 255;
          if (distance >= radius || bodyWeight === 0) {
            const original = ((top + row) * width + left + column) * 4;
            output[index] = pixels[original];
            output[index + 1] = pixels[original + 1];
            output[index + 2] = pixels[original + 2];
            continue;
          }

          // Move the texture outward without cutting a hole at the pointer.
          // Ease the displacement to zero at both the neckline and radius boundary.
          const falloff = 1 - distance / radius;
          const ratio = 1 - (4 * push * falloff * falloff * bodyWeight) / radius;
          const sampleX = Math.max(0, Math.min(width - 1, centerX + dx * ratio));
          const sampleY = Math.max(0, Math.min(height - 1, centerY + dy * ratio));
          const x0 = Math.floor(sampleX);
          const y0 = Math.floor(sampleY);
          const x1 = Math.min(x0 + 1, width - 1);
          const y1 = Math.min(y0 + 1, height - 1);
          const blendX = sampleX - x0;
          const blendY = sampleY - y0;
          const upperLeft = (y0 * width + x0) * 4;
          const upperRight = (y0 * width + x1) * 4;
          const lowerLeft = (y1 * width + x0) * 4;
          const lowerRight = (y1 * width + x1) * 4;
          const weight00 = (1 - blendX) * (1 - blendY);
          const weight10 = blendX * (1 - blendY);
          const weight01 = (1 - blendX) * blendY;
          const weight11 = blendX * blendY;
          for (let channel = 0; channel < 3; channel++) {
            output[index + channel] =
              pixels[upperLeft + channel] * weight00 +
              pixels[upperRight + channel] * weight10 +
              pixels[lowerLeft + channel] * weight01 +
              pixels[lowerRight + channel] * weight11;
          }
        }
      }
      context.putImageData(patch, left, top);
      previous = { left, top };
      canvas.hidden = false;
    };

    const scheduleDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const reset = () => strength.set(0);
    const resize = () => {
      canvas.hidden = true;
      source = undefined;
      previous = undefined;
      strength.jump(0);
      if (!media.matches || !image.complete || !image.naturalWidth) return;
      const bounds = image.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      canvas.width = Math.round(bounds.width * Math.min(devicePixelRatio, 2));
      canvas.height = Math.round(bounds.height * Math.min(devicePixelRatio, 2));
      scale = canvas.width / bounds.width;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      source = context.getImageData(0, 0, canvas.width, canvas.height);
      const diameter = Math.ceil(100 * scale) + 1;
      patch = context.createImageData(diameter, diameter);
    };

    const move = (event: PointerEvent) => {
      if (!source || !media.matches || event.pointerType !== 'mouse') return;
      const bounds = image.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      if (
        localX < 0 ||
        localY < bounds.height * neckline ||
        localX > bounds.width ||
        localY > bounds.height
      ) {
        reset();
        return;
      }
      if (strength.get() < 0.01) {
        x.jump(localX);
        y.jump(localY);
      }
      x.set(localX);
      y.set(localY);
      strength.set(1);
    };

    const unsubscribe = [
      x.on('change', scheduleDraw),
      y.on('change', scheduleDraw),
      strength.on('change', scheduleDraw),
    ];
    const observer = new ResizeObserver(resize);
    observer.observe(image);
    image.addEventListener('load', resize);
    media.addEventListener('change', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    resize();

    return () => {
      canvas.hidden = true;
      unsubscribe.forEach((stop) => stop());
      observer.disconnect();
      cancelAnimationFrame(frame);
      image.removeEventListener('load', resize);
      media.removeEventListener('change', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
    };
  }, [strength, x, y]);

  return (
    <div className={className} aria-hidden='true'>
      <Image
        className='h-auto w-full'
        ref={imageRef}
        src={portrait}
        alt=''
        sizes='(min-width: 1024px) 496px, (min-width: 640px) 448px, (max-width: 352px) 100vw, 352px'
        loading='eager'
      />
      <canvas
        ref={canvasRef}
        className='absolute inset-0 h-full w-full motion-reduce:hidden'
        hidden
      />
    </div>
  );
}
