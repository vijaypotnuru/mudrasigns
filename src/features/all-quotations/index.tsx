//@ts-nocheck
import { useQuery } from '@tanstack/react-query'
import {
  getAllQuotations,
  getQuotationById,
} from '@/services/firebase/invoices'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { TasksDialogs } from './components/tasks-dialogs'
import TasksProvider from './context/tasks-context'

export default function AllQuotations() {
  const { data: allQuotations, isLoading } = useQuery({
    queryKey: ['all-quotations'],
    queryFn: getAllQuotations,
  })
  console.log('allQuotations', allQuotations)
  // const { data: quotationDetails, isLoading: quotationDetailsLoading } =
  //   useQuery({
  //     queryKey: ['quotations-details', 'duwVo90gNShO87zQHhlk'],
  //     queryFn: () => getQuotationById('duwVo90gNShO87zQHhlk')
  //   })
  // console.log('quotationDetails', quotationDetails)
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
              All Quotations
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your quotations!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={allQuotations || []} columns={columns} />
        </div>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
