import { collection, getDocs } from 'firebase/firestore'
import { db } from '.'

export const getAllQuotations = async () => {
  const querySnapshot = await getDocs(collection(db, 'all-invoices'))
  const invoices = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    customerMobile: doc.data().customerMobile,
    customerName: doc.data().customerName,
    discountPercentage: doc.data().discountPercentage,
    invoice_number: doc.data().invoice_number,
    order_date: doc.data().order_date,
    order_time: doc.data().order_time,
    total: doc.data().total
  }))
  return invoices
}
