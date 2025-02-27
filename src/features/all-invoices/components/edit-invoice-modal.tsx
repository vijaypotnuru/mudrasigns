import { useState, useEffect } from 'react'
import { Loader2, PlusCircle, Trash2 } from 'lucide-react'
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
import { updateInvoice } from '@/services/firebase/invoices'
import { useToast } from '@/hooks/use-toast'

interface EditInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceDetails: any
  invoiceId: string
  onUpdated?: () => void
}

export function EditInvoiceModal({
  isOpen,
  onClose,
  invoiceDetails,
  invoiceId,
  onUpdated,
}: EditInvoiceModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerMobile, setCustomerMobile] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [cart, setCart] = useState<any[]>([])

  // Initialize form state from invoiceDetails
  useEffect(() => {
    if (invoiceDetails) {
      setCustomerName(invoiceDetails.customerDetails?.customerName || '')
      setCustomerMobile(invoiceDetails.customerDetails?.customerMobile || '')
      setDiscountPercentage(invoiceDetails.discountPercentage || 0)
      setCart(invoiceDetails.cart || [])
    }
  }, [invoiceDetails])

  const handleAddItem = () => {
    setCart([
      ...cart,
      {
        id: Date.now().toString(),
        name: '',
        quantity: 1,
        price: 0,
      },
    ])
  }

  const handleRemoveItem = (indexToRemove: number) => {
    setCart(cart.filter((_, index) => index !== indexToRemove))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedCart = [...cart]
    updatedCart[index] = {
      ...updatedCart[index],
      [field]: field === 'quantity' || field === 'price' ? Number(value) : value,
    }
    setCart(updatedCart)
  }

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    )
    const discount = (subtotal * discountPercentage) / 100
    return subtotal - discount
  }

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
      setIsSubmitting(true)

      // Create updated invoice data
      const updatedInvoiceData = {
        ...invoiceDetails,
        customerDetails: {
          customerName,
          customerMobile,
        },
        discountPercentage,
        cart,
        total: calculateTotal(),
        updatedAt: new Date(),
      }

      // Update the invoice in Firestore
      await updateInvoice(invoiceId, updatedInvoiceData)

      // Close modal and notify parent component
      if (onUpdated) {
        onUpdated()
      } else {
        onClose()
      }

      toast({
        title: 'Success',
        description: 'Invoice updated successfully',
      })
    } catch (error) {
      console.error('Error updating invoice:', error)
      toast({
        title: 'Error',
        description: 'Failed to update invoice',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerMobile">Customer Mobile</Label>
                <Input
                  id="customerMobile"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="Customer Mobile"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddItem}
                className="flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <Card key={item.id || index}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-[1fr,80px,80px,40px] gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`item-name-${index}`}>Item Description</Label>
                        <Input
                          id={`item-name-${index}`}
                          value={item.name || ''}
                          onChange={(e) =>
                            handleItemChange(index, 'name', e.target.value)
                          }
                          placeholder="Item description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`item-quantity-${index}`}
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`item-price-${index}`}>Price (₹)</Label>
                        <Input
                          id={`item-price-${index}`}
                          type="number"
                          min="0"
                          value={item.price || ''}
                          onChange={(e) =>
                            handleItemChange(index, 'price', e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-end justify-center pb-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No items added. Click "Add Item" to add your first item.
                </div>
              )}
            </div>
          </div>

          {/* Discount Section */}
          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Discount (%)</Label>
            <Input
              id="discountPercentage"
              type="number"
              min="0"
              max="100"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            />
          </div>

          {/* Total Section */}
          <div className="flex justify-end space-x-4 text-lg font-medium">
            <span>Total:</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
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
