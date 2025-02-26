//@ts-nocheck
import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconCircleLetterL,
  IconCircleLetterLFilled,
  IconError404,
  IconHelp,
  IconInvoice,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconReceiptRupee,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Mudra Signs',
      logo: Command,
      plan: '',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
          roles: ['admin'],
        },
        {
          title: 'Employee Request',
          url: '/employee-request',
          icon: IconChecklist,
          roles: ['employee'],
        },
        // {
        //   title: 'All Requests',
        //   url: '/allrequests',
        //   icon: IconChecklist,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'Customer Requests',
        //   url: '/customer-requests',
        //   icon: IconChecklist,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'Requests By Employees',
        //   url: '/requests-by-employees',
        //   icon: IconBarrierBlock,
        //   roles: ['admin'],
        // },
        {
          title: 'My Leads',
          url: '/myleads',
          icon: IconChecklist,
          roles: ['employee'],
        },
        // {
        //   title: 'All Leads',
        //   url: '/allLeads',
        //   icon: IconChecklist,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'Tasks',
        //   url: '/tasks',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Apps',
        //   url: '/apps',
        //   icon: IconPackages,
        // },
        // {
        //   title: 'Chats',
        //   url: '/chats',
        //   badge: '3',
        //   icon: IconMessages,
        // },
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: IconUsers,
        // },
      ],
    },
    {
      title: 'Lead Management',
      roles: ['admin'],
      items: [
        {
          title: 'Leads By Employees',
          icon: IconCircleLetterL,
          items: [
            // {
            //   title: 'Marketingperson1',
            //   url: '/employee/7MJR1FvZGVlnBNDZdBeS',
            // },
            // {
            //   title: 'demo-employee',
            //   url: '/employee/eYhtaZxoUaH44ceUMVGw',
            // },
          ],
        },
        {
          title: 'Leads',
          icon: IconLockAccess,
          items: [
            {
              title: 'All Leads',
              url: '/allLeads',
              icon: IconChecklist,
              roles: ['admin'],
            },
            // {
            //   title: 'demo-employee',
            //   url: '/employee/eYhtaZxoUaH44ceUMVGw',
            // },
          ],
        },
      ],
    },
    {
      title: 'Quotation Management',
      roles: ['admin'],
      items: [
        {
          title: 'Create Quotation',
          url: '/create-quotation',
          icon: IconReceiptRupee,
          roles: ['admin'],
        },
        {
          title: 'All Quotations',
          url: '/all-quotations',
          icon: IconInvoice,
          roles: ['admin'],
        },
        // {
        //   title: 'Employee Request',
        //   url: '/employee-request',
        //   icon: IconChecklist,
        //   roles: ['employee'],
        // },
        // {
        //   title: 'All Requests',
        //   url: '/allrequests',
        //   icon: IconChecklist,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'Customer Requests',
        //   url: '/customer-requests',
        //   icon: IconChecklist,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'Requests By Employees',
        //   url: '/requests-by-employees',
        //   icon: IconBarrierBlock,
        //   roles: ['admin'],
        // },
        // {
        //   title: 'My Leads',
        //   url: '/myleads',
        //   icon: IconChecklist,
        //   roles: ['employee'],
        // },
      ],
    },

    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    // },
  ],
}
