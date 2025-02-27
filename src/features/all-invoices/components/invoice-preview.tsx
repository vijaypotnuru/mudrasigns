import { forwardRef } from 'react'

interface InvoicePreviewProps {
  cart?: any[]
  total?: number
  customerDetails?: {
    customerName: string
    customerMobile: string
  }
  discountPercentage?: number
  invoiceDetails?: {
    invoiceNumber: string
    date: string
    dueDate: string
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
      invoiceDetails,
    },
    ref
  ) => {
    // Validate cart items
    const validCart = cart.filter(
      (item) =>
        item &&
        typeof item.quantity === 'number' &&
        typeof item.price === 'number' &&
        item.name
    )

    const totalAmount = validCart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )

    const discountAmount = (totalAmount * discountPercentage) / 100
    const amountAfterDiscount = totalAmount - discountAmount

    // Calculate GST components from individual items
    const calculateItemGST = (item: any) => {
      const itemTotal = item.quantity * item.price
      const gstRate = (item.sgst || 0) + (item.cgst || 0)
      const totalWithoutGST = itemTotal / (1 + gstRate / 100)
      const sgstAmount = totalWithoutGST * ((item.sgst || 0) / 100)
      const cgstAmount = totalWithoutGST * ((item.cgst || 0) / 100)
      
      return {
        sgst: sgstAmount,
        cgst: cgstAmount,
      }
    }

    const gstSummary = validCart.reduce(
      (summary, item) => {
        const { sgst, cgst } = calculateItemGST(item)
        return {
          sgst: summary.sgst + sgst,
          cgst: summary.cgst + cgst,
        }
      },
      { sgst: 0, cgst: 0 }
    )

    const numberToWords = (num: number): string => {
      const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
      
      if (num === 0) return 'Zero'
      
      function convertLessThanOneThousand(num: number): string {
        if (num < 20) {
          return units[num]
        }
        
        const digit = num % 10
        const ten = Math.floor(num / 10) % 10
        const hundred = Math.floor(num / 100)
        
        let result = ''
        
        if (hundred > 0) {
          result += units[hundred] + ' Hundred'
          if (ten > 0 || digit > 0) {
            result += ' and '
          }
        }
        
        if (ten > 1) {
          result += tens[ten]
          if (digit > 0) {
            result += ' ' + units[digit]
          }
        } else if (ten === 1) {
          result += units[10 + digit]
        } else if (digit > 0) {
          result += units[digit]
        }
        
        return result
      }
      
      if (num < 1000) {
        return convertLessThanOneThousand(num)
      }
      
      let result = ''
      const crore = Math.floor(num / 10000000)
      const lakh = Math.floor((num % 10000000) / 100000)
      const thousand = Math.floor((num % 100000) / 1000)
      const remaining = num % 1000
      
      if (crore > 0) {
        result += convertLessThanOneThousand(crore) + ' Crore '
      }
      
      if (lakh > 0) {
        result += convertLessThanOneThousand(lakh) + ' Lakh '
      }
      
      if (thousand > 0) {
        result += convertLessThanOneThousand(thousand) + ' Thousand '
      }
      
      if (remaining > 0) {
        result += convertLessThanOneThousand(remaining)
      }
      
      return result
    }

    return (
      <div
        ref={ref}
        className="w-[210mm] min-h-[297mm] bg-white p-4 md:p-10 mx-auto"
        style={{
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-sm text-gray-600 mt-1">
              #{invoiceDetails?.invoiceNumber || 'INV-00000'}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold mb-1 text-gray-800">Mudra Signs</h2>
            <p className="text-sm text-gray-600">9-26-52, Near Chandana Brothers</p>
            <p className="text-sm text-gray-600">C.B.M Compound</p>
            <p className="text-sm text-gray-600">Visakhapatnam, AP 530003</p>
            <p className="text-sm text-gray-600">GSTIN: 37BMYPS3816Q1ZD</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-8">
          <div>
            <h3 className="text-gray-800 font-medium mb-2">Bill To:</h3>
            <p className="text-gray-700 font-medium">{customerDetails.customerName}</p>
            <p className="text-gray-600 text-sm">
              {customerDetails.customerMobile && `Phone: ${customerDetails.customerMobile}`}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="font-medium text-gray-600">Invoice Date:</span>
              <span className="ml-2 text-gray-700">{invoiceDetails?.date || new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Due Date:</span>
              <span className="ml-2 text-gray-700">{invoiceDetails?.dueDate || new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  #
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Item
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Brand
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Pack
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Qty
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Price
                </th>
                <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {validCart.map((item, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    {index + 1}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    {item.brand || '-'}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    {item.unit || '-'}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 border-b border-gray-200">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-800 text-right border-b border-gray-200">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span className="text-gray-800">₹{totalAmount.toFixed(2)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-600">
                  Discount ({discountPercentage}%):
                </span>
                <span className="text-gray-800">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">SGST:</span>
              <span className="text-gray-800">₹{gstSummary.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">CGST:</span>
              <span className="text-gray-800">₹{gstSummary.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-lg">
              <span className="text-gray-800">Total:</span>
              <span className="text-gray-800">₹{amountAfterDiscount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Amount in words: </span>
            {numberToWords(Math.round(amountAfterDiscount))} Rupees Only
          </p>
        </div>

        {/* Notes */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-gray-800 font-medium mb-2">Notes:</h3>
          <p className="text-sm text-gray-600">
            1. Payment is due within 15 days of invoice date.
          </p>
          <p className="text-sm text-gray-600">
            2. For any queries regarding this invoice, please contact us.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t">
          <div className="flex justify-between">
            <div className="text-sm text-gray-600">
              <p>Thank you for your business!</p>
              <p>Mudra Signs</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-6">Authorized Signatory</p>
              <div className="mt-4 border-t border-gray-300 pt-1">
                <p className="text-xs text-gray-500">E&OE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
