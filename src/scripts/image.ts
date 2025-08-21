interface ImageRecord {
  id: string;
  data: string | ArrayBuffer | null;
  blurData?: string | ArrayBuffer | null;
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
  getBlurredImageUrl(): Promise<string | null>;
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

function createLowResBlurredImage(imageData: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create a small canvas for the low-res version
        const canvas = document.createElement("canvas");
        // Target an extremely low resolution for better compression
        const MAX_SIZE = 12; // Reduced from 20 to minimize size
        const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
        canvas.width = Math.floor(img.width * scale);
        canvas.height = Math.floor(img.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw the image at a lower resolution
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Apply Gaussian-like blur effect
        // This is a simple implementation that approximates a Gaussian blur
        const blurAmount = 2;
        for (let i = 0; i < blurAmount; i++) {
          ctx.globalAlpha = 0.5;
          // Horizontal blur
          ctx.drawImage(
            canvas,
            1,
            0,
            canvas.width - 2,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
          // Vertical blur
          ctx.drawImage(
            canvas,
            0,
            1,
            canvas.width,
            canvas.height - 2,
            0,
            0,
            canvas.width,
            canvas.height,
          );
          ctx.globalAlpha = 1.0;
        }

        // Check WebP support
        const isWebPSupported =
          canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;

        // Convert to data URL with optimal format
        let blurredDataUrl;
        if (isWebPSupported) {
          // WebP offers better compression for the same visual quality
          blurredDataUrl = canvas.toDataURL("image/webp", 0.4);
        } else {
          // Fallback to JPEG with lower quality since it's just a placeholder
          blurredDataUrl = canvas.toDataURL("image/jpeg", 0.3);
        }

        resolve(blurredDataUrl);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for processing"));
    };

    img.src = imageData;
  });
}

// Main export
const imageStore: ImageStore = {
  isCustomBackgroundSet: false,

  getBlurredImageUrl(): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      getUserBackgroundImage()
        .then((imageRecord) => {
          if (imageRecord?.blurData) {
            resolve(imageRecord.blurData.toString());
          } else {
            resolve(null);
          }
        })
        .catch(() => {
          resolve(null);
        });
    });
  },

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
    if (!imageData || typeof imageData !== "string") {
      alert("No valid image data to save");
      return;
    }

    // Create a low-resolution blurred version
    createLowResBlurredImage(imageData)
      .then((blurData) => {
        executeTransaction("readwrite", (store) => {
          const imageRecord: ImageRecord = {
            id: BG_KEY,
            data: imageData,
            blurData: blurData,
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
      })
      .catch((error) => {
        alert(
          `Error creating blurred image: ${error instanceof Error ? error.message : String(error)}`,
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
            // If we have blurred data, use it for the background first
            if (imageRecord.blurData) {
              // Set the blurred image as background
              const container = customBg.parentElement;
              if (container) {
                container.style.backgroundImage = `url('${imageRecord.blurData.toString()}')`;
                container.style.backgroundSize = "cover";
                container.style.backgroundPosition = "center";
              }
            }

            // Load the high-res image
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
