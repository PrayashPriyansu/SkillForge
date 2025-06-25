'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useMutation } from 'convex/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface Course {
  _id: Id<'courses'>;
  title: string;
  description?: string;
  status?: string;
  totalXp?: number;
}

interface CourseCardProps {
  course: Course;
  isMentor: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: Id<'courses'>) => void;
}

export default function CourseCard({
  course,
  isMentor,
  isExpanded,
  onToggleExpand,
}: CourseCardProps) {
  const updateCourse = useMutation(api.courses.updateCourse);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const pathname = usePathname();

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(course.title);
    setEditedDescription(course.description || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleSaveEdit = async () => {
    try {
      await updateCourse({
        id: course._id,
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return '🟢';
      case 'draft':
        return '🟡';
      case 'archived':
        return '⚫';
      default:
        return '🔵';
    }
  };

  const status = course.status || 'draft';

  return (
    <Card
      className={`group col-span-12 transition-all duration-300 hover:shadow-lg sm:col-span-6 md:col-span-4 lg:col-span-3 ${
        isExpanded ? 'ring-primary/20 shadow-lg ring-2' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={getStatusVariant(status)} className="text-xs">
            {getStatusIcon(status)}{' '}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>

          {isMentor && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleEditClick}
            >
              <span className="sr-only">Edit course</span>
              ✏️
            </Button>
          )}
        </div>

        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-lg font-semibold"
            placeholder="Course title..."
          />
        ) : (
          <CardTitle
            className="hover:text-primary line-clamp-2 cursor-pointer text-lg transition-colors sm:text-xl"
            onClick={() => !isEditing && onToggleExpand(course._id)}
          >
            {course.title}
          </CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {isEditing ? (
          <>
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Course description..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Save
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
              {course.description || 'No description provided yet.'}
            </p>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  📖 <span className="hidden sm:inline">Lessons:</span> 0
                </span>
              </div>
              <Button size="sm" className="" variant="outline">
                <Link href={`${pathname}/${course._id}`}>Open</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
