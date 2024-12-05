'use client';

import { FormEvent, startTransition, useActionState } from 'react';

import { List } from '~/components/list';

import { getTodos } from '../db/queries';
import { AddTodoForm, TodoItem } from '../todo';
import { todosReducerAsync } from '../todos-reducer';
import { Todo } from '../types';

const initialTodos = await getTodos();

export default function TodoAsync() {
  const [todos, dispatch] = useActionState(todosReducerAsync, initialTodos);

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')!.toString();
    const id = crypto.randomUUID();
    const todo = { id, title, done: false };
    startTransition(() => {
      dispatch({ type: 'add', payload: { todo } });
    });
    form.reset();
  };

  const getHandleStatusChange = (todo: Todo) => {
    return (done: boolean) => {
      const payload = { id: todo.id, updatedTodo: { ...todo, done } };
      startTransition(() => {
        dispatch({ type: 'edit', payload });
      });
    };
  };

  const getHandleDelete = (todo: Todo) => {
    return () => {
      const payload = { id: todo.id };
      startTransition(() => {
        dispatch({ type: 'delete', payload });
      });
    };
  };

  return (
    <section className='not-prose space-y-4'>
      <AddTodoForm onSubmit={handleAddTodo} />
      <List items={todos} className='max-h-60 space-y-1 overflow-auto p-1'>
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
