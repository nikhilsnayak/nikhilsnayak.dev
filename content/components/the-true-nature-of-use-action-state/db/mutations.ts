import { getDBConnection } from '.';
import { Todo } from '../types';

export async function createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.add(todo);

    request.onsuccess = () =>
      resolve({ ...todo, id: request.result as number });
    request.onerror = () => reject('Failed to create todo');
  });
}

// Update an existing todo by ID
export async function updateTodo(
  id: number,
  updatedTodo: Omit<Todo, 'id'>
): Promise<Todo> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.put({ ...updatedTodo, id });

    request.onsuccess = () => resolve({ ...updatedTodo, id });
    request.onerror = () => reject('Failed to update todo');
  });
}

// Delete a todo by ID
export async function deleteTodo(id: number): Promise<number> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject('Failed to delete todo');
  });
}
