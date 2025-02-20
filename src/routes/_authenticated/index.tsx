import { createFileRoute, redirect } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user.role !== 'admin') {
      throw redirect({
        to: '/employee-request',
        search: { redirect: location.href },
      })
    }
  },
  component: Dashboard,
})
