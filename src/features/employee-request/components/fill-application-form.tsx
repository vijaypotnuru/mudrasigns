import { useRef, useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2 } from 'lucide-react'
import Webcam from 'react-webcam'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
})

export default function FillApplicationForm() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const toast = useToast()
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
    return () => {
      // Cleanup any active streams on unmount
      if (webcamRef.current?.video) {
        const stream = webcamRef.current.video.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    console.log("See this ",values, file)
    toast({
      title: 'Application Submitted',
      description: 'Your application has been successfully submitted.',
    })
  }

  const captureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      setIsCameraOpen(false)
    }
  }

  return (
    <Card className='mx-auto w-full max-w-lg'>
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          Lied form
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
                  <FormLabel>Full Name</FormLabel>
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
            <FormItem>
              <FormLabel>Take Photo (Optional)</FormLabel>
              <FormControl>
                {isCameraOpen ? (
                  <div className='space-y-2'>
                    <Webcam
                      ref={webcamRef} 
                      audio={false}
                      screenshotFormat='image/jpeg'
                      videoConstraints={{
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                      }}
                      className='aspect-video w-full rounded-md'
                      onUserMediaError={() => {
                        toast({
                          title: 'Camera Error',
                          description: 'Failed to access camera',
                          variant: 'destructive',
                        })
                        setIsCameraOpen(false)
                      }}
                    />
                    <Button
                      type='button'
                      onClick={captureImage}
                      className='w-full'
                    >
                      <Camera className='mr-2 h-4 w-4' />
                      Capture Photo
                    </Button>
                  </div>
                ) : capturedImage ? (
                  <div className='space-y-2'>
                    <img
                      src={capturedImage}
                      alt='Captured'
                      className='aspect-square w-full rounded-md object-cover'
                    />
                    <Button
                      type='button'
                      onClick={() => {
                        setCapturedImage(null)
                        setIsCameraOpen(true)
                      }}
                      variant='outline'
                      className='w-full'
                    >
                      Retake Photo
                    </Button>
                  </div>
                ) : (
                  <Button
                    type='button'
                    onClick={() => setIsCameraOpen(true)}
                    variant='outline'
                    className='w-full'
                  >
                    <Camera className='mr-2 h-4 w-4' />
                    Open Camera
                  </Button>
                )}
              </FormControl>
              <FormDescription>
                You can capture an image using your device's camera.
              </FormDescription>
            </FormItem>
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
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
  )
}
