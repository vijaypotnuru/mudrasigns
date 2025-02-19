//@ts-nocheck
import { useState } from 'react'
import { Cross2Icon, DownloadIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'

import { priorities, statuses } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DateRangePicker } from './date-range-picker'
import { DateRange } from 'react-day-picker'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined })

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange) {
      console.log('dateRange', dateRange)
      const range = {
        from: dateRange.from,
        to: dateRange.to,
      }
      setDateRange(range as any)

      if (range.from && range.to) {
        console.log('range.from', Math.floor(range.from.getTime() / 1000))

        table
          .getColumn('addedon')
          ?.setFilterValue([
            Math.floor(range.from.getTime() / 1000),
            Math.floor((range.to.getTime() + 24 * 60 * 60 * 1000) / 1000),
          ])
      } else {
        table.getColumn('addedon')?.setFilterValue(undefined)
      }
    } else {
      setDateRange(undefined)
      table.getColumn('addedon')?.setFilterValue(undefined)
    }
  }

  const downloadCSV = () => {
    const headers = table
      .getVisibleFlatColumns()
      .map((column) => column.id)
      .filter(
        (id) => id !== 'select' && id !== 'actions' && id !== 'globalFilter'
      )

    const rows = table.getFilteredRowModel().rows

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row.getValue(header)
            const cellValue =
              typeof value === 'object' ? JSON.stringify(value) : value
            return `"${String(cellValue).replace(/"/g, '""')}"`
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'table-data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Filter Customer Requests...'
            value={
              (table.getColumn('globalFilter')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('globalFilter')
                ?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
          <div className='flex gap-x-2'>
            {table.getColumn('status') && (
              <DataTableFacetedFilter
                column={table.getColumn('status')}
                title='Status'
                options={statuses}
              />
            )}
            {table.getColumn('priority') && (
              <DataTableFacetedFilter
                column={table.getColumn('priority')}
                title='Priority'
                options={priorities}
              />
            )}
          </div>
          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                setDateRange({ from: undefined, to: undefined })
              }}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            className='h-8'
            onClick={downloadCSV}
          >
            <DownloadIcon className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <DateRangePicker onChange={handleDateRangeChange} value={dateRange} />
      </div>
    </div>
  )
}