import { useRef, useState } from 'react'
import { db, storage } from '@/services/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
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
  resetForm?: () => void
}

export function ReceiptPreviewModal({
  isOpen,
  onClose,
  cart,
  total,
  customerDetails,
  discountPercentage,
  quotationDetails,
  resetForm,
}: ReceiptPreviewModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Create quotation mutation
  const createQuotationMutation = useMutation({
    mutationFn: async () => {
      if (!printRef.current) return null;

      // Create an HTML blob of the quotation preview content
      const htmlContent = printRef.current.outerHTML;
      
      // Generate timestamp for the document
      const timestamp = Date.now();
      
      // Create a unique filename for storage
      const filename = `quotations/${customerDetails.customerName.replace(/\s+/g, '_')}_${timestamp}.html`;
      
      // Upload HTML to Firebase Storage
      const storageRef = ref(storage, filename);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const uploadTask = await uploadBytes(storageRef, htmlBlob);
      
      // Get download URL for the uploaded file
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Add metadata to Firestore
      const discountedTotal = total - (total * discountPercentage) / 100;
      const gstAmount = (discountedTotal * 18) / 100;
      const finalTotal = discountedTotal + gstAmount;
      
      const quotationData = {
        customerDetails,
        discountPercentage,
        discountedTotal,
        gstAmount,
        finalTotal,
        cart,
        quotationDetails,
        fileURL: downloadURL,
        createdAt: Date.now(),
      };
      
      const docRef = await addDoc(collection(db, 'mudra_sign_all_quotations'), quotationData);
      
      return { id: docRef.id, ...quotationData };
    },
    onSuccess: () => {
      // Invalidate the all-quotations query to refresh the quotations list
      queryClient.invalidateQueries({ queryKey: ['all-quotations'] });
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Quotation created and saved successfully',
      });
      
      // Reset the form if resetForm function is provided
      if (resetForm) {
        resetForm();
      }
      
      // Close the modal
      onClose();
    },
    onError: (error) => {
      console.error('Error creating quotation:', error);
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to create quotation',
        variant: 'destructive',
      });
    }
  });

  // Function to save the quotation document
  const saveQuotationDocument = () => {
    createQuotationMutation.mutate();
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
    } catch (error) {
      console.error('Printing failed:', error)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[95vh] max-w-[1400px] flex-col border-[hsl(var(--billing-card-border))] bg-[hsl(var(--billing-card-bg))] p-0'>
        <DialogHeader className='border-b border-[hsl(var(--billing-card-border))] px-6 py-4'>
          <DialogTitle className='text-[hsl(var(--billing-text-primary))]'>
            Quotation Preview
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto p-6'>
          <div className='flex justify-center'>
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
          </div>
        </div>

        <DialogFooter className='border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={saveQuotationDocument} 
            disabled={createQuotationMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {createQuotationMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save Quotation'
            )}
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
