'use client';

import { useParams } from 'next/navigation';

import LessonDetail from '@/components/pages/courses/lesson-detail';
import { Id } from '@/convex/_generated/dataModel';

const MOCK_ROLE = 'mentor';

export default function LessonDetailPage() {
  const { _courseId, _lessonId } = useParams();
  const isMentor = MOCK_ROLE === 'mentor';

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <LessonDetail
        courseId={_courseId as Id<'courses'>}
        lessonId={_lessonId as Id<'lessons'>}
        isMentor={isMentor}
      />
    </div>
  );
}
