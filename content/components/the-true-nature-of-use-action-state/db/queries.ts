import { getDBConnection } from '.';
import { Todo } from '../types';

export async function getTodos(): Promise<Todo[]> {
  const db = await getDBConnection();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('todos', 'readonly');
    const store = transaction.objectStore('todos');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Todo[]);
    request.onerror = () => reject('Failed to retrieve todos');
  });
}
