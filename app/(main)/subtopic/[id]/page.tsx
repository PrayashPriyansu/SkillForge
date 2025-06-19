'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, Clock, Edit, Plus } from 'lucide-react';

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

const MOCK_ROLE = 'mentor';

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

  const isMentor = MOCK_ROLE === 'mentor';

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
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lesson
        </Button>

        <nav className="text-muted-foreground text-sm">
          Course &gt; Lesson &gt; Topic &gt;{' '}
          <span className="text-foreground font-medium">Subtopic</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mb-2 text-2xl font-bold"
              />
            ) : (
              <h1 className="mb-2 text-3xl font-bold">{subtopic.title}</h1>
            )}

            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Subtopic description..."
                className="min-h-[60px]"
              />
            ) : (
              subtopic.description && (
                <p className="text-muted-foreground">{subtopic.description}</p>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isEditing ? (
              <Select
                value={editStatus}
                onValueChange={(value) =>
                  setEditStatus(value as 'draft' | 'published')
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant={getStatusVariant(subtopic.status)}>
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
                className="w-20"
              />
            ) : (
              subtopic.estimatedTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {subtopic.estimatedTime} min
                </Badge>
              )
            )}

            {isMentor && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    className="flex items-center gap-2"
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

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Main content for this subtopic (Markdown supported)"
                  className="min-h-[300px]"
                />
              ) : (
                <div className="prose max-w-none">
                  {subtopic.content ? (
                    <div className="whitespace-pre-wrap">
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

        <div className="space-y-6">
          {/* Tests Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tests</CardTitle>
                {isMentor && (
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="h-3 w-3" />
                    Create Test
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <div className="text-muted-foreground text-sm">
                  {isMentor
                    ? 'No tests created yet. Create one to assess learning!'
                    : 'No tests available for this subtopic.'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section (for mentees) */}
          {!isMentor && (
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge variant="outline">Not Started</Badge>
                  </div>
                  <Button className="w-full">Mark as Complete</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
