'use client';

import { useRouter } from 'next/navigation';

import { useQuery } from 'convex/react';
import { ArrowBigLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';

import CreateLessonForm from './add-lesson-form';
import LessonCard from './lesson-card';

type Props = { courseId: Id<'courses'> };
function Lessons({ courseId }: Props) {
  const router = useRouter();
  const lessons = useQuery(api.lessons.getLessons, { courseId: courseId });

  console.log(lessons);

  if (!lessons) {
    return <div>Loading lessons...</div>;
  }

  const goBack = () => {
    router.back();
  };

  const handleLessonClick = (lesson: Doc<'lessons'>) => {
    // Navigate to lesson detail page with topics
    router.push(`/group/[groupId]/course/${courseId}/${lesson._id}`);
  };

  return (
    <div className="">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={goBack}
      >
        <ArrowBigLeft /> Back
      </Button>
      <div className="flex items-center">
        <div>
          <h2 className="text-2xl font-bold">Lesson</h2>
          <div className="my-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs sm:text-sm">
              📚 {lessons.length} Lesson
              {lessons.length !== 1 && 's'}
            </Badge>
          </div>
        </div>
        <div className="flex-1"></div>
        <CreateLessonForm courseId={courseId} length={lessons.length} />
      </div>
      <div className="grid grid-cols-12 gap-6">
        {lessons.map((lesson, idx) => (
          <LessonCard
            lesson={lesson}
            key={idx}
            isMentor={true}
            onLessonClick={handleLessonClick}
          />
        ))}
      </div>
    </div>
  );
}
export default Lessons;
