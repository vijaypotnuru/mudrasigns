import { createLazyFileRoute } from '@tanstack/react-router'
import CreateQuotation from '@/features/create-quotation'

export const Route = createLazyFileRoute('/_authenticated/create-quotation/')({
  component: CreateQuotation,
})
