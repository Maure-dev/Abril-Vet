import { vi } from "vitest";

// Mock compartido del SDK de Firebase para tests (los services usan el SDK, no Axios).
//
// Uso en un archivo de test:
//   import { mockFirebase } from "@app/modules/main/tests/mockFirebase";
//   vi.mock("firebase/auth", () => mockFirebase.auth);
//   vi.mock("firebase/firestore", () => mockFirebase.firestore);
//   vi.mock("firebase/storage", () => mockFirebase.storage);
//
//   beforeEach(() => { vi.clearAllMocks(); });
export const mockFirebase = vi.hoisted(() => ({
  app: {
    initializeApp: vi.fn(() => ({})),
    getApps: vi.fn(() => []),
    getApp: vi.fn(() => ({}))
  },
  auth: {
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn(() => vi.fn()),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
    setPersistence: vi.fn(() => Promise.resolve()),
    browserLocalPersistence: {}
  },
  firestore: {
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    startAfter: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
    serverTimestamp: vi.fn(() => ({}))
  },
  storage: {
    getStorage: vi.fn(() => ({})),
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    uploadBytesResumable: vi.fn(),
    getDownloadURL: vi.fn(),
    deleteObject: vi.fn()
  }
}));
