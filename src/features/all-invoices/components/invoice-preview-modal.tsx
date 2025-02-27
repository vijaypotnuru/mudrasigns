import { useRef, useState } from 'react'
import { Printer, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReceiptA4 } from '@/features/create-quotation/components/receipt-a4'
import { useToast } from '@/hooks/use-toast'
import { EditInvoiceModal } from './edit-invoice-modal'

interface InvoicePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceDetails: any
  invoiceId: string
  onInvoiceUpdated?: () => void
}

export function InvoicePreviewModal({
  isOpen,
  onClose,
  invoiceDetails,
  invoiceId,
  onInvoiceUpdated,
}: InvoicePreviewModalProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
        title: "Success",
        description: "Invoice printed successfully",
      })
    } catch (error) {
      console.error('Printing failed:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to print invoice",
        variant: "destructive",
      })
    }
  }

  const handleEditComplete = () => {
    setIsEditModalOpen(false)
    
    // Call the parent's update handler if provided
    if (onInvoiceUpdated) {
      onInvoiceUpdated()
    }
    
    // Show success toast
    toast({
      title: "Success",
      description: "Invoice updated successfully",
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[95vh] max-w-[1400px] flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-center">
              <div className="origin-top scale-[0.85] transform">
                <ReceiptA4
                  ref={printRef}
                  cart={invoiceDetails.cart || []}
                  total={invoiceDetails.total || 0}
                  customerDetails={invoiceDetails.customerDetails || {}}
                  discountPercentage={invoiceDetails.discountPercentage || 0}
                  quotationDetails={invoiceDetails.quotationDetails || {}}
                  isInvoice={true}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Modal */}
      {isEditModalOpen && (
        <EditInvoiceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          invoiceDetails={invoiceDetails}
          invoiceId={invoiceId}
          onUpdated={handleEditComplete}
        />
      )}
    </>
  )
}
