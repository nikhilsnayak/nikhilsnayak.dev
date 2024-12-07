import { getDBConnection } from '.';
import type { Todo } from '../types';

export async function createTodo(todo: Todo): Promise<Todo> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.add(todo);

    request.onsuccess = () =>
      resolve({ ...todo, id: request.result as string });
    request.onerror = () => reject(new Error('Failed to create todo'));
  });
}

// Update an existing todo by ID
export async function updateTodo(id: string, updatedTodo: Todo): Promise<Todo> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.put({ ...updatedTodo, id });

    request.onsuccess = () => resolve({ ...updatedTodo, id });
    request.onerror = () => reject(new Error('Failed to update todo'));
  });
}

// Delete a todo by ID
export async function deleteTodo(id: string): Promise<string> {
  const db = await getDBConnection();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(new Error('Failed to delete todo'));
  });
}
