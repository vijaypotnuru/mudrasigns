//@ts-nocheck
import {
  getSignBoardRequests,
  getSignBoardRequestsByEmployee,
} from '@/services/firebase/customer-requests'
import { useQueryData } from '@/hooks/use-query-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'

import TasksProvider from './context/tasks-context'


export default function CustomerRequests() {
  const { data: employeeRequests, isLoading } = useQueryData(
    ['employee-requests'],
    getSignBoardRequestsByEmployee
  )
  console.log('employeeRequests', employeeRequests)
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Employee Requests
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your employee requests!
            </p>
          </div>
          {/* <TasksPrimaryButtons /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={employeeRequests || []} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
