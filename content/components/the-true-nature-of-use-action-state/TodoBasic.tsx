'use client';

import { FormEvent, useCallback, useReducer } from 'react';

import { AddTodoForm } from './add-todo-form';
import { TodoItem, TodoList } from './todo-list';
import { todosReducer } from './todos-reducer';
import { Todo } from './types';

const initialTodos: Todo[] = [];

export default function TodoBasic() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  const handleAddTodo = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get('title')!.toString();
    dispatch({
      type: 'add',
      payload: {
        todo: {
          title,
          done: false,
        },
      },
    });
    form.reset();
  }, []);

  const handleStatusChange = useCallback((todo: Todo) => {
    return (done: boolean) => {
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
    };
  }, []);

  const handleDelete = useCallback((todo: Todo) => {
    return () => {
      dispatch({
        type: 'delete',
        payload: {
          id: todo.id,
        },
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
