import { ComponentProps } from 'react';

import { Todo } from './types';

export function TodoList(props: ComponentProps<'ul'>) {
  return <ul className='max-h-60 space-y-1 overflow-auto p-1' {...props} />;
}

export function TodoItem({
  todo,
  onStatusChange,
  onDelete,
}: {
  todo: Todo;
  onStatusChange?: (statue: boolean) => void;
  onDelete?: () => void;
}) {
  return (
    <li
      key={todo.id}
      className='flex items-center justify-between gap-2 border-b p-1'
    >
      <span
        className={`overflow-hidden overflow-ellipsis ${todo.done ? 'line-through' : ''}`}
      >
        {todo.title}
      </span>
      <span className='flex shrink-0 items-center gap-1'>
        <input
          type='checkbox'
          checked={todo.done}
          className='size-5'
          onChange={(e) => onStatusChange?.(e.target.checked)}
        />
        <button
          className='flex size-5 items-center justify-center rounded bg-red-500 text-white'
          onClick={onDelete}
        >
          -
        </button>
      </span>
    </li>
  );
}
