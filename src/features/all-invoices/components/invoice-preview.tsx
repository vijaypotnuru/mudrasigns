import { forwardRef } from 'react'
import { ReceiptA4 } from '@/features/create-quotation/components/receipt-a4'

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
      <ReceiptA4
        ref={ref}
        cart={cart}
        total={total}
        customerDetails={customerDetails}
        discountPercentage={discountPercentage}
        quotationDetails={quotationDetails}
        isInvoice={true}
      />
    )
  }
)
