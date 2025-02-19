import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '.'

export const getSignBoardRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'sign_board_requests'))
  const requests = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((request) => !request.hasOwnProperty('userId'))
  return requests
}


export const getAllSignBoardRequests = async () => {
  const querySnapshot = await getDocs(collection(db, 'sign_board_requests'))
  const requests = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  return requests
}




export const getSignBoardRequestsByEmployee = async () => {
  const querySnapshot = await getDocs(collection(db, 'sign_board_requests'))
  const requests = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((request) => request.hasOwnProperty('userId'))
  return requests
}

export const getSignBoardRequestsByUserId = async (userId: string) => {
  const querySnapshot = await getDocs(collection(db, 'sign_board_requests'))
  const requests = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((request) => request.userId === userId)
  return requests
}

export const getSignBoardRequestsByRequestId = async (requestId: string) => {
  const request = await getDoc(doc(db, 'sign_board_requests', requestId))
  return request.data()
}

export const updateRequestStatus = async (
  id: string,
  newStatus: string
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'sign_board_requests', id), {
      isVerified: newStatus,
    })
  } catch (error) {
    console.error('Error updating status:', error)
    throw error
  }
}
