import { createLazyFileRoute } from '@tanstack/react-router'
import AllRequests from '@/features/allrequests'

export const Route = createLazyFileRoute('/_authenticated/allrequests/')({
  component: AllRequests,
})
