//@ts-nocheck
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from '@tanstack/react-router';
import { getAllSignBoardRequests, getAllNewSignBoardLeads } from '@/services/firebase/customer-requests';
import { getAllQuotations, getAllInvoices } from '@/services/firebase/invoices';
import { Database, IndianRupee, PieChart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './components/overview';
import { RecentSales } from './components/recent-sales';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';


export default function Dashboard() {
  const router = useRouter()
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [signBoardRequests, setSignBoardRequests] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate total revenue from invoices
  const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
  
  // Calculate average order value
  const averageOrderValue = invoices.length > 0 
    ? Math.round(totalRevenue / invoices.length) 
    : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all data concurrently
        const [
          fetchedQuotations,
          fetchedInvoices,
          fetchedSignBoards,
          fetchedLeads
        ] = await Promise.all([
          getAllQuotations(),
          getAllInvoices(),
          getAllSignBoardRequests(),
          getAllNewSignBoardLeads()
        ]);
        
        setQuotations(fetchedQuotations);
        setInvoices(fetchedInvoices);
        setSignBoardRequests(fetchedSignBoards);
        setLeads(fetchedLeads);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateQuotation = () => {
    router.navigate({ to: '/create-quotation' })
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          <div className='flex items-center space-x-2'>
            <Button onClick={handleCreateQuotation}>Create New Quotation</Button>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <IndianRupee className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>₹{totalRevenue.toLocaleString('en-IN')}</div>
              <p className='text-xs text-muted-foreground'>
                From {invoices.length} invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Quotations</CardTitle>
              <Database className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{quotations.length}</div>
              <p className='text-xs text-muted-foreground'>
                {quotations.length > 0 && quotations[0].createdAt 
                  ? `Latest ${formatDistanceToNow(new Date(quotations[0].createdAt), { addSuffix: true })}`
                  : 'No recent quotations'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sign Board Requests</CardTitle>
              <ShoppingCart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{signBoardRequests.length}</div>
              <p className='text-xs text-muted-foreground'>
                {signBoardRequests.length > 0 && signBoardRequests[0].createdAt 
                  ? `Latest ${formatDistanceToNow(new Date(signBoardRequests[0].createdAt), { addSuffix: true })}`
                  : 'No recent sign board requests'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Average Order Value</CardTitle>
              <PieChart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>₹{averageOrderValue.toLocaleString('en-IN')}</div>
              <p className='text-xs text-muted-foreground'>
                {invoices.length} orders total
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Revenue generated from invoices per month in the current year
              </CardDescription>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview data={invoices} />
            </CardContent>
          </Card>
          
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest quotations and customer activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}