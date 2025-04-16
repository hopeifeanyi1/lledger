//scr/constants/index.tsx
'use client'
import { SideNavItem } from "@/types";
import { Dashboard, Settings, Logout, File, ChatLight, Edit } from "@/components/store/Icon";

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
      id: 1,
      title: 'Overview',
      path: '/overview',
      icon: <Dashboard/>,
    },
    {
      id: 2,
      title: 'New Decision',
      path: '/new-decision',
      icon: <Edit/>,
    },
    {
      id: 3,
      title: 'AI Reasoning',
      path: '/chat',
      icon: <ChatLight/>,
    },
    {
      id: 4,
      title: 'My Decisions',
      path: '/decisions',
      icon: <File/>,
    },
    {
      id: 5,
      title: 'Settings',
      path: '/settings',
      icon: <Settings/>,
    },
    {
      id: 6,
      title: 'Log out',
      path: '/',
      icon: <Logout/>,
    },
  ];