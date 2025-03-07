import { collection, doc, getDoc, getDocs, addDoc, updateDoc } from 'firebase/firestore'
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


export const getAllInvoices = async () => {
  const querySnapshot = await getDocs(collection(db, 'mudra_sign_all_invoices'))
  const invoices = querySnapshot.docs.map((doc) => ({
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
  return invoices
}

export const getQuotationById = async (quotationId: string) => {
  const docRef = doc(db, 'mudra_sign_all_quotations', quotationId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const getInvoiceById = async (invoiceId: string) => {
  const docRef = doc(db, 'mudra_sign_all_invoices', invoiceId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const createInvoice = async (invoiceData: any) => {
  try {
    // Ensure createdAt uses Date.now()
    const dataWithTimestamp = {
      ...invoiceData,
      createdAt: Date.now()
    };
    
    const docRef = await addDoc(collection(db, 'mudra_sign_all_invoices'), dataWithTimestamp);
    return { id: docRef.id, ...dataWithTimestamp };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export const updateQuotation = async (quotationId: string, quotationData: any) => {
  try {
    const docRef = doc(db, 'mudra_sign_all_quotations', quotationId)
    await updateDoc(docRef, quotationData)
    return { id: quotationId, ...quotationData }
  } catch (error) {
    console.error('Error updating quotation:', error)
    throw error
  }
}

export const updateInvoice = async (invoiceId: string, invoiceData: any) => {
  try {
    const docRef = doc(db, 'mudra_sign_all_invoices', invoiceId)
    await updateDoc(docRef, invoiceData)
    return { id: invoiceId, ...invoiceData }
  } catch (error) {
    console.error('Error updating invoice:', error)
    throw error
  }
}