import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRequestStatus } from '@/services/firebase/customer-requests'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus: string
  requestId: string
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  currentStatus,
  requestId,
}: Props) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateRequestStatus(requestId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-requests'] })

      onOpenChange(false)
      setIsConfirmOpen(false)
      toast({
        title: 'Status updated successfully',
      })
    },
    onError: (error) => {
      console.error('Status update failed:', error)
      toast({
        title: 'Update failed',
        description: 'Please try again',
        variant: 'destructive',
      })
    },
  })

  const handleUpdate = async () => {
    mutation.mutate(selectedStatus)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Current status: {currentStatus}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Not Verified'>Not Verified</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
                <SelectItem value='In Progress'>In Progress</SelectItem>
                <SelectItem value='Rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setIsConfirmOpen(true)}
              disabled={selectedStatus === currentStatus}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Confirm Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to change status to {selectedStatus}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
