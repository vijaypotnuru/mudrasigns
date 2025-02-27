import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '.'

export const getAllQuotations = async () => {
  const querySnapshot = await getDocs(collection(db, 'mudra_sign_all_quotations'))
  const quotations = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    customerMobile: doc.data().customerDetails.customerMobile,
    customerName: doc.data().customerDetails.customerName,
    discountPercentage: doc.data().discountPercentage,
    quotation_number: doc.data().quotationDetails.quotation_number,
    order_date: doc.data().quotationDetails.order_date,
    order_time: doc.data().quotationDetails.order_time,
    total: doc.data().total,
    createdAt: doc.data().createdAt
  }))
  return quotations
}

export const getQuotationById = async (quotationId: string) => {
  const docRef = doc(db, 'mudra_sign_all_quotations', quotationId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}