import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTasks } from '../context/tasks-context'
import { labels } from '../data/data'
import { taskSchema } from '../data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  id: string
}

export function DataTableRowActions<TData>({
  row,
  id,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)

  // const { setOpen, setCurrentRow } = useTasks()
  const navigate = useNavigate()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {/* <DropdownMenuItem
          onClick={() => {
            setCurrentRow(task)
            setOpen('update')
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
        <DropdownMenuItem disabled>Favorite</DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={() => navigate({ to: `/request-details/${id}` as '/' })}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem
          onClick={() => {
            setCurrentRow(task)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
