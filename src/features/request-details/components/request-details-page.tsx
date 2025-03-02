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
  Globe,
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
  location?: {
    latitude: number
    longitude: number
    timestamp: number
  } | null
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

              {requestDetails.location &&
              requestDetails.location.latitude &&
              requestDetails.location.longitude ? (
                <div className='mb-6'>
                  <h3 className='mb-4 font-semibold text-muted-foreground'>
                    Upload Location
                  </h3>
                  <div className='flex flex-col gap-4'>
                    <div className='flex items-center'>
                      <Globe className='mr-3 h-5 w-5 text-primary' />
                      <div>
                        <h3 className='font-semibold text-muted-foreground'>
                          Coordinates
                        </h3>
                        <p>
                          {requestDetails.location.latitude.toFixed(6)},{' '}
                          {requestDetails.location.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>

                    <div className='h-[200px] w-full overflow-hidden rounded-md border'>
                      {/* Wrap in an error boundary or handle loading states */}
                      <iframe
                        title='Location Map'
                        width='100%'
                        height='100%'
                        frameBorder='0'
                        src={`https://maps.google.com/maps?q=${requestDetails.location.latitude},${requestDetails.location.longitude}&z=15&output=embed`}
                        allowFullScreen
                        onLoad={() => console.log('Map loaded successfully')}
                        onError={(e) => console.error('Error loading map:', e)}
                      ></iframe>
                    </div>

                    <div>
                      <a
                        href={`https://maps.google.com/?q=${requestDetails.location.latitude},${requestDetails.location.longitude}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90'
                      >
                        <MapPin className='mr-2 h-4 w-4' />
                        View on Google Maps
                      </a>
                    </div>

                    <div className='text-xs text-muted-foreground'>
                      Captured on:{' '}
                      {new Date(
                        requestDetails.location.timestamp
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : null}

              <div>
                <h3 className='mb-4 font-semibold text-muted-foreground'>
                  Attached Files
                </h3>
                <div className='grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-3 lg:grid-cols-4'>
                  {requestDetails.fileURLs?.map((url, index) => {
                    const [isOpen, setIsOpen] = useState(false)
                    return (
                      <Dialog
                        key={index}
                        open={isOpen}
                        onOpenChange={setIsOpen}
                      >
                        <DialogTrigger asChild>
                          <div className='relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-300 max-md:active:opacity-90'>
                            <img
                              src={url || '/placeholder.svg'}
                              alt={
                                requestDetails.fileNames[index] ||
                                'Uploaded file'
                              }
                              className='h-full w-full touch-none object-cover'
                              style={{ transform: 'translateZ(0)' }}
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className='h-screen max-w-[100vw] rounded-none border-none p-0 sm:max-w-[95vw] sm:rounded-lg sm:border'>
                          <div className='flex h-full items-center justify-center bg-black/90'>
                            <img
                              src={url || '/placeholder.svg'}
                              alt={
                                requestDetails.fileNames[index] ||
                                'Uploaded file'
                              }
                              className='max-h-[90vh] w-auto object-contain'
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )
                  })}
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
