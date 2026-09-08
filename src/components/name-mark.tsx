const letters = [
  ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
  ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  [],
  ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
];

export function NameMark({
  width = 404,
  color = 'currentColor',
  accentColor,
  className = 'h-auto w-full max-w-101',
}: {
  width?: number;
  color?: string;
  accentColor?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox='0 0 404 56'
      width={width}
      height={(width * 56) / 404}
      fill={color}
      aria-hidden='true'
      className={className}
    >
      {letters.flatMap((rows, letter) =>
        rows.flatMap((row, y) =>
          row
            .split('')
            .map((dot, x) =>
              dot === '1' ? (
                <circle
                  key={`${letter}-${y}-${x}`}
                  cx={letter * 48 + x * 8 + 4}
                  cy={y * 8 + 4}
                  r='2.8'
                />
              ) : null,
            ),
        ),
      )}
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
