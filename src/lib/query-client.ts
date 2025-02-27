import { QueryClient } from '@tanstack/react-query'

// Get the existing QueryClient from the app
export const getQueryClient = () => {
  // Use the existing queryClient from outside of component scope
  return new QueryClient()
}

// Invalidate quotations-related queries
export const invalidateQuotationsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['all-quotations'] })
}

// Invalidate invoices-related queries
export const invalidateInvoicesQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['all-invoices'] })
}

// Invalidate a specific quotation query by ID
export const invalidateQuotationQuery = (queryClient: QueryClient, quotationId: string) => {
  queryClient.invalidateQueries({ queryKey: ['quotation-details', quotationId] })
}

// Invalidate a specific invoice query by ID
export const invalidateInvoiceQuery = (queryClient: QueryClient, invoiceId: string) => {
  queryClient.invalidateQueries({ queryKey: ['invoice-details', invoiceId] })
}
