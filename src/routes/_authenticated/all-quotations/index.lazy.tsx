import { createLazyFileRoute } from '@tanstack/react-router'
import AllQuotations from '@/features/all-quotations'

export const Route = createLazyFileRoute('/_authenticated/all-quotations/')({
  component: AllQuotations,
})
