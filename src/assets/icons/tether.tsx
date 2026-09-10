export function TetherIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' {...props}>
      <rect width='32' height='32' rx='6' fill='#1c1d1f' />
      <path d='M12.5 19.5 19.5 12.5' stroke='#f95801' strokeWidth='3.2' strokeLinecap='round' />
      <circle cx='9.5' cy='22.5' r='4.4' fill='#f5f5f5' />
      <circle cx='22.5' cy='9.5' r='4.4' fill='#f5f5f5' />
    </svg>
  );
}
