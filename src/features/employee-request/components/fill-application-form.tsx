//@ts-nocheck
import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { IconUpload, IconX } from '@tabler/icons-react'
import { submitApplication } from '@/services/firebase/application'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  phoneNumber: z.string().regex(/^\d{10}$/, {
    message: 'Phone number must be 10 digits.',
  }),
  companyName: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  request: z.enum(
    ['New Signboard', 'Partially Not Working', 'Fully Not Working'],
    {
      required_error: 'Please select a request type.',
    }
  ),
  isVerified: z.enum(['Option 1', 'Option 2', 'Option 3'], {
    required_error: 'Please select an option.',
  }),
})

export default function FillApplicationForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const toast = useToast()

  const mutation = useMutation({
    mutationFn: (
      values: z.infer<typeof formSchema> & { file: File | null }
    ) => {
      return submitApplication(values)
    },
    onSuccess: () => {
      form.reset()
      setFile(null)
      setPreview(null)
      setShowSuccessDialog(true)
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to submit application'
      setErrorMessage(message)
      setShowErrorDialog(true)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      companyName: '',
      address: '',
      request: undefined,
    },
  })

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      file,
    }
    mutation.mutate(payload)
  }

  return (
    <>
      <Card className='mx-auto w-full max-w-lg'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            Lead Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name / Shop Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Acme Inc.'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0000000000'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a 10-digit phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123 Main St, City, Country'
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='request'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select a request type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='New Signboard'>
                          New Signboard
                        </SelectItem>
                        <SelectItem value='Partially Not Working'>
                          Partially Not Working
                        </SelectItem>
                        <SelectItem value='Fully Not Working'>
                          Fully Not Working
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isVerified'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Option 1'>Option 1</SelectItem>
                        <SelectItem value='Option 2'>Option 2</SelectItem>
                        <SelectItem value='Option 3'>Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Take Photo (Optional)</FormLabel>
                <FormControl>
                  <div className='flex flex-col gap-2'>
                    <div
                      className='relative h-32 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                    >
                      {preview ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <img
                            src={preview}
                            alt='Preview'
                            className='h-full w-full rounded-lg object-contain p-2'
                          />
                        </div>
                      ) : (
                        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
                          <IconUpload className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                          <div className='flex flex-col items-center gap-1'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              <span className='font-semibold'>
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                              JPEG, JPG, PNG (MAX. 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                      <Input
                        id='file-upload'
                        type='file'
                        accept='image/jpeg, image/jpg, image/png'
                        className='hidden'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file && !file.type.startsWith('image/')) {
                            form.setError('root', {
                              type: 'manual',
                              message: 'Only image files are allowed',
                            })
                            return
                          }
                          setFile(file || null)
                        }}
                      />
                    </div>

                    {file && (
                      <div className='flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm'>
                        <span className='flex-1 truncate text-muted-foreground'>
                          {file.name}
                        </span>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-5 w-5 text-red-500 hover:text-red-600'
                          onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                          }}
                        >
                          <IconX className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
              <Button
                type='submit'
                className='w-full'
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-green-600'>Success!</DialogTitle>
            <DialogDescription>
              Your application has been successfully submitted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type='button' onClick={() => setShowSuccessDialog(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-destructive'>Error!</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type='button' onClick={() => setShowErrorDialog(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
