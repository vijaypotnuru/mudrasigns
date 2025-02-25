import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  note: z.string().optional(),
  isVerified: z.string(),
  userId: z.string(),
  createdAt: z.number(),
  fileNames: z.array(z.string()),
  phoneNumber: z.string(),
  invoiceURL: z.string().optional(),
  reqId: z.string(),
  request: z.string(),
  companyName: z.string(),
  address: z.string(),
  fileURLs: z.array(z.string()),
  fullName: z.string(),
})

export type Task = z.infer<typeof taskSchema>
