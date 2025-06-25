'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, Clock, Edit, Plus } from 'lucide-react';

import { useGlobalStore } from '@/components/providers/store-provider';
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
import { Id } from '@/convex/_generated/dataModel';

export default function SubtopicDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const subtopic = useQuery(api.subtopics.getSubtopic, {
    id: id as Id<'subtopics'>,
  });
  const updateSubtopic = useMutation(api.subtopics.updateSubtopic);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editEstimatedTime, setEditEstimatedTime] = useState(15);
  const [editStatus, setEditStatus] = useState<'draft' | 'published'>('draft');

  const isMentor = useGlobalStore((s) => s.isMentor);

  if (!subtopic) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    setEditTitle(subtopic.title);
    setEditDescription(subtopic.description || '');
    setEditContent(subtopic.content || '');
    setEditEstimatedTime(subtopic.estimatedTime || 15);
    setEditStatus(subtopic.status);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateSubtopic({
        id: subtopic._id,
        title: editTitle,
        description: editDescription,
        content: editContent,
        estimatedTime: editEstimatedTime,
        status: editStatus,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update subtopic:', error);
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'published' ? 'default' : 'secondary';
  };

  const getStatusIcon = (status: string) => {
    return status === 'published' ? '🟢' : '🟡';
  };

  return (
    <div className="container mx-auto max-w-4xl min-w-0 overflow-x-hidden px-2 py-6 sm:px-4 sm:py-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="hover:bg-muted/70 flex w-fit items-center gap-2 rounded-lg px-2 py-2 text-base font-medium transition-colors sm:px-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Lesson</span>
        </Button>
        <nav className="text-muted-foreground text-xs break-words sm:text-sm">
          Course - Lesson - Topic -
          <span className="text-foreground font-semibold">Subtopic</span>
        </nav>
      </div>
      {/* Header */}
      <div className="bg-card mb-8 rounded-xl p-4 shadow-sm transition-all sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mb-2 text-lg font-bold sm:text-2xl"
              />
            ) : (
              <h1 className="text-primary mb-2 text-xl font-bold tracking-tight break-words sm:text-3xl">
                {subtopic.title}
              </h1>
            )}
            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Subtopic description..."
                className="min-h-[48px] sm:min-h-[60px]"
              />
            ) : (
              subtopic.description && (
                <p className="text-muted-foreground text-sm break-words sm:text-base">
                  {subtopic.description}
                </p>
              )
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            {isEditing ? (
              <Select
                value={editStatus}
                onValueChange={(value) =>
                  setEditStatus(value as 'draft' | 'published')
                }
              >
                <SelectTrigger className="w-28 sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant={getStatusVariant(subtopic.status)}
                className="px-2 py-1 text-xs sm:text-sm"
              >
                {getStatusIcon(subtopic.status)} {subtopic.status}
              </Badge>
            )}
            {isEditing ? (
              <Input
                type="number"
                min="1"
                max="180"
                value={editEstimatedTime}
                onChange={(e) => setEditEstimatedTime(Number(e.target.value))}
                className="w-16 sm:w-20"
              />
            ) : (
              subtopic.estimatedTime && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm"
                >
                  <Clock className="h-3 w-3" />
                  {subtopic.estimatedTime} min
                </Badge>
              )
            )}
            {isMentor && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="px-3 py-2 text-sm transition-colors"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-2 text-sm transition-colors"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Subtopic
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Content & Side */}
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3">
        <div className="order-2 min-w-0 lg:order-1 lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-primary text-lg font-semibold sm:text-xl">
                Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Main content for this subtopic (Markdown supported)"
                  className="min-h-[200px] sm:min-h-[300px]"
                />
              ) : (
                <div className="prose max-w-none text-sm sm:text-base">
                  {subtopic.content ? (
                    <div className="overflow-wrap-anywhere break-words whitespace-pre-wrap">
                      {subtopic.content}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content available yet.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="order-1 min-w-0 space-y-6 lg:order-2">
          {/* Tests Section */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary text-base font-semibold sm:text-lg">
                  Tests
                </CardTitle>
                {isMentor && (
                  <Button
                    size="sm"
                    className="flex items-center gap-2 px-2 py-1 text-xs transition-colors sm:text-sm"
                  >
                    <Plus className="h-3 w-3" />
                    <span className="xs:inline hidden">Create Test</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-6 text-center sm:py-8">
                <div className="text-muted-foreground text-xs sm:text-sm">
                  {isMentor
                    ? 'No tests created yet. Create one to assess learning!'
                    : 'No tests available for this subtopic.'}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Progress Section (for mentees) */}
          {!isMentor && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary text-base font-semibold sm:text-lg">
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">Status</span>
                    <Badge variant="outline" className="text-xs sm:text-sm">
                      Not Started
                    </Badge>
                  </div>
                  <Button className="w-full px-3 py-2 text-sm transition-colors">
                    Mark as Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
