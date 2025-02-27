import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAllQuotations } from '@/services/firebase/invoices'
import { formatDistanceToNow } from 'date-fns'

export function RecentSales() {
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentQuotations = async () => {
      try {
        setIsLoading(true);
        const quotations = await getAllQuotations();
        
        // Sort by creation date (newest first) and take the latest 5
        const sorted = [...quotations].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        }).slice(0, 5);
        
        setRecentQuotations(sorted);
      } catch (error) {
        console.error('Error fetching recent quotations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentQuotations();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-40">Loading recent activity...</div>;
  }

  if (recentQuotations.length === 0) {
    return <div className="flex items-center justify-center h-40">No recent activity found</div>;
  }

  // Function to get initials from a name
  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className='space-y-8'>
      {recentQuotations.map((quotation) => (
        <div key={quotation.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>{getInitials(quotation.customerName)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>{quotation.customerName || 'Unknown Customer'}</p>
              <p className='text-sm text-muted-foreground'>
                {quotation.quotation_number || 'No Quotation Number'}
              </p>
            </div>
            <div>
              <div className='font-medium'>₹{quotation.total?.toLocaleString('en-IN') || '0'}</div>
              <p className='text-xs text-muted-foreground'>
                {quotation.createdAt 
                  ? formatDistanceToNow(new Date(quotation.createdAt), { addSuffix: true }) 
                  : 'Unknown date'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
