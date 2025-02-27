import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  customerMobile: z.string().min(10).max(15),
  customerName: z.string().min(2).max(255),
  discountPercentage: z.number().min(0).max(100),
  invoice_number: z.string().min(1),
  order_date: z.string(),
  order_time: z.string(),
  total: z.number().min(0),
  createdAt: z.number()
})

export type Task = z.infer<typeof taskSchema>

export const fieldLabels = {
  customerMobile: 'Customer Mobile',
  customerName: 'Customer Name',
  discountPercentage: 'Discount %',
  invoice_number: 'Invoice Number',
  order_date: 'Order Date',
  order_time: 'Order Time',
  total: 'Total Amount',
  createdAt: 'Created At'
} as const
