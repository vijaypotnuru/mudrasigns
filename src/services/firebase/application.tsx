import { addDoc, setDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '.'

export interface ApplicationData {
  fullName: string
  phoneNumber: string
  companyName: string
  address: string
  request: string
  file?: File | null
  userId: string
  note: string
}

export const submitApplication = async (
  data: ApplicationData
): Promise<string> => {
  let fileURL: string | null = null

  // Upload the file if provided
  if (data.file) {
    const fileRef = ref(
      storage,
      `msreports/${data.phoneNumber}/${data.file.name}`
    )
    await uploadBytes(fileRef, data.file)
    fileURL = await getDownloadURL(fileRef)
  }

  const unixTimestamp = Date.now()
  const formData = {
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    companyName: data.companyName,
    address: data.address,
    request: data.request,
    invoiceURL: '',
    fileURL,
    isVerified: 'Not Verified',
    fileName: data.file ? data.file.name : null,
    createdAt: unixTimestamp,
    userId: data.userId,
    note: data.note,
  }

  const docRef = await addDoc(collection(db, 'sign_board_requests'), formData)

  const updatedFormData = {
    ...formData,
    reqId: docRef.id,
  }

  await setDoc(docRef, updatedFormData, { merge: true })

  return docRef.id
}
