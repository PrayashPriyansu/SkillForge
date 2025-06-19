'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

type SidebarItem = {
  title: string;
  url: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

type Props = {
  topItems: SidebarItem[];
};

export function AppSidebar({ topItems }: Props) {
  const path = usePathname();
  const isActive = (route: string) => path === route;

  // Add settings to the navigation items

  return (
    <Sidebar className="h-dvh border-r">
      <SidebarContent className="flex h-full flex-col">
        <div className="px-6 py-2">
          <SidebarGroup>
            {/* Clean Branding */}
            <div className="mb-8">
              <SidebarGroupLabel className="relative">
                <div className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                  SkillForge
                </div>
                <div className="bg-primary absolute -bottom-2 left-0 h-1 w-16 rounded-full opacity-80"></div>
              </SidebarGroupLabel>
            </div>

            {/* Navigation Menu - All Items Including Settings */}
            <SidebarGroupContent className="space-y-2">
              <SidebarMenu>
                {topItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          'group relative flex items-center gap-4 rounded-xl px-4 py-3 font-medium transition-all duration-200 hover:scale-[1.02]',
                          isActive(item.url)
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        {/* {item.icon && (
                          <div
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-lg transition-colors',
                              isActive(item.url)
                                ? 'text-primary-foreground'
                                : 'text-muted-foreground group-hover:text-accent-foreground'
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                          </div>
                        )} */}
                        <span className="text-2xl font-extrabold">
                          {item.title}
                        </span>
                        {isActive(item.url) && (
                          <div className="bg-primary-foreground/30 absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-full"></div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
