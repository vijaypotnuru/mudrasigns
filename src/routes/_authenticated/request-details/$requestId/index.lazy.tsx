import { createLazyFileRoute } from '@tanstack/react-router'
import RequestDetails from '@/features/request-details'

export const Route = createLazyFileRoute(
  '/_authenticated/request-details/$requestId/'
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { requestId } = Route.useParams()
  return <RequestDetails requestId={requestId} />
}
