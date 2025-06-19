import { Home, Users } from 'lucide-react';

export const mainSidebarTopItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Groups',
    url: '/groups',
    icon: Users,
  },
];

export const getGroupSidebarTopItems = (groupId: string) => [
  {
    title: 'Dashboard',
    url: `/group/${groupId}`,
  },
  {
    title: 'Plan',
    url: `/group/${groupId}/plan`,
  },
  {
    title: 'Course',
    url: `/group/${groupId}/course`,
  },
  {
    title: 'Quiz',
    url: `/group/${groupId}/quiz`,
  },
];
