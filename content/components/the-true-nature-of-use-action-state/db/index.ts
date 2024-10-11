export const getDBConnection = (function () {
  let dbInstance: IDBDatabase | null = null;

  function initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (dbInstance) {
        return resolve(dbInstance);
      }

      const request = indexedDB.open('todosDB', 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('todos')) {
          db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event: Event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (event: Event) =>
        reject(
          'Error opening IndexedDB: ' + (event.target as IDBOpenDBRequest).error
        );
    });
  }

  return initDB;
})();
