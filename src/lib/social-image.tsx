import fs from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

const fontRegular = await fs.readFile(
  path.join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Regular.ttf'),
);
const fontBold = await fs.readFile(
  path.join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Bold.ttf'),
);

export const socialImageSize = { width: 1200, height: 630 };

const grain = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" seed="7"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="1200" height="630" fill="#303238"/><rect width="1200" height="630" opacity="0.19" filter="url(#grain)"/></svg>',
).toString('base64')}`;

const squares = [
  { top: 65, left: 76, size: 90, opacity: 0.08 },
  { top: 38, left: 202, size: 56, opacity: 0.07 },
  { top: 114, left: 276, size: 23, opacity: 0.08 },
  { top: 166, left: 31, size: 32, opacity: 0.07 },
  { top: 410, left: 132, size: 31, opacity: 0.08 },
  { top: 439, left: 208, size: 95, opacity: 0.09 },
  { top: 491, left: 55, size: 55, opacity: 0.08 },
  { top: 552, left: 161, size: 38, opacity: 0.08 },
];

interface SocialImageProps {
  title: string;
  description?: string;
}

export function createSocialImage({ title, description }: SocialImageProps) {
  const displayTitle = title.length > 160 ? `${title.slice(0, 157)}...` : title;
  const fontSize =
    displayTitle.length <= 30
      ? 88
      : displayTitle.length <= 50
        ? 60
        : displayTitle.length <= 70
          ? 48
          : 42;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#303238',
        backgroundImage: `url("${grain}")`,
        color: '#ffffff',
        fontFamily: 'JetBrains Mono',
        position: 'relative',
      }}
    >
      {squares.map(({ size, ...square }) => (
        <div
          key={square.left}
          style={{
            position: 'absolute',
            ...square,
            width: size,
            height: size,
            background: '#ffffff',
          }}
        />
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '100px 112px 72px 150px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 32 }}>
            <div
              style={{
                fontSize,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                overflowWrap: 'break-word',
              }}
            >
              {displayTitle}
            </div>
            {description ? (
              <div style={{ fontSize: 32, lineHeight: 1.5, color: '#f5f5f5' }}>{description}</div>
            ) : null}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: 26,
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.02em',
          }}
        >
          nikhilsnayak.dev
        </div>
      </div>
    </div>,
    {
      ...socialImageSize,
      fonts: [
        { name: 'JetBrains Mono', data: fontRegular, style: 'normal', weight: 400 },
        { name: 'JetBrains Mono', data: fontBold, style: 'normal', weight: 700 },
      ],
    },
  );
}
