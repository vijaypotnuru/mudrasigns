import { forwardRef } from 'react'
import { InvoiceA4 } from './invoice-a4'

interface InvoicePreviewProps {
  cart?: any[]
  total?: number
  customerDetails?: {
    customerName: string
    customerMobile: string
  }
  discountPercentage?: number
  quotationDetails?: {
    quotation_number: string
    order_date: string
    order_time: string
  }
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  (
    {
      cart = [],
      total = 0,
      customerDetails = {
        customerName: '',
        customerMobile: '',
      },
      discountPercentage = 0,
      quotationDetails,
    },
    ref
  ) => {
    return (
      <InvoiceA4
        ref={ref}
        cart={cart}
        total={total}
        customerDetails={customerDetails}
        discountPercentage={discountPercentage}
        invoiceDetails={{
          invoice_number: quotationDetails?.quotation_number || '',
          order_date: quotationDetails?.order_date || '',
          order_time: quotationDetails?.order_time || ''
        }}
      />
    )
  }
)
