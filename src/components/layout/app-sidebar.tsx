//@ts-nocheck
import { useState, useEffect } from 'react'
import { getAllEmployees } from '@/services/firebase/user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user?.role || 'employee'
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchEmployees = async () => {
      const employees = await getAllEmployees()
      setEmployees(employees)
    }
    fetchEmployees()
  }, [])

  const getFilteredNavGroups = () => {
    return sidebarData.navGroups.map((group) => {
      if (group.title === 'Lead Management') {
        return {
          ...group,
          items: group.items.map((item) => {
            if (item.title === 'Leads By Employees') {
              return {
                ...item,
                items: employees.map((employee) => ({
                  title: employee.name,
                  url: `/employee/${employee.id}`,
                })),
              }
            }
            return item
          }),
        }
      }
      return group
    })
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {getFilteredNavGroups().map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
