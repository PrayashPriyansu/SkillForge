import { Search } from 'lucide-react';

import { Input } from '../ui/input';
import { SidebarTrigger } from '../ui/sidebar';

type Props = {
  pageName: string;
};

export function Header({ pageName }: Props) {
  return (
    <header className="border-border bg-sidebar sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-4 py-3 shadow-sm backdrop-blur-md">
      {/* Sidebar Trigger */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {pageName}
      </div>

      <div className="text-muted-foreground flex items-center gap-3 text-sm">
        <div className="group relative">
          <Input className="border-foreground/20 text-foreground" />
          <Search className="pointer-events-none visible absolute top-1/2 left-2 -translate-y-1/2 group-focus-within:invisible" />
        </div>
      </div>
    </header>
  );
}
