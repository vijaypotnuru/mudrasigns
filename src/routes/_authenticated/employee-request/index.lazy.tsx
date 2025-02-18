import EmployeeRequest from '@/features/employee-request'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/employee-request/')({
  component: EmployeeRequest,
})
