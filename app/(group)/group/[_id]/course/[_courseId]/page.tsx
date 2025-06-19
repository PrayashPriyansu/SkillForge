'use client';

import { useParams } from 'next/navigation';

import Lessons from '@/components/pages/courses/lessons';
import { Id } from '@/convex/_generated/dataModel';

type Props = {};
function page({}: Props) {
  const { _courseId } = useParams();

  console.log(_courseId);
  return (
    <div className="p-6">
      <Lessons courseId={_courseId as Id<'courses'>} />
    </div>
  );
}
export default page;
