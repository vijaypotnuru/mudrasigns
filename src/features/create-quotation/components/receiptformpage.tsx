import type React from 'react'
import { useState } from 'react'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ReceiptPreviewModal } from './receipt-preview-modal'

export default function ReceiptFormPage() {
  const { toast } = useToast()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    customerMobile: '',
  })

  const [discountPercentage, setDiscountPercentage] = useState(0)

  // We now keep a simpler cart state since GST is calculated differently
  const [cart, setCart] = useState([
    {
      name: '',
      brand: '',
      unit: '',
      quantity: 2,
      price: 15.5,
    },
  ])

  const [quotationDetails, setQuotationDetails] = useState({
    quotation_number: `QTN-${Date.now().toString().slice(-6)}`,
    order_date: new Date().toLocaleDateString('en-IN'),
    order_time: new Date().toLocaleTimeString('en-IN'),
  })

  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const handleAddItem = () => {
    setCart([
      ...cart,
      {
        name: '',
        brand: '',
        unit: '',
        quantity: 1,
        price: 0,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedCart = [...cart]
    updatedCart[index] = { ...updatedCart[index], [field]: value }
    setCart(updatedCart)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!customerDetails.customerName || !customerDetails.customerMobile) {
      toast({
        title: 'Error',
        description: 'Please fill in all customer details',
        variant: 'destructive',
      })
      return
    }

    if (
      cart.some((item) => !item.name || item.quantity <= 0 || item.price <= 0)
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all item details correctly',
        variant: 'destructive',
      })
      return
    }

    // Open the preview modal
    setIsPreviewOpen(true)
  }

  // Function to reset the form to initial values
  const resetForm = () => {
    // Reset customer details
    setCustomerDetails({
      customerName: '',
      customerMobile: '',
    })

    // Reset discount
    setDiscountPercentage(0)

    // Reset cart to a single empty item
    setCart([
      {
        name: '',
        brand: '',
        unit: '',
        quantity: 1,
        price: 0,
      },
    ])

    // Generate a new quotation number with the current timestamp
    setQuotationDetails({
      quotation_number: `QTN-${Date.now().toString().slice(-6)}`,
      order_date: new Date().toLocaleDateString('en-IN'),
      order_time: new Date().toLocaleTimeString('en-IN'),
    })
  }

  return (
    <div className='container mx-auto py-8'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Create Quotation</CardTitle>
          <CardDescription>
            Fill in the details to generate a new quotation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-6'>
              {/* Customer Details Section */}
              <div>
                <h3 className='text-lg font-medium'>Customer Details</h3>
                <div className='mt-3 grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='customerName'>Customer Name</Label>
                    <Input
                      id='customerName'
                      value={customerDetails.customerName}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          customerName: e.target.value,
                        })
                      }
                      placeholder='Enter customer name'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='customerMobile'>Mobile Number</Label>
                    <Input
                      id='customerMobile'
                      value={customerDetails.customerMobile}
                      onChange={(e) =>
                        setCustomerDetails({
                          ...customerDetails,
                          customerMobile: e.target.value,
                        })
                      }
                      placeholder='Enter mobile number'
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quotation Details Section */}
              <div>
                <h3 className='text-lg font-medium'>Quotation Details</h3>
                <div className='mt-3 grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='quotationNumber'>Quotation Number</Label>
                    <Input
                      id='quotationNumber'
                      value={quotationDetails.quotation_number}
                      onChange={(e) =>
                        setQuotationDetails({
                          ...quotationDetails,
                          quotation_number: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='orderDate'>Date (DD/MM/YYYY)</Label>
                    <Input
                      id='orderDate'
                      placeholder='DD/MM/YYYY'
                      value={quotationDetails.order_date}
                      onChange={(e) => {
                        const value = e.target.value
                        // Only allow digits and forward slashes
                        if (!/^[0-9/]*$/.test(value)) {
                          return
                        }

                        // Format as DD/MM/YYYY while typing
                        let formattedValue = value
                        if (value.length === 2 && !value.includes('/')) {
                          formattedValue = value + '/'
                        } else if (
                          value.length === 5 &&
                          value.split('/').length === 2
                        ) {
                          formattedValue = value + '/'
                        }

                        setQuotationDetails({
                          ...quotationDetails,
                          order_date: formattedValue,
                        })
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='orderTime'>Time</Label>
                    <Input
                      id='orderTime'
                      value={quotationDetails.order_time}
                      onChange={(e) =>
                        setQuotationDetails({
                          ...quotationDetails,
                          order_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cart Items Section */}
              <div>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium'>Cart Items</h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleAddItem}
                    className='flex items-center gap-1'
                  >
                    <PlusCircle className='h-4 w-4' /> Add Item
                  </Button>
                </div>

                <div className='mt-3 space-y-4'>
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-7'
                    >
                      <div className='space-y-1'>
                        <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                        <Input
                          id={`item-name-${index}`}
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(index, 'name', e.target.value)
                          }
                          placeholder='Item name'
                        />
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor={`item-brand-${index}`}>Brand</Label>
                        <Input
                          id={`item-brand-${index}`}
                          value={item.brand}
                          onChange={(e) =>
                            handleItemChange(index, 'brand', e.target.value)
                          }
                          placeholder='Brand'
                        />
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor={`item-unit-${index}`}>Pack</Label>
                        <Input
                          id={`item-unit-${index}`}
                          value={item.unit}
                          onChange={(e) =>
                            handleItemChange(index, 'unit', e.target.value)
                          }
                          placeholder='Unit'
                        />
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor={`item-quantity-${index}`}>
                          Quantity
                        </Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type='number'
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              'quantity',
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          min='1'
                        />
                      </div>
                      <div className='space-y-1'>
                        <Label htmlFor={`item-price-${index}`}>Price</Label>
                        <div className='flex items-center gap-2'>
                          <Input
                            id={`item-price-${index}`}
                            type='number'
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'price',
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            min='0'
                            step='0.01'
                          />
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            onClick={() => handleRemoveItem(index)}
                            className='flex-shrink-0'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Discount Section */}
              <div>
                <h3 className='text-lg font-medium'>Discount</h3>
                <div className='mt-3 w-full md:w-1/3'>
                  <div className='space-y-2'>
                    <Label htmlFor='discountPercentage'>
                      Discount Percentage (%)
                    </Label>
                    <Input
                      id='discountPercentage'
                      type='number'
                      value={discountPercentage}
                      onChange={(e) =>
                        setDiscountPercentage(
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      min='0'
                      max='100'
                      step='0.01'
                    />
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className='rounded-md bg-muted p-4'>
                <div className='flex justify-between text-lg font-medium'>
                  <span>Total Amount:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className='mt-1 flex justify-between text-sm'>
                    <span>Discount ({discountPercentage}%):</span>
                    <span>
                      -₹{((total * discountPercentage) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className='mt-2 flex justify-between text-lg font-bold'>
                  <span>Final Amount:</span>
                  <span>
                    ₹{(total - (total * discountPercentage) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className='flex justify-end'>
                <Button type='submit' size='lg'>
                  Generate Quotation
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {isPreviewOpen && (
        <ReceiptPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          cart={cart}
          total={total}
          customerDetails={customerDetails}
          discountPercentage={discountPercentage}
          quotationDetails={quotationDetails}
          resetForm={resetForm}
        />
      )}
    </div>
  )
}
