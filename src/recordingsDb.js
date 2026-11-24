const DATABASE_NAME = "playbackr";
const STORE_NAME = "recordings";
const DATABASE_VERSION = 1;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "slot" });
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error ?? new Error("Could not open the recordings database"));
    };
  });

const runTransaction = async (mode, action) => {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    let transaction;

    try {
      transaction = database.transaction(STORE_NAME, mode);
      const request = action(transaction.objectStore(STORE_NAME));

      transaction.oncomplete = () => {
        database.close();
        resolve(request.result);
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error ?? new Error("The recordings transaction failed"));
      };
      transaction.onabort = () => {
        database.close();
        reject(transaction.error ?? new Error("The recordings transaction was aborted"));
      };
    } catch (error) {
      database.close();
      reject(error);
    }
  });
};

export const getRecording = (slot) =>
  runTransaction("readonly", (store) => store.get(slot));

export const saveRecording = (slot, blob) =>
  runTransaction("readwrite", (store) => store.put({ slot, blob }));

export const deleteRecording = (slot) =>
  runTransaction("readwrite", (store) => store.delete(slot));
