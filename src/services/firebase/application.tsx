import { addDoc, setDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '.'

export interface ApplicationData {
  fullName: string
  phoneNumber: string
  companyName: string
  address: string
  request: string
  files?: File[] | null
  userId: string
  note: string
}

export const submitApplication = async (
  data: ApplicationData
): Promise<string> => {
  let fileURLs: string[] = []
  let fileNames: string[] = []

  if (data.files && data.files.length > 0) {
    await Promise.all(
      data.files.map(async (file) => {
        const uniqueFileName = `${Date.now()}-${file.name}`
        const fileRef = ref(
          storage,
          `msreports/${data.phoneNumber}/${uniqueFileName}`
        )
        await uploadBytes(fileRef, file)
        const url = await getDownloadURL(fileRef)
        fileURLs.push(url)
        fileNames.push(uniqueFileName)
      })
    )
  }

  const unixTimestamp = Date.now()
  const formData = {
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    companyName: data.companyName,
    address: data.address,
    request: data.request,
    invoiceURL: '',
    fileURLs,
    fileNames: fileNames.length > 0 ? fileNames : null,
    isVerified: 'Not Verified',
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
