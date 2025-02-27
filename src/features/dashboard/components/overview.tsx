import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export function Overview({ data = [] }) {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Initialize monthly data with 0 totals
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const initialMonthlyData = months.map(name => ({ name, total: 0 }));
    
    // Group invoices by month and calculate totals
    if (data && data.length > 0) {
      data.forEach(invoice => {
        if (invoice.createdAt) {
          const date = new Date(invoice.createdAt);
          const monthIndex = date.getMonth();
          
          if (monthIndex >= 0 && monthIndex < 12) {
            initialMonthlyData[monthIndex].total += invoice.total || 0;
          }
        }
      });
    }
    
    setMonthlyData(initialMonthlyData);
  }, [data]);

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          formatter={(value) => [`₹${value}`, 'Revenue']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
