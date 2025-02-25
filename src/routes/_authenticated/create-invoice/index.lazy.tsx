import CreateInvoice from '@/features/create-invoice'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/create-invoice/')({
  component: CreateInvoice,
})

