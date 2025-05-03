import type { FormEvent, PropsWithChildren } from 'react';

export function AddTodoForm({
  onSubmit,
}: Readonly<{
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}>) {
  return (
    <form onSubmit={onSubmit} className='mb-2 flex gap-2'>
      <input
        type='text'
        name='title'
        required
        minLength={3}
        placeholder='Add a todo'
        className='flex-1 rounded border px-2 py-1'
      />
      <button
        type='submit'
        className='min-w-10 shrink-0 rounded bg-blue-500 p-1 text-white'
      >
        +
      </button>
    </form>
  );
}

export function TodoItem({
  children,
  done = false,
  onStatusChange,
  onDelete,
}: Readonly<
  PropsWithChildren & {
    done?: boolean;
    onStatusChange?: (statue: boolean) => void;
    onDelete?: () => void;
  }
>) {
  return (
    <div className='flex items-center justify-between gap-2 border-b p-1'>
      <p
        className={`overflow-hidden text-ellipsis ${done ? 'line-through' : ''}`}
      >
        {children}
      </p>
      <div className='flex shrink-0 items-center gap-1'>
        <input
          type='checkbox'
          checked={done}
          className='size-5'
          onChange={(e) => onStatusChange?.(e.target.checked)}
        />
        <button
          className='flex size-5 items-center justify-center rounded bg-red-500 text-white'
          onClick={onDelete}
        >
          -
        </button>
      </div>
    </div>
  );
}
