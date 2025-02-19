import { createLazyFileRoute } from '@tanstack/react-router'
import EmployeeRequest from '@/features/employee-request'

export const Route = createLazyFileRoute('/_authenticated/employee-request/')({
  component: EmployeeRequest,
})
