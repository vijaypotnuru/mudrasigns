import MyLeads from '@/features/myleads'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/myleads/')({
  component: MyLeads,
})


