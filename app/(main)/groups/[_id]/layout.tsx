import { PropsWithChildren } from 'react';

import GroupHeader from '@/components/pages/groups/groupHeader';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <GroupHeader />
      <div>{children}</div>
    </div>
  );
}
export default layout;
