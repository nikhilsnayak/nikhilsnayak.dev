/* oxlint-disable next/no-img-element -- ImageResponse needs native img elements to embed raster assets. */
import fs from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';

import { NameMark } from '~/components/name-mark';

import { imagePalette as palette } from './image-palette';

const [fontRegular, fontMono, portrait] = await Promise.all([
  fs.readFile(path.join(process.cwd(), 'src/assets/fonts/Geist-Regular.ttf')),
  fs.readFile(path.join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Regular.ttf')),
  fs.readFile(path.join(process.cwd(), 'src/assets/images/portrait-dot-matrix.png')),
]);

const portraitSource = `data:image/png;base64,${portrait.toString('base64')}`;
const grainSource = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" stitchTiles="stitch" seed="7"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1200" height="630" filter="url(#grain)"/></svg>',
).toString('base64')}`;

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage() {
  return renderSocialImage(
    <NameMark width={550} color={palette.foreground} accentColor={palette.accent} className='' />,
  );
}

export function createArticleSocialImage(title: string) {
  const normalizedTitle = title.trim().replace(/\s+/g, ' ');
  const displayTitle =
    normalizedTitle.length > 160
      ? `${normalizedTitle.slice(0, 157).replace(/\s+\S*$/, '')}…`
      : normalizedTitle;
  const fontSize = displayTitle.length <= 35 ? 76 : displayTitle.length <= 85 ? 62 : 48;

  return renderSocialImage(
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, width: 850 }}>
      <NameMark width={230} color={palette.foreground} accentColor={palette.accent} className='' />
      <div
        style={{
          fontSize,
          letterSpacing: '-0.045em',
          lineHeight: 1.12,
          overflowWrap: 'break-word',
        }}
      >
        {displayTitle}
      </div>
    </div>,
  );
}

function renderSocialImage(content: ReactNode) {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '60px 72px 40px',
        backgroundColor: palette.background,
        color: palette.foreground,
        fontFamily: 'Geist',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src={portraitSource}
        alt=''
        width={600}
        height={600}
        style={{ position: 'absolute', top: -14, right: -30, opacity: 0.35 }}
      />
      <img
        src={grainSource}
        alt=''
        width={1200}
        height={630}
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.065 }}
      />
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 34,
          width: 42,
          height: 42,
          background: palette.foreground,
          opacity: 0.035,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 79,
          width: 18,
          height: 18,
          background: palette.foreground,
          opacity: 0.035,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
          paddingBottom: 20,
        }}
      >
        {content}
      </div>
      <div
        style={{
          display: 'flex',
          borderTop: `1px solid ${palette.border}`,
          paddingTop: 20,
          fontFamily: 'JetBrains Mono',
          fontSize: 17,
          color: palette.muted,
        }}
      >
        nikhilsnayak.dev
      </div>
    </div>,
    {
      ...socialImageSize,
      fonts: [
        { name: 'Geist', data: fontRegular, style: 'normal', weight: 400 },
        { name: 'JetBrains Mono', data: fontMono, style: 'normal', weight: 400 },
      ],
    },
  );
}
