//@ts-nocheck
import { useState } from 'react'
import { getQuotationById } from '@/services/firebase/invoices'
import { Eye, FileText } from 'lucide-react'
import { useQueryData } from '@/hooks/use-query-data'
import { Button } from '@/components/ui/button'
import { GenerateInvoiceModal } from './generate-invoice-modal'
import { QuotationPreviewModal } from './quotation-preview-modal'

interface QuotationActionsProps {
  quotationId: string
}

export function QuotationActions({ quotationId }: QuotationActionsProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGenerateInvoiceOpen, setIsGenerateInvoiceOpen] = useState(false)

  const {
    data: quotationDetails,
    isLoading,
    refetch,
  } = useQueryData(['quotation-details', quotationId], () =>
    getQuotationById(quotationId)
  )

  // Function to refresh quotation data
  const handleQuotationUpdated = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className='flex space-x-2'>
        <Button variant='outline' size='sm' disabled>
          <Eye className='mr-2 h-4 w-4' />
          Preview
        </Button>
        <Button variant='outline' size='sm' disabled>
          <FileText className='mr-2 h-4 w-4' />
          Generate Invoice
        </Button>
      </div>
    )
  }

  return (
    <div className='flex space-x-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsPreviewOpen(true)}
      >
        <Eye className='mr-2 h-4 w-4' />
        Preview
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsGenerateInvoiceOpen(true)}
      >
        <FileText className='mr-2 h-4 w-4' />
        Generate Invoice
      </Button>

      {/* Preview Modal */}
      {quotationDetails && (
        <QuotationPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          quotationDetails={quotationDetails}
          quotationId={quotationId}
          onQuotationUpdated={handleQuotationUpdated}
        />
      )}

      {/* Generate Invoice Modal */}
      {quotationDetails && (
        <GenerateInvoiceModal
          isOpen={isGenerateInvoiceOpen}
          onClose={() => setIsGenerateInvoiceOpen(false)}
          quotationDetails={{
            ...quotationDetails,
            id: quotationId,
          }}
        />
      )}
    </div>
  )
}
