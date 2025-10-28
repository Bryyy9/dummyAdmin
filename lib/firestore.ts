import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc } from "firebase/firestore"
import app from "./firebase"

export const db = getFirestore(app)

// Collections
export const COLLECTIONS = {
  CULTURAL_ITEMS: "culturalItems",
  REGIONS: "regions",
  ANALYTICS: "analytics",
}

// Cultural Items CRUD
export const culturalItemsService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CULTURAL_ITEMS))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async getById(id: string) {
    const docRef = doc(db, COLLECTIONS.CULTURAL_ITEMS, id)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  },

  async create(data: any) {
    return await addDoc(collection(db, COLLECTIONS.CULTURAL_ITEMS), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  async update(id: string, data: any) {
    const docRef = doc(db, COLLECTIONS.CULTURAL_ITEMS, id)
    return await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTIONS.CULTURAL_ITEMS, id)
    return await deleteDoc(docRef)
  },
}

// Regions CRUD
export const regionsService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTIONS.REGIONS))
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async create(data: any) {
    return await addDoc(collection(db, COLLECTIONS.REGIONS), {
      ...data,
      createdAt: new Date().toISOString(),
    })
  },

  async update(id: string, data: any) {
    const docRef = doc(db, COLLECTIONS.REGIONS, id)
    return await updateDoc(docRef, data)
  },

  async delete(id: string) {
    const docRef = doc(db, COLLECTIONS.REGIONS, id)
    return await deleteDoc(docRef)
  },
}   