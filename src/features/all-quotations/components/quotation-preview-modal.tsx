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
import { EditQuotationModal } from './edit-quotation-modal'


interface QuotationPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  quotationDetails: any
  quotationId: string
  onQuotationUpdated?: () => void
}

export function QuotationPreviewModal({
  isOpen,
  onClose,
  quotationDetails,
  quotationId,
  onQuotationUpdated,
}: QuotationPreviewModalProps) {
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
        description: "Quotation printed successfully",
      })
    } catch (error) {
      console.error('Printing failed:', error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to print quotation",
        variant: "destructive",
      })
    }
  }

  // Handle successful quotation update
  const handleQuotationUpdated = () => {
    // Close the edit modal
    setIsEditModalOpen(false)
    
    // Call the parent's callback if provided
    if (onQuotationUpdated) {
      onQuotationUpdated()
    }
    
    // Show success toast
    toast({
      title: "Success",
      description: "Quotation updated successfully",
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[95vh] max-w-[1400px] flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Quotation Preview</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-center">
              <div className="origin-top scale-[0.85] transform">
                <ReceiptA4
                  ref={printRef}
                  cart={quotationDetails.cart || []}
                  total={quotationDetails.total || 0}
                  customerDetails={quotationDetails.customerDetails || {}}
                  discountPercentage={quotationDetails.discountPercentage || 0}
                  quotationDetails={quotationDetails.quotationDetails || {}}
                  isInvoice={false}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(true)} 
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Quotation
            </Button>
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quotation Modal */}
      {isEditModalOpen && (
        <EditQuotationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          quotationDetails={quotationDetails}
          quotationId={quotationId}
          onUpdated={handleQuotationUpdated}
        />
      )}
    </>
  )
}
