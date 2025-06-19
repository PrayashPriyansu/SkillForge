'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { useQuery } from 'convex/react';

import Loader from '@/components/global/loader';
import CourseCard from '@/components/pages/courses/course-card';
import CreateCourseForm from '@/components/pages/courses/create-course-form';
import { Badge } from '@/components/ui/badge';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const MOCK_ROLE = 'mentor';

export default function GroupCoursePage() {
  const { _id: groupId } = useParams<{ _id: Id<'groups'> }>();
  const coursesForGroup = useQuery(api.courses.getGroupCourses, {
    groupId: groupId,
  });

  const [expandedCourseId, setExpandedCourseId] =
    useState<Id<'courses'> | null>(null);

  const isMentor = MOCK_ROLE === 'mentor';

  const toggleCourseCollapse = (id: Id<'courses'>) => {
    setExpandedCourseId((prev) => (prev === id ? null : id));
  };

  // Loading skeleton
  if (coursesForGroup === undefined) {
    return <Loader />;
  }

  return (
    <div className="bg-background flex-1">
      <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex items-center">
          <div>
            <h2 className="text-2xl font-bold">Courses</h2>
            <div className="my-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                📚 {coursesForGroup.length} Course
                {coursesForGroup.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <div className="flex-1"></div>
          {isMentor && <CreateCourseForm groupId={groupId} />}
        </div>

        {/* Create Course Section */}

        {/* Courses Section */}
        {coursesForGroup.length === 0 ? (
          <div className="py-12 text-center sm:py-16">
            <div className="mb-6">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                <span className="text-2xl sm:text-3xl lg:text-4xl">📚</span>
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold sm:text-2xl">
                No courses yet
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md px-4 text-sm sm:text-base">
                Start building your learning journey by creating your first
                course above!
              </p>
            </div>
            {!isMentor && (
              <Badge variant="outline" className="text-muted-foreground">
                Contact your mentor to add courses
              </Badge>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-12 gap-4 sm:gap-6">
              {coursesForGroup.map((course) => {
                if (!course) return null;
                return (
                  <CourseCard
                    key={course._id}
                    course={course}
                    isMentor={isMentor}
                    isExpanded={expandedCourseId === course._id}
                    onToggleExpand={toggleCourseCollapse}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
