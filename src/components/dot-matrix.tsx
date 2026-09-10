import * as motion from 'motion/react-client';
import type { ComponentProps } from 'react';

export type DotProps = ComponentProps<typeof motion.circle>;

export function DotMatrix({
  glyphs,
  dotProps,
}: {
  glyphs: readonly (readonly string[])[];
  dotProps?: ReadonlyMap<string, DotProps>;
}) {
  return glyphs.flatMap((rows, glyph) =>
    rows.flatMap((row, y) =>
      row.split('').map((dot, x) => {
        if (dot !== '1') return null;
        const key = `${glyph}-${y}-${x}`;
        const cx = glyph * 48 + x * 8 + 4;
        const cy = y * 8 + 4;
        const props = dotProps?.get(key);
        return props ? (
          <motion.circle key={key} cx={cx} cy={cy} r='2.8' {...props} />
        ) : (
          <circle key={key} cx={cx} cy={cy} r='2.8' />
        );
      }),
    ),
  );
}
