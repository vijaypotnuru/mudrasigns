import { useState, useEffect } from 'react'
import { Loader2, PlusCircle, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { updateQuotation } from '@/services/firebase/invoices'
import { useToast } from '@/hooks/use-toast'

interface EditQuotationModalProps {
  isOpen: boolean
  onClose: () => void
  quotationDetails: any
  quotationId: string
  onUpdated: () => void
}

export function EditQuotationModal({
  isOpen,
  onClose,
  quotationDetails,
  quotationId,
  onUpdated,
}: EditQuotationModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [cart, setCart] = useState<any[]>([])
  const [quotationInfo, setQuotationInfo] = useState({
    quotation_number: '',
    order_date: '',
    order_time: '',
  })

  // Initialize form with existing quotation data
  useEffect(() => {
    if (quotationDetails) {
      setCustomerName(quotationDetails.customerDetails.customerName || '')
      setCustomerMobile(quotationDetails.customerDetails.customerMobile || '')
      setDiscountPercentage(quotationDetails.discountPercentage || 0)
      setCart(quotationDetails.cart || [])
      setQuotationInfo(quotationDetails.quotationDetails || {
        quotation_number: '',
        order_date: '',
        order_time: '',
      })
    }
  }, [quotationDetails])

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
    const discount = (subtotal * discountPercentage) / 100
    return subtotal - discount
  }

  // Update quotation mutation
  const updateQuotationMutation = useMutation({
    mutationFn: async (updatedQuotationData: any) => {
      return await updateQuotation(quotationId, updatedQuotationData);
    },
    onSuccess: () => {
      // Invalidate the all-quotations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['all-quotations'] });
      
      // Invalidate the specific quotation query to refresh its details
      queryClient.invalidateQueries({ queryKey: ['quotation-details', quotationId] });
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Quotation updated successfully',
      });
      
      // Close modal and notify parent component
      if (onUpdated) {
        onUpdated();
      } else {
        onClose();
      }
    },
    onError: (error) => {
      console.error('Error updating quotation:', error);
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to update quotation',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = async () => {
    if (!customerName || !customerMobile) {
      toast({
        title: 'Error',
        description: 'Please fill in all customer details',
        variant: 'destructive',
      })
      return
    }

    if (cart.some((item) => !item.name || item.quantity <= 0 || item.price <= 0)) {
      toast({
        title: 'Error',
        description: 'Please fill in all item details correctly',
        variant: 'destructive',
      })
      return
    }

    try {
      // Create updated quotation data
      const updatedQuotationData = {
        ...quotationDetails,
        customerDetails: {
          customerName,
          customerMobile,
        },
        discountPercentage,
        cart,
        quotationDetails: quotationInfo,
        total: calculateTotal(),
        updatedAt: Date.now(),
      }

      // Execute the mutation
      updateQuotationMutation.mutate(updatedQuotationData);
    } catch (error) {
      console.error('Error updating quotation:', error)
      toast({
        title: 'Error',
        description: 'Failed to update quotation',
        variant: 'destructive',
      })
    }
  }

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedCart = [...cart]
    updatedCart[index] = {
      ...updatedCart[index],
      [field]: value,
    }
    setCart(updatedCart)
  }

  // Add new item
  const handleAddItem = () => {
    setCart([
      ...cart,
      {
        name: '',
        brand: '',
        unit: '',
        quantity: 1,
        price: 0,
        sgst: 6,
        cgst: 6,
      },
    ])
  }

  // Remove item
  const handleRemoveItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-[1200px] flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Quotation</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Customer Details Section */}
            <div>
              <h3 className="text-lg font-medium">Customer Details</h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(e.target.value)
                    }
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerMobile">Mobile Number</Label>
                  <Input
                    id="customerMobile"
                    value={customerMobile}
                    onChange={(e) =>
                      setCustomerMobile(e.target.value)
                    }
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Quotation Details Section */}
            <div>
              <h3 className="text-lg font-medium">Quotation Details</h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="quotationNumber">Quotation Number</Label>
                  <Input
                    id="quotationNumber"
                    value={quotationInfo.quotation_number}
                    onChange={(e) =>
                      setQuotationInfo({
                        ...quotationInfo,
                        quotation_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Date</Label>
                  <Input
                    id="orderDate"
                    value={quotationInfo.order_date}
                    onChange={(e) =>
                      setQuotationInfo({
                        ...quotationInfo,
                        order_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderTime">Time</Label>
                  <Input
                    id="orderTime"
                    value={quotationInfo.order_time}
                    onChange={(e) =>
                      setQuotationInfo({
                        ...quotationInfo,
                        order_time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Discount Section */}
            <div>
              <h3 className="text-lg font-medium">Discount</h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Cart Items Section */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                {cart.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 w-full">
                          <div className="space-y-1">
                            <Label htmlFor={`item-name-${index}`}>Name</Label>
                            <Input
                              id={`item-name-${index}`}
                              value={item.name}
                              onChange={(e) =>
                                handleItemChange(index, 'name', e.target.value)
                              }
                              placeholder="Item name"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-brand-${index}`}>Brand</Label>
                            <Input
                              id={`item-brand-${index}`}
                              value={item.brand}
                              onChange={(e) =>
                                handleItemChange(index, 'brand', e.target.value)
                              }
                              placeholder="Brand"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-unit-${index}`}>Pack</Label>
                            <Input
                              id={`item-unit-${index}`}
                              value={item.unit}
                              onChange={(e) =>
                                handleItemChange(index, 'unit', e.target.value)
                              }
                              placeholder="Unit"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-quantity-${index}`}>
                              Quantity
                            </Label>
                            <Input
                              id={`item-quantity-${index}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  'quantity',
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              min="1"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`item-price-${index}`}>Price</Label>
                            <Input
                              id={`item-price-${index}`}
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  'price',
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {cart.length === 0 && (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">No items added yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                      className="mt-2"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Section */}
            <div className="mt-6 rounded-md bg-muted p-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Total Amount:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              {discountPercentage > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount ({discountPercentage}%):</span>
                  <span>
                    -₹{((calculateTotal() * discountPercentage) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              {discountPercentage > 0 && (
                <div className="mt-2 flex justify-between text-lg font-medium">
                  <span>Final Amount:</span>
                  <span>
                    ₹{(calculateTotal() - (calculateTotal() * discountPercentage) / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {updateQuotationMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
