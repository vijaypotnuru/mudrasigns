//@ts-nocheck
import { useQuery } from '@tanstack/react-query'
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

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: () => getAllEmployees(),
  })

  const getFilteredNavGroups = () => {
    return sidebarData.navGroups
      .filter((group) => {
        if (group.roles) {
          return group.roles.includes(role)
        }
        return true
      })
      .map((group) => ({
        ...group,
        items: group.items
          .filter((item) => {
            if (item.roles) {
              return item.roles.includes(role)
            }
            return true
          })
          .map((item) => {
            if (
              group.title === 'Lead Management' &&
              item.title === 'Leads By Employees'
            ) {
              return {
                ...item,
                items: (employeesQuery.data || []).map((employee) => ({
                  title: employee.name,
                  url: `/employeeleads/${employee.id}`,
                })),
              }
            }
            return item
          }),
      }))
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
