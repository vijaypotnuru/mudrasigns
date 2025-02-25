import Employeelead from '@/features/employeelead'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/employeeleads/$userId/'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  return <Employeelead userId={userId} />
}
