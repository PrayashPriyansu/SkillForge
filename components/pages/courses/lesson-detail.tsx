'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useQuery } from 'convex/react';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import CreateTopicForm from '../topics/create-topic-form';
import TopicCard from '../topics/topic-card';

interface LessonDetailProps {
  courseId: Id<'courses'>;
  lessonId: Id<'lessons'>;
  isMentor?: boolean;
}

export default function LessonDetail({
  courseId,
  lessonId,
  isMentor = false,
}: LessonDetailProps) {
  const router = useRouter();
  const lesson = useQuery(api.lessons.getLessons, { courseId });
  const topics = useQuery(api.topics.getTopics, { lessonId });

  const [expandedTopics, setExpandedTopics] = useState<Set<Id<'topics'>>>(
    new Set()
  );

  const toggleTopic = (topicId: Id<'topics'>) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  if (!lesson || !topics) {
    return <div>Loading...</div>;
  }

  const currentLesson = lesson[0]; // Assuming we get the specific lesson

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Lessons
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{currentLesson?.title}</h1>
            <p className="text-muted-foreground mt-2">
              {currentLesson?.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {currentLesson?.xp} XP
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              45 min
            </Badge>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Topics</h2>
          {isMentor && (
            <CreateTopicForm lessonId={lessonId} topicsCount={topics.length} />
          )}
        </div>

        {topics.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-6">
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                No topics yet
              </h3>
              <p className="text-muted-foreground mx-auto max-w-md text-sm">
                {isMentor
                  ? 'Start organizing your lesson by creating topics above!'
                  : "This lesson doesn't have any topics yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic._id}
                topic={topic}
                isExpanded={expandedTopics.has(topic._id)}
                onToggle={() => toggleTopic(topic._id)}
                isMentor={isMentor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
