import { useRef, useState } from 'react'
import { createInvoice } from '@/services/firebase/invoices'
import { Loader2, ArrowLeft, Printer } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReceiptA4 } from '@/features/create-quotation/components/receipt-a4'
import { format } from 'date-fns'

interface GenerateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  quotationDetails: any
}

export function GenerateInvoiceModal({
  isOpen,
  onClose,
  quotationDetails,
}: GenerateInvoiceModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
  
  // Generate invoice number and dates
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
  const today = new Date()
  const dueDate = new Date(today)
  dueDate.setDate(today.getDate() + 15) // Set due date to 15 days from now
  
  // Create modified quotation details to display as invoice
  const invoiceQuotationDetails = {
    quotation_number: invoiceNumber, // Use invoice number in place of quotation number
    order_date: format(today, 'dd/MM/yyyy'),
    order_time: new Date().toLocaleTimeString('en-IN'),
  }

  // Create invoice data object for saving to database
  const invoiceData = {
    ...quotationDetails,
    createdAt: today,
    status: 'unpaid',
    invoiceNumber: invoiceNumber,
    invoiceDate: today,
    dueDate: dueDate,
    quotationId: quotationDetails.id,
  }

  const handleShowPreview = () => {
    setIsPreviewMode(true)
  }

  const handleBackToDetails = () => {
    setIsPreviewMode(false)
  }

  const handlePrint = async () => {
    if (!printRef.current) return

    try {
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
                size: A4 auto;
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
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Invoice printed successfully',
      })
    } catch (error) {
      console.error('Printing failed:', error)
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to print invoice',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateInvoice = async () => {
    if (!quotationDetails) return

    try {
      setIsGenerating(true)

      // Save the invoice to Firestore
      await createInvoice(invoiceData)

      toast({
        title: 'Success',
        description: 'Invoice generated successfully',
      })
      onClose()
    } catch (error) {
      console.error('Error generating invoice:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate invoice',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {!isPreviewMode ? (
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice based on this quotation. This will not modify
              the original quotation.
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='space-y-2'>
              <h3 className='font-medium'>Quotation Details</h3>
              <p className='text-sm text-muted-foreground'>
                Customer: {quotationDetails?.customerDetails?.customerName || 'N/A'}
              </p>
              <p className='text-sm text-muted-foreground'>
                Total Amount: ₹{quotationDetails?.total?.toLocaleString() || '0'}
              </p>
              <p className='text-sm text-muted-foreground'>
                Items: {quotationDetails?.cart?.length || 0}
              </p>
            </div>
            
            <div className='mt-4 space-y-2'>
              <h3 className='font-medium'>Invoice Details</h3>
              <p className='text-sm text-muted-foreground'>
                Invoice Number: {invoiceNumber}
              </p>
              <p className='text-sm text-muted-foreground'>
                Date: {format(today, 'dd/MM/yyyy')}
              </p>
              <p className='text-sm text-muted-foreground'>
                Due Date: {format(dueDate, 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleShowPreview} disabled={isGenerating}>
              Preview Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className='flex max-h-[95vh] max-w-[1400px] flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <div className='flex justify-center'>
              <div className='origin-top scale-[0.85] transform'>
                <ReceiptA4
                  ref={printRef}
                  cart={quotationDetails.cart || []}
                  total={quotationDetails.total || 0}
                  customerDetails={quotationDetails.customerDetails || {}}
                  discountPercentage={quotationDetails.discountPercentage || 0}
                  quotationDetails={invoiceQuotationDetails}
                  isInvoice={true}
                />
              </div>
            </div>
          </div>

          <DialogFooter className='border-t px-6 py-4'>
            <Button 
              variant='outline' 
              onClick={handleBackToDetails}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
            <Button 
              variant='outline'
              onClick={handlePrint}
              className='flex items-center gap-2'
            >
              <Printer className='h-4 w-4' />
              Print
            </Button>
            <Button onClick={handleGenerateInvoice} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Generating...
                </>
              ) : (
                'Generate Invoice'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
