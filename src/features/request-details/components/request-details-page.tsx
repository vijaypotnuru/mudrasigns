//@ts-nocheck
import { useState } from 'react'
import { format } from 'date-fns'
import {
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Clock,
  FileText,
  Building,
  Phone,
  MapPin,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface RequestDetails {
  id: string
  invoiceURL: string
  fullName: string
  createdAt: number
  reqId: string
  companyName: string
  phoneNumber: string
  fileURLs: string[]
  fileNames: string[]
  address: string
  request: string
  isVerified: string
  note?: string
  userId: string
}

export default function RequestDetailsPage({
  requestDetails,
}: {
  requestDetails: RequestDetails
}) {
  const [isImageOpen, setIsImageOpen] = useState(false)

  // In a real application, you would fetch this data from an API or database
  // const requestDetails: RequestDetails = {
  //   id: '00r5s5kpinbdMa6mk3Xl',
  //   invoiceURL: '',
  //   fullName: 'Prudvi',
  //   createdAt: 1737187221322,
  //   reqId: '00r5s5kpinbdMa6mk3Xl',
  //   companyName: 'Mudra',
  //   phoneNumber: '6303404240',
  //   fileURL:
  //     'https://firebasestorage.googleapis.com/v0/b/tapxtream-64eea.appspot.com/o/msreports%2F6303404240%2Fabe3dbbe-e169-498b-8a27-7d74f1a68015.jpeg?alt=media&token=4a018953-919b-4a98-97cf-865fac428303',
  //   fileName: 'abe3dbbe-e169-498b-8a27-7d74f1a68015.jpeg',
  //   address: 'Ramnagar',
  //   request: 'New Signboard',
  //   isVerified: 'Rejected',
  // }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 dark:from-gray-900 dark:to-gray-800'>
      <div className='container mx-auto px-4'>
        <div className='mb-4 flex items-center'></div>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <Card className='shadow-lg transition-shadow duration-300 hover:shadow-xl lg:col-span-2'>
            <CardContent className='p-6'>
              <div className='mb-6 flex items-start justify-between'>
                <div>
                  <h1 className='mb-2 text-3xl font-bold'>
                    {requestDetails.request}
                  </h1>
                  <p className='text-muted-foreground'>
                    Request ID: {requestDetails.reqId}
                  </p>
                </div>
                <Badge
                  variant={
                    requestDetails.isVerified === 'Rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className='text-sm'
                >
                  {requestDetails.isVerified === 'Rejected' && (
                    <AlertCircle className='mr-1 h-4 w-4' />
                  )}
                  {requestDetails.isVerified}
                </Badge>
              </div>

              <Separator className='my-6' />

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='flex items-center'>
                  <FileText className='mr-3 h-5 w-5 text-primary' />
                  <div>
                    <h3 className='font-semibold text-muted-foreground'>
                      Client Name
                    </h3>
                    <p>{requestDetails.fullName}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <Building className='mr-3 h-5 w-5 text-primary' />
                  <div>
                    <h3 className='font-semibold text-muted-foreground'>
                      Company Name
                    </h3>
                    <p>{requestDetails.companyName}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <Phone className='mr-3 h-5 w-5 text-primary' />
                  <div>
                    <h3 className='font-semibold text-muted-foreground'>
                      Phone Number
                    </h3>
                    <p>{requestDetails.phoneNumber}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <MapPin className='mr-3 h-5 w-5 text-primary' />
                  <div>
                    <h3 className='font-semibold text-muted-foreground'>
                      Address
                    </h3>
                    <p>{requestDetails.address}</p>
                  </div>
                </div>
                <div className='flex items-center'>
                  <MessageSquare className='mr-3 h-5 w-5 text-primary' />
                  <div className='w-full'>
                    <h3 className='font-semibold text-muted-foreground'>
                      Status Notes
                    </h3>
                    <textarea
                      readOnly
                      value={requestDetails.note || 'No notes available'}
                      className='mt-1 w-full rounded-md border p-2 text-sm text-muted-foreground'
                      rows={3}
                      cols={10}
                    />
                  </div>
                </div>
              </div>

              <Separator className='my-6' />

              <div>
                <h3 className='mb-4 font-semibold text-muted-foreground'>
                  Attached Files
                </h3>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {requestDetails.fileURLs?.map((url, index) => (
                    <Dialog
                      key={index}
                      open={isImageOpen}
                      onOpenChange={setIsImageOpen}
                    >
                      <DialogTrigger asChild>
                        <div className='relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-300 hover:opacity-90'>
                          <img
                            src={url || '/placeholder.svg'}
                            alt={
                              requestDetails.fileNames[index] || 'Uploaded file'
                            }
                            className='h-full w-full object-cover'
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className='max-w-4xl'>
                        <div className='relative aspect-video w-full'>
                          <img
                            src={url || '/placeholder.svg'}
                            alt={
                              requestDetails.fileNames[index] || 'Uploaded file'
                            }
                            className='object-contain'
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
                {requestDetails.fileNames?.length > 0 && (
                  <div className='mt-4 space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      File Names:
                    </p>
                    <ul className='list-disc space-y-1 pl-4 text-sm'>
                      {requestDetails.fileNames.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
