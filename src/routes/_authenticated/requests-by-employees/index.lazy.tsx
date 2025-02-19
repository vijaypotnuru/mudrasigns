import { createLazyFileRoute } from '@tanstack/react-router'
import RequestsByEmployees from '@/features/requests-by-employees'

export const Route = createLazyFileRoute(
  '/_authenticated/requests-by-employees/'
)({
  component: RequestsByEmployees,
})
