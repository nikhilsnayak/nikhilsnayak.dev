'use client';

import { FormEvent, startTransition, useActionState, useCallback } from 'react';

import { AddTodoForm } from '../add-todo-form';
import { getTodos } from '../db/queries';
import { TodoItem, TodoList } from '../todo-list';
import { todosReducerAsync } from '../todos-reducer';
import { Todo } from '../types';

const initialTodos = await getTodos();

export default function TodoAsync() {
  const [todos, dispatch] = useActionState(todosReducerAsync, initialTodos);

  const handleAddTodo = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')!.toString();
    startTransition(() => {
      dispatch({
        type: 'add',
        payload: {
          todo: {
            title,
            done: false,
          },
        },
      });
    });
    form.reset();
  }, []);

  const handleStatusChange = useCallback((todo: Todo) => {
    return (done: boolean) => {
      startTransition(() => {
        dispatch({
          type: 'edit',
          payload: {
            id: todo.id,
            updatedTodo: {
              ...todo,
              done,
            },
          },
        });
      });
    };
  }, []);

  const handleDelete = useCallback((todo: Todo) => {
    return () => {
      startTransition(() => {
        dispatch({
          type: 'delete',
          payload: {
            id: todo.id,
          },
        });
      });
    };
  }, []);

  return (
    <section className='not-prose'>
      <AddTodoForm onSubmit={handleAddTodo} />
      <TodoList>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onStatusChange={handleStatusChange(todo)}
            onDelete={handleDelete(todo)}
          />
        ))}
      </TodoList>
    </section>
  );
}
