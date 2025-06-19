import { SidebarTrigger } from '../ui/sidebar';
import SearchBar from './search-bar';

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

      <SearchBar />
    </header>
  );
}
