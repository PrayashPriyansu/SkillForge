'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import Lessons from '@/components/pages/courses/lessons';
import { Id } from '@/convex/_generated/dataModel';

type Props = {};
function page({}: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const { _courseId } = useParams();

  console.log(_courseId);
  return (
    <div className="p-6">
      <Lessons isEdit={isEdit} courseId={_courseId as Id<'courses'>} />
    </div>
  );
}
export default page;
