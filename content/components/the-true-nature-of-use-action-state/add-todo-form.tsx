import { FormEvent } from 'react';

export function AddTodoForm({
  onSubmit,
}: {
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className='flex gap-2 mb-2'>
      <input
        type='text'
        name='title'
        required
        minLength={3}
        placeholder='Add a todo'
        className='flex-1 px-2 py-1 border rounded'
      />
      <button
        type='submit'
        className='p-1 bg-blue-500 text-white rounded min-w-10 shrink-0'
      >
        +
      </button>
    </form>
  );
}
