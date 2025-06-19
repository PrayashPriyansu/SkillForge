import { PropsWithChildren } from 'react';

import GroupLayout from '@/components/pages/groups/group-layout';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <GroupLayout>{children}</GroupLayout>
    </div>
  );
}
export default layout;
