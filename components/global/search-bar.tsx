import { Search } from 'lucide-react';

import { Input } from '../ui/input';

type Props = {};
function SearchBar({}: Props) {
  return (
    <div className="text-muted-foreground flex items-center gap-3 text-sm">
      <div className="group relative">
        <Input className="border-foreground/20 text-foreground" />
        <Search className="pointer-events-none visible absolute top-1/2 left-2 -translate-y-1/2 group-focus-within:invisible" />
      </div>
    </div>
  );
}
export default SearchBar;
