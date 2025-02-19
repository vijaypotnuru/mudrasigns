import {
  getSignBoardRequests,
  getSignBoardRequestsByRequestId,
} from '@/services/firebase/customer-requests'
import { Loader } from 'lucide-react'
import { useQueryData } from '@/hooks/use-query-data'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import RequestDetailsPage from './components/request-details-page'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import TasksProvider from './context/tasks-context'
import { tasks } from './data/tasks'

export default function RequestDetails({ requestId }: { requestId: string }) {
  const { data: requestDetails, isLoading } = useQueryData(
    ['requests-details', requestId],
    () => getSignBoardRequestsByRequestId(requestId)
  )
  console.log('requests-details', requestDetails)
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
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {/* <DataTable data={customerRequests || []} columns={columns} />
           */}
          {isLoading ? (
            <Loader />
          ) : (
            <RequestDetailsPage requestDetails={requestDetails} />
          )}
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
