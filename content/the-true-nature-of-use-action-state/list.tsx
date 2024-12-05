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
    <ul {...rest}>
      {items.map((item) => (
        <li key={item.id}>{children(item)}</li>
      ))}
    </ul>
  );
}
