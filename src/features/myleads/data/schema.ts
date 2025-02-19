import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  isVerified: z.string().nullable(),
  request: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  createdAt: z.number().nullable(),
  fileName: z.string().nullable(),
  fileURL: z.string().nullable(),
  reqId: z.string().nullable(),
  invoiceURL: z.string().nullable(),
  fullName: z.string().nullable(),
  companyName: z.string().nullable(),
  address: z.string().nullable(),
})

export type Task = z.infer<typeof taskSchema>
