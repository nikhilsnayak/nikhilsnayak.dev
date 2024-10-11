import { ComponentProps, ReactNode } from 'react';

export function List<
  T extends {
    id: string | number;
  },
>({
  items,
  children,
  ...rest
}: Omit<ComponentProps<'ul'>, 'children'> & {
  items: T[];
  children: (item: T) => ReactNode;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className='max-h-60 space-y-1 overflow-auto p-1' {...rest}>
      {items.map((item) => (
        <li key={item.id}>{children(item)}</li>
      ))}
    </ul>
  );
}
