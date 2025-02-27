import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '.'

export const getAllQuotations = async () => {
  const querySnapshot = await getDocs(collection(db, 'all-invoices'))
  const invoices = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    customerMobile: doc.data().customerDetails.customerMobile,
    customerName: doc.data().customerDetails.customerName,
    discountPercentage: doc.data().discountPercentage,
    invoice_number: doc.data().invoiceDetails.invoice_number,
    order_date: doc.data().invoiceDetails.order_date,
    order_time: doc.data().invoiceDetails.order_time,
    total: doc.data().total,
    createdAt: doc.data().createdAt
  }))
  return invoices
}

export const getQuotationById = async (quotationId: string) => {
  const docRef = doc(db, 'all-invoices', quotationId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}