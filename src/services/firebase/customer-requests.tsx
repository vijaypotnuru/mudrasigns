import { addDoc, setDoc, collection, getDocs } from 'firebase/firestore'
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
