//@ts-nocheck
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useTheme } from '@/context/theme-context'

export function Overview({ data = [] }) {
  const [monthlyData, setMonthlyData] = useState([])
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    // Initialize monthly data with 0 totals
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]

    const initialMonthlyData = months.map((name) => ({ name, total: 0 }))

    // Group invoices by month and calculate totals
    if (data && data.length > 0) {
      data.forEach((invoice) => {
        if (invoice.createdAt) {
          const date = new Date(invoice.createdAt)
          const monthIndex = date.getMonth()

          if (monthIndex >= 0 && monthIndex < 12) {
            initialMonthlyData[monthIndex].total += invoice.total || 0
          }
        }
      })
    }

    setMonthlyData(initialMonthlyData)
  }, [data])

  // Set colors based on theme
  const axisColor = isDarkMode ? '#aaaaaa' : '#888888'
  const tooltipBackground = isDarkMode ? '#1e1e1e' : '#fff'
  const tooltipTextColor = isDarkMode ? '#fff' : '#000'
  const barFillColor = isDarkMode
    ? 'rgba(132, 90, 223, 0.8)'
    : 'rgba(74, 153, 233, 0.8)'

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey='name'
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={axisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value) => [`₹${value}`, 'Revenue']}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{
            backgroundColor: tooltipBackground,
            color: tooltipTextColor,
            border: `1px solid ${isDarkMode ? '#333' : '#ddd'}`,
            borderRadius: '4px',
          }}
          itemStyle={{
            color: tooltipTextColor,
          }}
          cursor={{
            fill: isDarkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar dataKey='total' fill={barFillColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
