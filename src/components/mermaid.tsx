import 'server-only';
import { renderMermaidSVG } from 'beautiful-mermaid';
import { useId } from 'react';

export function Mermaid({
  chart,
  title = 'Mermaid diagram',
  description,
}: {
  chart: string;
  title?: string;
  description?: string;
}) {
  const descriptionId = useId();
  const svg = renderMermaidSVG(chart, {
    bg: 'var(--background)',
    fg: 'var(--foreground)',
    muted: 'var(--muted-foreground)',
    accent: 'var(--foreground)',
    font: 'Geist',
    transparent: true,
    padding: 16,
    layerSpacing: 24,
  });

  return (
    <figure
      aria-label={title}
      aria-describedby={description ? descriptionId : undefined}
      className='not-prose border-border bg-muted/50 my-8 overflow-x-auto border p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full [&_text]:font-sans'
    >
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      {description && (
        <figcaption id={descriptionId} className='sr-only'>
          {description}
        </figcaption>
      )}
    </figure>
  );
}
