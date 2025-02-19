import { createLazyFileRoute } from '@tanstack/react-router'
import AllLeads from '@/features/allleads'

export const Route = createLazyFileRoute('/_authenticated/allLeads/')({
  component: AllLeads,
})
