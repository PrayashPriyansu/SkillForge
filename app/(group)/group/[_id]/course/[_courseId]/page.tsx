'use client';

import { useParams } from 'next/navigation';

import Lessons from '@/components/pages/courses/lessons';
import { Id } from '@/convex/_generated/dataModel';

type Props = object;
function Page({}: Props) {
  const { _courseId } = useParams();

  console.log(_courseId);
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <Lessons courseId={_courseId as Id<'courses'>} />
    </div>
  );
}
export default Page;
