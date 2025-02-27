//@ts-nocheck
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { labels, priorities, statuses } from '../data/data'
import { Task } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { StatusUpdateDialog } from './status-update-dialog'
import { QuotationActions } from './quotation-actions'

export const columns: ColumnDef<Task>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'slno',
    header: 'Sl.No',
    cell: ({ row }) => row.index + 1, // Assuming row.index gives the current row index
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Id' />
  //   ),
  //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const formatDate = (timestamp: any) => {
        const date = new Date(Number(timestamp))
        if (isNaN(date.getTime())) return 'Invalid Date'
        return date.toISOString().split('T')[0]
      }
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatDate(row.getValue('createdAt'))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('createdAt')
      const date = new Date(Number(timestamp))
      const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // hour: 'numeric',
        // minute: '2-digit',
        // second: '2-digit',
        // hour12: true,
      })

      return <div>{formattedDate}</div>
    },
    filterFn: (row, id, value: [number, number]) => {
      const cellValue = row.getValue(id) as number
      const [min, max] = value
      return cellValue >= min && cellValue <= max
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('customerName')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'customerMobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Mobile' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('customerMobile')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'discountPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount %' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('discountPercentage')}%</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <QuotationActions quotationId={row.original.id} />,
  },
  // {
  //   accessorKey: 'address',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Address' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-2'>
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //           {row.getValue('address')}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'request',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Request' />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex space-x-2'>
  //         <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
  //           {row.getValue('request')}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'fileURL',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='File' />
  //   ),
  //   cell: ({ row }) => {
  //     const fileURL = row.getValue('fileURL') as string
  //     const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  //     return (
  //       <div className='flex space-x-2'>
  //         {fileURL ? (
  //           <>
  //             <Avatar
  //               className='h-10 w-10 cursor-pointer rounded-md'
  //               onClick={() => setIsPreviewOpen(true)}
  //             >
  //               <AvatarImage src={fileURL} className='rounded-md' />
  //               <AvatarFallback>File</AvatarFallback>
  //             </Avatar>
  //             <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
  //               <DialogContent className='max-w-[95vw] px-1 sm:max-w-2xl'>
  //                 <div className='flex h-full items-center justify-center'>
  //                   <img
  //                     src={fileURL}
  //                     alt='Full preview'
  //                     className='h-auto max-h-[80vh] w-full rounded-md object-contain'
  //                   />
  //                 </div>
  //               </DialogContent>
  //             </Dialog>
  //           </>
  //         ) : (
  //           <span className='text-muted-foreground'>No file</span>
  //         )}
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'isVerified',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const [dialogOpen, setDialogOpen] = useState(false)
  //     const queryClient = useQueryClient()

  //     return (
  //       <div className='flex items-center gap-2'>
  //         <Button
  //           variant='ghost'
  //           className='h-8 px-2'
  //           onClick={() => setDialogOpen(true)}
  //         >
  //           {row.getValue('isVerified')}
  //         </Button>
  //         <StatusUpdateDialog
  //           open={dialogOpen}
  //           onOpenChange={setDialogOpen}
  //           currentStatus={row.getValue('isVerified')}
  //           requestId={row.original.id}
  //         />
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue('status')
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className='flex w-[100px] items-center'>
  //         {status.icon && (
  //           <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   accessorKey: 'priority',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Priority' />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue('priority')
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className='flex items-center'>
  //         {priority.icon && (
  //           <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} id={row.original.id}/>,
  // },
]
