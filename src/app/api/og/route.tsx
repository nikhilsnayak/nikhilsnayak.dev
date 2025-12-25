import { ImageResponse } from 'next/og';

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  background: '#1a1a1a',
  backgroundSecondary: '#0f0f0f',
  textPrimary: '#FFFFFF',
  textSecondary: '#a0a0a0',
  textTertiary: '#707070',
} as const;

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

function getFontSize(title: string): number {
  const length = title.length;
  if (length <= 30) return 72;
  if (length <= 50) return 60;
  if (length <= 70) return 48;
  return 42;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') ?? 'Blogs - Nikhil S';
  const truncatedTitle = truncateText(title, 80);
  const fontSize = getFontSize(truncatedTitle);

  const fontRegular = await fetch(
    new URL('./JetBrainsMono-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const fontBold = await fetch(
    new URL('./JetBrainsMono-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.background,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 200,
          width: 80,
          height: 80,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 120,
          width: 40,
          height: 40,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 400,
          width: 60,
          height: 60,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 450,
          left: 180,
          width: 50,
          height: 50,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 100,
          right: 300,
          width: 70,
          height: 70,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.22,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 280,
          right: 150,
          width: 35,
          height: 35,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          right: 250,
          width: 45,
          height: 45,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 200,
          right: 80,
          width: 55,
          height: 55,
          backgroundColor: COLORS.backgroundSecondary,
          opacity: 0.16,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '80px 100px',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: COLORS.textPrimary,
              lineHeight: 1.2,
              fontFamily: 'JetBrains Mono',
              marginBottom: 16,
              wordBreak: 'break-word',
            }}
          >
            {truncatedTitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: COLORS.textTertiary,
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.02em',
            }}
          >
            nikhilsnayak.dev
          </div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'JetBrains Mono',
          data: fontBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
