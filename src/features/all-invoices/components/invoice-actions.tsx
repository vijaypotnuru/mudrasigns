import { useState } from 'react'
import { Eye } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { getInvoiceById } from '@/services/firebase/invoices'
import { InvoicePreviewModal } from './invoice-preview-modal'

interface InvoiceActionsProps {
  invoiceId: string
}

export function InvoiceActions({ invoiceId }: InvoiceActionsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { data: invoiceDetails, isLoading, refetch } = useQuery({
    queryKey: ['invoice-details', invoiceId],
    queryFn: () => getInvoiceById(invoiceId)
  })

  // Function to refresh invoice data
  const handleInvoiceUpdated = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" disabled>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
      </div>
    )
  }

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsPreviewOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Preview
      </Button>

      {/* Preview Modal */}
      {invoiceDetails && (
        <InvoicePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          invoiceDetails={invoiceDetails}
          invoiceId={invoiceId}
          onInvoiceUpdated={handleInvoiceUpdated}
        />
      )}
    </div>
  )
}
