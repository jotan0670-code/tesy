import type React from 'react';
import {
  Search,
  LayoutDashboard,
  Inbox,
  Megaphone,
  Calendar,
  GraduationCap,
  Hash,
  Settings,
  LogOut,
  Users,
  Ticket,
  ClipboardList,
  UserCheck,
} from 'lucide-react';
import type { Role } from './campus-data';

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

/**
 * One nav tree per account kind. Nothing is shared between roles beyond the
 * bottom items — a Teacher never renders the student's Classes tree, and an
 * Office never renders Calendar, because neither appears in their spec.
 */
export const NAV_BY_ROLE: Record<Role, NavGroupData[]> = {
  Student: [
    {
      items: [
        { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
        { id: 'home', title: 'Home', icon: LayoutDashboard },
        { id: 'inbox', title: 'Inbox', icon: Inbox },
        { id: 'announcement', title: 'Announce', icon: Megaphone },
        { id: 'calendar', title: 'Calendar', icon: Calendar },
      ],
    },
    {
      heading: 'Academics',
      items: [
        {
          id: 'classes',
          title: 'Classes',
          icon: GraduationCap,
          children: [
            { id: 'cl-enrolled', title: 'Enrolled', icon: Hash },
            { id: 'cl-finished', title: 'Finished', icon: Hash },
            { id: 'cl-failed', title: 'Failed', icon: Hash },
            { id: 'cl-dropped', title: 'Dropped', icon: Hash },
          ],
        },
      ],
    },
  ],
  Teacher: [
    {
      items: [
        { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
        { id: 'inbox', title: 'Inbox', icon: Inbox },
        { id: 'announcement', title: 'Announce', icon: Megaphone },
        { id: 'calendar', title: 'Calendar', icon: Calendar },
      ],
    },
    {
      heading: 'Teaching',
      items: [{ id: 'my-classes', title: 'My Classes', icon: GraduationCap }],
    },
  ],
  Office: [
    {
      items: [
        { id: 'search', title: 'Search', icon: Search, shortcut: '⌘K' },
        { id: 'office-announce', title: 'Announcements', icon: Megaphone },
        { id: 'office-tickets', title: 'Tickets', icon: Ticket },
      ],
    },
  ],
  Admin: [
    {
      heading: 'User Management',
      items: [
        { id: 'admin-accounts', title: 'All Accounts', icon: Users },
        { id: 'admin-pending', title: 'Pending Approval', icon: UserCheck },
        { id: 'admin-activity', title: 'Activity Log', icon: ClipboardList },
      ],
    },
  ],
};

export const BOTTOM_NAV: NavItemData[] = [
  { id: 'settings', title: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'logout', title: 'Log out', icon: LogOut },
];

/** Where each role lands right after signing in. */
export const LANDING_PAGE: Record<Role, string> = {
  Student: 'home',
  Teacher: 'my-classes',
  Office: 'office-announce',
  Admin: 'admin-accounts',
};

/** Roles that get an Inbox badge driven by unread message count. */
export const ROLES_WITH_INBOX: Role[] = ['Student', 'Teacher'];

export const flattenNavItems = (items: NavItemData[]): NavItemData[] =>
  items.reduce((acc, item) => {
    acc.push(item);
    if (item.children) acc.push(...flattenNavItems(item.children));
    return acc;
  }, [] as NavItemData[]);

export const navTitleFor = (role: Role, id: string): string => {
  const all = flattenNavItems([...NAV_BY_ROLE[role].flatMap((g) => g.items), ...BOTTOM_NAV]);
  return all.find((item) => item.id === id)?.title ?? 'Dashboard';
};
