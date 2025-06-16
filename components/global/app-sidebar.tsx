'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthActions } from '@convex-dev/auth/react';
import { Home, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { useGlobalStore } from '../providers/store-provider';
import { Button } from '../ui/button';
import { ModeToggle } from './toggle-dark-mode';

// Top menu items for all users
const topItems = [
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

// Bottom settings
// const bottomItems = [
//   {
//     title: 'Settings',
//     url: '/settings',
//     icon: Settings,
//   },
// ];

export function AppSidebar() {
  const path = usePathname();
  const isActive = (route: string) => path === route;
  const { signOut } = useAuthActions();

  const image = useGlobalStore((state) => state.user.image);
  const name = useGlobalStore((state) => state.user.name);
  const email = useGlobalStore((state) => state.user.email);

  return (
    <Sidebar className="bg-background h-dvh border-r shadow-sm">
      <SidebarContent className="flex h-full flex-col justify-between px-4 py-6">
        {/* Top Section: Branding + Menu */}
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text font-mono text-2xl font-bold text-transparent">
              SkillForge
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-6 space-y-2">
              <SidebarMenu>
                {topItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          'hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-xl font-medium transition-colors',
                          isActive(item.url) ? 'bg-muted' : ''
                        )}
                      >
                        <item.icon className="text-muted-foreground h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom Section: Profile + Actions */}
        <div className="space-y-4">
          {/* <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-xl transition-colors"
                  >
                    <item.icon className="text-muted-foreground h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu> */}

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              {image && (
                <Image
                  src={image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="text-xl font-medium">{name}</span>
                <span className="text-muted-foreground text-xs">{email}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <ModeToggle />
              <Button
                variant="destructive"
                size="sm"
                className="flex-grow"
                onClick={() => void signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
