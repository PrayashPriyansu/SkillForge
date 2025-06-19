'use client';

import { useGlobalStore } from '@/components/providers/store-provider';
import { SidebarTrigger } from '@/components/ui/sidebar';

function GroupHeader() {
  const group = useGlobalStore((state) => state.currGroup);

  return (
    <div className="bg-card flex h-fit w-full items-center gap-4 border p-4 shadow-sm">
      <SidebarTrigger />

      {/* Main Content */}
      <div className="flex flex-1 justify-between sm:items-center">
        {/* Group Name */}
        <h2 className="text-primary text-2xl font-semibold tracking-tight sm:text-3xl">
          {group?.name || 'Unnamed Group'}
        </h2>

        {/* All Groups Button */}
        {/* <Button
          asChild
          variant="outline"
          className="text-muted-foreground hover:text-primary w-fit text-sm sm:text-base"
        >
          <Link href="/groups" className="flex items-center gap-2">
            All Groups
          </Link>
        </Button> */}
      </div>
    </div>
  );
}

export default GroupHeader;
