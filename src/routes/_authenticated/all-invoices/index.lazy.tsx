import { createLazyFileRoute } from '@tanstack/react-router'
import AllInvoices from '@/features/all-invoices'

export const Route = createLazyFileRoute('/_authenticated/all-invoices/')({
  component: AllInvoices,
})
