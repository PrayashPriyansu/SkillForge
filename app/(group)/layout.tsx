import { PropsWithChildren } from 'react';

import RoleSync from '@/components/auth/role-sync';

type Props = PropsWithChildren & {};
function layout({ children }: Props) {
  return (
    <RoleSync>
      <div className="flex h-dvh w-dvw flex-col">{children}</div>
    </RoleSync>
  );
}
export default layout;
