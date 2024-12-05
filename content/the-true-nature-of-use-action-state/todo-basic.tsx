'use client';

import { FormEvent, useReducer } from 'react';

import { List } from '~/components/list';

import { AddTodoForm, TodoItem } from './todo';
import { todosReducer } from './todos-reducer';
import { Todo } from './types';

const initialTodos: Todo[] = [];

export default function TodoBasic() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')!.toString();
    const id = crypto.randomUUID();
    const todo = { id, title, done: false };
    dispatch({ type: 'add', payload: { todo } });
    form.reset();
  };

  const getHandleStatusChange = (todo: Todo) => {
    return (done: boolean) => {
      const payload = { id: todo.id, updatedTodo: { ...todo, done } };
      dispatch({ type: 'edit', payload });
    };
  };

  const getHandleDelete = (todo: Todo) => {
    return () => {
      const payload = { id: todo.id };
      dispatch({ type: 'delete', payload });
    };
  };

  return (
    <section className='not-prose'>
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
