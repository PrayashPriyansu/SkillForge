'use client';

import { useMemo, useState } from 'react';

import { useMutation } from 'convex/react';
import { Bolt, CheckCircle, Hash, Moon, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

// Types
type LessonStatus = 'draft' | 'published';

interface LessonCardProps {
  lesson: Doc<'lessons'>;
  isMentor?: boolean;
  onLessonClick?: (lesson: Doc<'lessons'>) => void;
}

interface EditFormData {
  title: string;
  description: string;
  status: LessonStatus;
  xpReward: string;
  order: number;
}

// Status Configuration
const STATUS_CONFIG = {
  published: {
    variant: 'default' as const,
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    label: 'Published',
  },
  draft: {
    variant: 'secondary' as const,
    icon: <Moon className="h-4 w-4 text-yellow-500" />,
    label: 'Draft',
  },
};

export default function LessonCard({
  lesson,
  isMentor = false,
  onLessonClick,
}: LessonCardProps) {
  const updateLesson = useMutation(api.lessons.updateLesson);
  const deleteLesson = useMutation(api.lessons.deleteLesson);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: lesson.title,
    description: lesson.description || '',
    status: (lesson.status as LessonStatus) || 'draft',
    xpReward: lesson.xp?.toString() || '10',
    order: lesson.order || 0,
  });

  const statusConfig = STATUS_CONFIG[editFormData.status];

  const hasUnsavedChanges = useMemo(() => {
    return (
      editFormData.title !== lesson.title ||
      editFormData.description !== (lesson.description || '') ||
      editFormData.status !== ((lesson.status as LessonStatus) || 'draft') ||
      editFormData.xpReward !== (lesson.xp?.toString() || '10') ||
      editFormData.order !== (lesson.order || 0)
    );
  }, [editFormData, lesson]);

  const handleFormDataChange = (
    field: keyof EditFormData,
    value: string | number
  ) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelEdit = () => {
    if (hasUnsavedChanges && !confirm('Discard unsaved changes?')) return;
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const xp = parseInt(editFormData.xpReward);
    if (!editFormData.title.trim() || xp < 1 || xp > 100) {
      alert('Please fill valid title and XP (1-100).');
      return;
    }

    setIsSaving(true);
    try {
      await updateLesson({
        id: lesson._id,
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        status: editFormData.status,
        xp: xp,
        order: editFormData.order,
      });
      setIsEditing(false);
    } catch (err) {
      alert(`Error saving lesson. ${err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete lesson "${lesson.title}"?`)) return;
    setIsDeleting(true);
    try {
      await deleteLesson({ id: lesson._id });
    } catch (err) {
      alert(`Error deleting lesson. ${err}`);
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={`group col-span-12 transition-shadow hover:shadow-lg ${
        onLessonClick && !isEditing ? 'cursor-pointer' : ''
      }`}
      onClick={() => !isEditing && onLessonClick?.(lesson)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <Hash className="mr-1 h-4 w-4" />
              {editFormData.order}
            </Badge>
            <Badge variant="outline">
              <Bolt className="mr-1 h-4 w-4 text-orange-500" />
              {lesson.xp || 10} XP
            </Badge>
            <Badge
              variant={statusConfig.variant}
              className="flex items-center gap-1"
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>

          {isMentor && !isEditing && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-3">
            <Input
              value={editFormData.title}
              onChange={(e) => handleFormDataChange('title', e.target.value)}
              placeholder="Title"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={editFormData.status}
                onValueChange={(v) => handleFormDataChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                min="1"
                max="100"
                value={editFormData.xpReward}
                onChange={(e) =>
                  handleFormDataChange('xpReward', e.target.value)
                }
              />
            </div>
          </div>
        ) : (
          <CardTitle className="mt-2 text-xl">{lesson.title}</CardTitle>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {isEditing ? (
          <>
            <Textarea
              value={editFormData.description}
              onChange={(e) =>
                handleFormDataChange('description', e.target.value)
              }
              placeholder="Lesson description..."
              className="min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!hasUnsavedChanges || isSaving}
                onClick={handleSaveEdit}
              >
                {isSaving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {lesson.description || 'No description available.'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
