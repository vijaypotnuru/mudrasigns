import { createLazyFileRoute } from '@tanstack/react-router'
import CustomerRequests from '@/features/customer-requests'

export const Route = createLazyFileRoute('/_authenticated/customer-requests/')({
  component: CustomerRequests,
})
