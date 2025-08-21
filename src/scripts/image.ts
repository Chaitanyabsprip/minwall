interface ImageRecord {
  id: string;
  data: string | ArrayBuffer | null;
  timestamp: number;
}

type TransactionMode = "readonly" | "readwrite";

interface ImageStore {
  isCustomBackgroundSet: boolean;
  init(): void;
  onImageUpload(event: InputEvent): void;
  saveImageToIndexedDB(imageData: string | ArrayBuffer | null): void;
  resetBackground(): void;
  loadCustomBackgroundImage(): void;
}

// Constants
const DB_NAME = "backgroundImageDB";
const STORE_NAME = "images";
const BG_KEY = "userBackground";

// Utility functions
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db) return;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db) resolve(db);
      else reject(new Error("Failed to open database"));
    };

    request.onerror = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      reject(
        new Error(target.error?.message || "Unknown error opening database"),
      );
    };
  });
}

function executeTransaction(
  mode: TransactionMode,
  callback: (store: IDBObjectStore) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    openDatabase()
      .then((db) => {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          if (mode === "readonly") {
            resolve();
            return;
          }
          reject(new Error("Images store not found"));
          return;
        }

        const transaction = db.transaction([STORE_NAME], mode);
        const store = transaction.objectStore(STORE_NAME);

        try {
          callback(store);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
          return;
        }

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };

        transaction.onerror = () => {
          db.close();
          reject(new Error("Transaction failed"));
        };
      })
      .catch(reject);
  });
}

function getUserBackgroundImage(): Promise<ImageRecord | undefined> {
  return new Promise<ImageRecord | undefined>((resolve, reject) => {
    openDatabase()
      .then((db) => {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve(undefined);
          return;
        }

        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(BG_KEY);

        getRequest.onsuccess = () => {
          resolve(getRequest.result as ImageRecord | undefined);
        };

        getRequest.onerror = () => {
          resolve(undefined);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch(reject);
  });
}

function readImageFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        reject(new Error("Failed to read file"));
        return;
      }
      resolve(e.target.result as string);
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsDataURL(file);
  });
}

// Main export
const imageStore: ImageStore = {
  isCustomBackgroundSet: false,

  init(): void {
    openDatabase()
      .then((db) => {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          this.isCustomBackgroundSet = false;
          return;
        }

        const transaction = db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(BG_KEY);

        getRequest.onsuccess = () => {
          const imageRecord = getRequest.result as ImageRecord | undefined;
          this.isCustomBackgroundSet = !!(imageRecord && imageRecord.data);
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch(() => {
        this.isCustomBackgroundSet = false;
      });
  },

  onImageUpload(event: InputEvent): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    readImageFile(file)
      .then((imageData) => {
        this.saveImageToIndexedDB(imageData);
      })
      .catch(() => {
        alert("Failed to read image file");
      });
  },

  saveImageToIndexedDB(imageData: string | ArrayBuffer | null): void {
    if (!imageData) {
      alert("No image data to save");
      return;
    }

    executeTransaction("readwrite", (store) => {
      const imageRecord: ImageRecord = {
        id: BG_KEY,
        data: imageData,
        timestamp: Date.now(),
      };

      const saveRequest = store.put(imageRecord);

      saveRequest.onsuccess = () => {
        window.location.reload();
      };

      saveRequest.onerror = () => {
        alert("Failed to save background image");
      };
    }).catch((error) => {
      alert(
        `Error saving image: ${error instanceof Error ? error.message : String(error)}`,
      );
    });
  },

  resetBackground(): void {
    openDatabase()
      .then((db) => {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          alert("No custom background found");
          return;
        }

        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const deleteRequest = store.delete(BG_KEY);

        deleteRequest.onsuccess = () => {
          window.location.reload();
        };

        deleteRequest.onerror = () => {
          alert("Failed to reset background");
        };

        transaction.oncomplete = () => {
          db.close();
        };
      })
      .catch((error) => {
        alert(
          `Error resetting background: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
  },

  loadCustomBackgroundImage(): void {
    getUserBackgroundImage()
      .then((imageRecord) => {
        if (imageRecord?.data) {
          const customBg = document.getElementById(
            "custom-background",
          ) as HTMLImageElement | null;
          const defaultBg = document.getElementById("default-background");
          if (customBg && defaultBg) {
            customBg.src = imageRecord.data.toString();
            customBg.onload = () => {
              customBg.classList.remove("opacity-0");
              defaultBg.classList.add("opacity-0");
            };
          }
        }
      })
      .catch(() => {});
  },
};

export default imageStore;
