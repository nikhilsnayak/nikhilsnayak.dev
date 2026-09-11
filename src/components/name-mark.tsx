import { ComponentProps } from 'react';

import { NAME_MARK_GLYPHS } from '~/lib/constants';

import { DotMatrix } from './dot-matrix';

export function NameMark({
  width = 404,
  color = 'currentColor',
  accentColor,
  className = 'h-auto w-full max-w-101',
  ...rest
}: {
  width?: number;
  color?: string;
  accentColor?: string;
  className?: string;
} & ComponentProps<'svg'>) {
  return (
    <svg
      viewBox='0 0 404 56'
      width={width}
      height={(width * 56) / 404}
      fill={color}
      aria-hidden='true'
      className={className}
      {...rest}
    >
      <DotMatrix glyphs={NAME_MARK_GLYPHS} />
      <circle
        cx='398'
        cy='52'
        r='4'
        fill={accentColor}
        className={accentColor ? undefined : 'fill-primary'}
      />
    </svg>
  );
}
