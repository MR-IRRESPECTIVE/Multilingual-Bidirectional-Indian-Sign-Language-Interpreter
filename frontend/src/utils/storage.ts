export interface SampleMetadata {
  dataset_version: string;
  sample_id: string;
  /** Globally unique signer identifier. Format: "signer_<UUID>" for new signers. */
  signer_id: string;
  /** Human-readable display name. Always set for new samples; may be undefined in legacy exports. */
  signer_name?: string;
  sign_class: number;
  sign_label: string;
  capture_timestamp: string;
  frame_count: number;
  /** Feature vector length per frame.
   *  - 42: legacy one-hand representation (Hello/Yes pilot data — DO NOT MIGRATE)
   *  - 86: unified two-hand representation [left_42, right_42, left_present, right_present] */
  feature_dimension: number;
  /** Dataset generation tag.
   *  - "v2-86": 86-feature unified two-hand representation (all new collections)
   *  - Absent: legacy 42-feature samples (Hello/Yes pilot data) */
  feature_generation?: string;
  frames: number[][];
}

const DB_NAME = "ISL_Pilot_DB";
const STORE_NAME = "samples";
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "sample_id" });
      }
    };
  });
}

export async function saveSample(sample: SampleMetadata): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    // Use .add() instead of .put() to ensure idempotency. 
    // If the exact same sample_id is inserted twice, .add() will reject with a ConstraintError.
    const request = store.add(sample);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSamples(): Promise<SampleMetadata[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearSamples(): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
