//@ts-nocheck
import { forwardRef } from 'react'

interface ReceiptA4Props {
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
  isInvoice?: boolean
}

export const ReceiptA4 = forwardRef<HTMLDivElement, ReceiptA4Props>(
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
      isInvoice = false,
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

    // Updated GST calculation logic
    const calculateItemGST = (item: any) => {
      const itemPrice = item.price
      const itemQuantity = item.quantity
      const baseAmount = itemPrice * itemQuantity

      return {
        sgst: (baseAmount * (item.sgst || 0)) / 100,
        cgst: (baseAmount * (item.cgst || 0)) / 100,
      }
    }

    // Calculate GST components from individual items
    const gstSummary = validCart.reduce(
      (summary, item) => {
        const { sgst, cgst } = calculateItemGST(item)
        const itemTotal = item.quantity * item.price
        const itemBaseAmount =
          itemTotal / (1 + ((item.sgst || 0) + (item.cgst || 0)) / 100)

        return {
          baseAmount: summary.baseAmount + itemBaseAmount,
          sgstAmount: summary.sgstAmount + sgst,
          cgstAmount: summary.cgstAmount + cgst,
        }
      },
      { baseAmount: 0, sgstAmount: 0, cgstAmount: 0 }
    )

    const { baseAmount, sgstAmount, cgstAmount } = gstSummary

    const styles = {
      receipt: {
        color: 'black',
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        margin: '0 auto',
        boxSizing: 'border-box' as const,
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4',
        border: '2px solid #000',
        position: 'relative' as const,
      },
      header: {
        padding: '10px 20px',
      },
      headerTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
      },
      gstTitle: {
        flex: 1,
        textAlign: 'center' as const,
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '0',
      },
      originalCopy: {
        fontSize: '12px',
        fontWeight: 'bold',
      },
      companyName: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '5px',
        display: 'flex',
        alignItems: 'center',
      },
      companyDetails: {
        fontSize: '11px',
        lineHeight: '1.4',
      },
      buyerSection: {
        margin: '0 20px',
        border: '1px solid #000',
      },
      buyerHeader: {
        padding: '5px 10px',
        borderBottom: '1px solid #000',
        backgroundColor: '#f9f9f9',
      },
      buyerContent: {
        display: 'flex',
        padding: '10px',
      },
      buyerInfo: {
        flex: '1',
      },
      buyerName: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '24px',
        fontStyle: 'italic',
        marginBottom: '5px',
      },
      quotationInfo: {
        width: '250px',
      },
      infoTable: {
        width: '100%',
        borderSpacing: '0 3px',
        fontSize: '11px',
      },
      mainTable: {
        width: 'calc(100% - 40px)',
        margin: '20px',
        borderCollapse: 'collapse' as const,
        fontSize: '11px',
      },
      cell: {
        border: '1px solid #000',
        padding: '4px',
        textAlign: 'center' as const,
      },
      taxTable: {
        width: 'calc(100% - 40px)',
        margin: '20px',
        borderCollapse: 'collapse' as const,
        fontSize: '11px',
      },
      bottomSection: {
        margin: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
      },
      amountWords: {
        flex: '2',
        paddingRight: '20px',
      },
      taxSummary: {
        flex: '1',
        textAlign: 'right' as const,
      },
      footer: {
        margin: '20px',
        borderTop: '1px solid #000',
        paddingTop: '10px',
      },
      footerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
      },
      jurisdiction: {
        textAlign: 'center' as const,
        marginTop: '10px',
        borderTop: '1px solid #000',
        paddingTop: '10px',
      },
    }

    function numberToWords(num: number): string {
      const ones = [
        '',
        'One',
        'Two',
        'Three',
        'Four',
        'Five',
        'Six',
        'Seven',
        'Eight',
        'Nine',
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
      ]
      const tens = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety',
      ]

      function convertLessThanThousand(n: number): string {
        if (n === 0) return ''

        if (n < 20) return ones[n] + ' '

        if (n < 100) {
          return tens[Math.floor(n / 10)] + ' ' + ones[n % 10] + ' '
        }

        return (
          ones[Math.floor(n / 100)] +
          ' Hundred ' +
          convertLessThanThousand(n % 100)
        )
      }

      if (num === 0) return 'Zero'

      let result = ''

      // Handle Crores
      if (num >= 10000000) {
        result += convertLessThanThousand(Math.floor(num / 10000000)) + 'Crore '
        num %= 10000000
      }

      // Handle Lakhs
      if (num >= 100000) {
        result += convertLessThanThousand(Math.floor(num / 100000)) + 'Lakh '
        num %= 100000
      }

      // Handle Thousands
      if (num >= 1000) {
        result += convertLessThanThousand(Math.floor(num / 1000)) + 'Thousand '
        num %= 1000
      }

      // Handle remaining part
      result += convertLessThanThousand(num)

      return result.trim()
    }

    return (
      <div ref={ref} style={styles.receipt}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div style={{ width: '200px' }}></div>
            <div style={styles.gstTitle}>{isInvoice ? 'TAX INVOICE' : 'QUOTATION'}</div>
            <div style={styles.originalCopy}>ORIGINAL FOR RECIPIENT</div>
          </div>
          <div style={styles.companyName}>
            <img src='/images/main-logo.png' width={50} />
            Mudra Signs
          </div>
          <div style={styles.companyDetails}>
            Floor No.: Ground Floor
            <br />
            Building No./Flat No.: 519/3
            <br />
            Road/Street: Revathipathi street
            <br />
            Locality/Sub Locality: Tolusurupalle
            <br />
            City/Town/Village: Tekkali
            <br />
            District: Srikakulam
            <br />
            State: Andhra Pradesh
            <br />
            PIN Code: 532201
            <br />
            Contact No: 97050 64303, 7702 821 254
            <br />
          </div>
        </div>

        <div style={styles.buyerSection}>
          <div style={styles.buyerHeader}>
            Details for Buyer (Billed & Shipped To)
          </div>
          <div style={styles.buyerContent}>
            <div style={styles.buyerInfo}>
              <div style={styles.buyerName}>
                {customerDetails.customerName
                  ? customerDetails.customerName
                  : 'Walk-in Customer'}
              </div>
              <div style={{ marginTop: '5px', fontSize: '12px' }}>
                <div>
                  Mobile:{' '}
                  {customerDetails.customerMobile
                    ? customerDetails.customerMobile
                    : 'Not Provided'}
                </div>
                <div style={{ marginTop: '3px' }}>State: Andhra Pradesh</div>
                <div>State Code: 37</div>
              </div>
            </div>
            <div style={styles.quotationInfo}>
              <table style={styles.infoTable}>
                <tbody>
                  <tr>
                    <td>Quotation No</td>
                    <td>
                      :{' '}
                      {quotationDetails?.quotation_number ||
                        `QUO-${Date.now().toString().slice(-6)}`}
                    </td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>
                      :{' '}
                      {quotationDetails?.order_date ||
                        new Date().toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td>Time</td>
                    <td>
                      :{' '}
                      {quotationDetails?.order_time ||
                        new Date().toLocaleTimeString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <table style={styles.mainTable}>
          <thead>
            <tr>
              <th style={styles.cell}>Sr No</th>
              <th style={styles.cell}>Item </th>
              <th style={styles.cell}>Mfg By</th>
              <th style={styles.cell}>Batch No</th>
              <th style={styles.cell}>Expiry</th>
              <th style={styles.cell}>Pack</th>
              <th style={styles.cell}>Qty</th>
              <th style={styles.cell}>MRP</th>

              <th style={styles.cell}>CGST Amt</th>
              <th style={styles.cell}>SGST Amt</th>
              <th style={styles.cell}>Total</th>
            </tr>
          </thead>
          <tbody>
            {validCart.map((item, index) => {
              const { sgst, cgst } = calculateItemGST(item)
              return (
                <tr key={index}>
                  <td style={styles.cell}>{index + 1}</td>
                  <td style={styles.cell}>{item.name}</td>
                  <td style={styles.cell}>{item.brand || '-'}</td>
                  <td style={styles.cell}>{item.batch_number || '-'}</td>
                  <td style={styles.cell}>{item.expiry_date || '-'}</td>
                  <td style={styles.cell}>{item.unit || '-'}</td>
                  <td style={styles.cell}>{item.quantity}</td>
                  <td style={styles.cell}>₹{item.price.toFixed(2)}</td>

                  <td style={styles.cell}>₹{cgst.toFixed(2)}</td>
                  <td style={styles.cell}>₹{sgst.toFixed(2)}</td>
                  <td style={styles.cell}>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              )
            })}
            {/* Empty rows for additional entries */}
            {[...Array(7)].map((_, i) => (
              <tr key={`empty-${i}`}>
                {[...Array(11)].map((_, j) => (
                  <td key={`empty-${i}-${j}`} style={styles.cell}>
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table style={styles.taxTable}>
          <tbody>
            <tr>
              <td style={styles.cell}>Taxable Value</td>
              <td style={styles.cell}>CGST Amount</td>
              <td style={styles.cell}>SGST Amount</td>
              <td style={styles.cell}>Total Tax</td>
              <td style={styles.cell}>Round Off</td>
            </tr>
            <tr>
              <td style={styles.cell}>₹{baseAmount.toFixed(2)}</td>
              <td style={styles.cell}>₹{cgstAmount.toFixed(2)}</td>
              <td style={styles.cell}>₹{sgstAmount.toFixed(2)}</td>
              <td style={styles.cell}>
                ₹{(cgstAmount + sgstAmount).toFixed(2)}
              </td>
              <td style={styles.cell}>
                {(
                  Math.round(amountAfterDiscount) - amountAfterDiscount
                ).toFixed(2)}
              </td>
            </tr>
            {discountPercentage > 0 && (
              <tr>
                <td style={styles.cell} colSpan={4}>
                  Discount ({discountPercentage}%)
                </td>
                <td style={styles.cell}>-₹{discountAmount.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={styles.bottomSection}>
          <div style={styles.amountWords}>
            Amount In Words: INR{' '}
            {numberToWords(Math.round(amountAfterDiscount))} Only.
          </div>
          <div style={styles.taxSummary}>
            Quotation Total: ₹{amountAfterDiscount.toFixed(2)}
          </div>
        </div>

        <div style={styles.footer}>
          <div style={{ textAlign: 'center' as const }}>
            Once Goods Sold Can not be taken back
          </div>
          <div style={styles.footerContent}>
            <div>
              <div>Outstanding Details</div>
              <div>Previous Outstanding: ₹{amountAfterDiscount.toFixed(2)}</div>
              <div>Current Quotation: ₹{amountAfterDiscount.toFixed(2)}</div>
              <div>Total Outstanding: ₹{amountAfterDiscount.toFixed(2)}</div>
            </div>
            <div>
              For Mudra Signs
              <div style={{ marginTop: '40px' }}>Thank You Visit Again.</div>
            </div>
            <div>
              For Mudra Signs
              <div style={{ marginTop: '40px' }}>Authorized Signatory</div>
            </div>
          </div>
          <div style={styles.jurisdiction}>
            Subject to Srikakulam Jurisdiction
          </div>
        </div>
      </div>
    )
  }
)

ReceiptA4.displayName = 'ReceiptA4'
