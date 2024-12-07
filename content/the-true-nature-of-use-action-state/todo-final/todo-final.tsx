'use client';

import {
  startTransition,
  useActionState,
  useOptimistic,
  type FormEvent,
} from 'react';

import { List } from '~/components/list';

import { getTodos } from '../db/queries';
import { AddTodoForm, TodoItem } from '../todo';
import { todosReducerFinal } from '../todos-reducer';
import type { Todo } from '../types';

const initialTodos = await getTodos();

export default function TodoFinal() {
  const [todos, dispatch, isPending] = useActionState(
    todosReducerFinal,
    initialTodos
  );
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos);

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')!.toString();
    const id = crypto.randomUUID();
    const todo = { id, title, done: false };
    startTransition(() => {
      setOptimisticTodos((prev) => [todo, ...prev]);
      dispatch({ type: 'add', payload: { todo } });
    });
    form.reset();
  };

  const getHandleStatusChange = (todo: Todo) => {
    return (done: boolean) => {
      const payload = { id: todo.id, updatedTodo: { ...todo, done } };
      startTransition(() => {
        setOptimisticTodos((prev) =>
          prev.map((item) => (item.id === todo.id ? { ...item, done } : item))
        );
        dispatch({ type: 'edit', payload });
      });
    };
  };

  const getHandleDelete = (todo: Todo) => {
    return () => {
      const payload = { id: todo.id };
      startTransition(() => {
        setOptimisticTodos((prev) =>
          prev.filter((item) => item.id !== todo.id)
        );
        dispatch({ type: 'delete', payload });
      });
    };
  };

  return (
    <section className='not-prose mt-8 space-y-4'>
      <p className={isPending ? 'visible' : 'invisible'}>
        Updates in progress...
      </p>
      <AddTodoForm onSubmit={handleAddTodo} />
      <List
        items={optimisticTodos}
        className='max-h-60 space-y-1 overflow-auto p-1'
      >
        {(todo) => (
          <TodoItem
            done={todo.done}
            onStatusChange={getHandleStatusChange(todo)}
            onDelete={getHandleDelete(todo)}
          >
            {todo.title}
          </TodoItem>
        )}
      </List>
    </section>
  );
}
