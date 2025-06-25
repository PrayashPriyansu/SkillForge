import { PropsWithChildren } from 'react';

import GroupLayout from '@/components/pages/groups/group-layout';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <div className="flex flex-col md:flex-row">
      <GroupLayout>{children}</GroupLayout>
    </div>
  );
}
export default layout;
