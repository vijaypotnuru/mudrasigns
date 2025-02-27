import { useRef, useState } from 'react'
import { db, storage } from '@/services/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Loader2 } from 'lucide-react'
// import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReceiptA4 } from './receipt-a4'

interface ReceiptPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  cart: any[]
  total: number
  customerDetails: {
    customerName: string
    customerMobile: string
  }
  discountPercentage: number
  quotationDetails?: {
    quotation_number: string
    order_date: string
    order_time: string
  }
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  cart,
  total,
  customerDetails,
  discountPercentage,
  quotationDetails,
}: ReceiptPreviewModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [format, setFormat] = useState<'thermal' | 'a4'>('a4')
  const printRef = useRef<HTMLDivElement>(null)

  // Function to upload the quotation content and save metadata in Firestore
  const saveQuotationDocument = async () => {
    if (!printRef.current) return

    // Create an HTML blob of the quotation preview content
    const quotationHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation</title>
        </head>
        <body>
          ${printRef.current.outerHTML}
        </body>
      </html>
    `
    const blob = new Blob([quotationHTML], { type: 'text/html' })
    const quotationFileName = `mudra_sign_quotation-${Date.now()}.html`
    const storageRef = ref(
      storage,
      `mudra_sign_quotations/${quotationFileName}`
    )

    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob)
    const downloadURL = await getDownloadURL(storageRef)

    // Save quotation metadata in Firestore's "all-quotations" collection
    await addDoc(collection(db, 'mudra_sign_all_quotations'), {
      quotationUrl: downloadURL,
      createdAt: Date.now(),
      total,
      customerDetails,
      discountPercentage,
      quotationDetails,
      cart,
    })
  }

  const handlePrint = async () => {
    if (!printRef.current) return

    try {
      setIsPrinting(true)

      // Create a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      // Add necessary styles
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @page {
                size: ${format === 'thermal' ? '80mm' : 'A4'} auto;
                margin: 0;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${printRef.current.outerHTML}
          </body>
        </html>
      `)

      // Wait for images (or other assets) to load
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Print and close the print window
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()

      // Optionally, show a success toast
      // toast.success('Receipt printed successfully')

      // Save the quotation document in Firebase Storage and Firestore
      await saveQuotationDocument()
    } catch (error) {
      console.error('Printing failed:', error)
      // Optionally, show an error toast
      // toast.error('Failed to print receipt')
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[95vh] max-w-[1400px] flex-col border-[hsl(var(--billing-card-border))] bg-[hsl(var(--billing-card-bg))] p-0'>
        <DialogHeader className='border-b border-[hsl(var(--billing-card-border))] px-6 py-4'>
          <DialogTitle className='text-[hsl(var(--billing-text-primary))]'>
            Receipt Preview
          </DialogTitle>
        </DialogHeader>

        <div className='flex items-center justify-center gap-4 border-b border-[hsl(var(--billing-card-border))] py-4'>
          <Button
            variant={format === 'thermal' ? 'default' : 'outline'}
            onClick={() => setFormat('thermal')}
            className={
              format === 'thermal'
                ? 'bg-[hsl(var(--billing-highlight))]'
                : 'border-[hsl(var(--billing-card-border))]'
            }
          >
            Thermal Receipt
          </Button>
          <Button
            variant={format === 'a4' ? 'default' : 'outline'}
            onClick={() => setFormat('a4')}
            className={
              format === 'a4'
                ? 'bg-[hsl(var(--billing-highlight))]'
                : 'border-[hsl(var(--billing-card-border))]'
            }
          >
            A4 Quotation
          </Button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          <div className='flex justify-center'>
            {format === 'thermal' ? (
              <div>Thermal Receipt Format</div>
            ) : (
              <div className='origin-top scale-[0.85] transform'>
                <ReceiptA4
                  ref={printRef}
                  cart={cart}
                  total={total}
                  customerDetails={customerDetails}
                  discountPercentage={discountPercentage}
                  quotationDetails={quotationDetails}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Printing...
              </>
            ) : (
              'Print'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
