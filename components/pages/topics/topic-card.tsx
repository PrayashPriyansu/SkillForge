'use client';

import { useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

import CreateSubtopicForm from './create-subtopic-form';
import SubtopicCard from './subtopic-cards';

interface TopicCardProps {
  topic: Doc<'topics'>;
  isExpanded: boolean;
  onToggle: () => void;
  isMentor?: boolean;
}

export default function TopicCard({
  topic,
  isExpanded,
  onToggle,
  isMentor = false,
}: TopicCardProps) {
  const subtopics = useQuery(api.subtopics.getSubtopics, {
    topicId: topic._id,
  });
  const updateTopic = useMutation(api.topics.updateTopic);
  const deleteTopic = useMutation(api.topics.deleteTopic);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [editDescription, setEditDescription] = useState(
    topic.description || ''
  );
  const [editStatus, setEditStatus] = useState(topic.status);

  const handleSave = async () => {
    try {
      await updateTopic({
        id: topic._id,
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Delete topic "${topic.title}"?`)) {
      try {
        await deleteTopic({ id: topic._id });
      } catch (error) {
        console.error('Failed to delete topic:', error);
      }
    }
  };

  const getStatusVariant = (status: string) => {
    return status === 'published' ? 'default' : 'secondary';
  };

  const getStatusIcon = (status: string) => {
    return status === 'published' ? '🟢' : '🟡';
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Topic description..."
                  className="min-h-[60px]"
                />
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
              </div>
            ) : (
              <div className="flex-1 cursor-pointer" onClick={onToggle}>
                <h3 className="text-lg font-semibold">{topic.title}</h3>
                {topic.description && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {topic.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <Badge variant="outline">
                  {subtopics?.length || 0} subtopic
                  {(subtopics?.length || 0) !== 1 ? 's' : ''}
                </Badge>
                <Badge variant={getStatusVariant(topic.status)}>
                  {getStatusIcon(topic.status)} {topic.status}
                </Badge>
              </>
            )}

            {isMentor && (
              <div className="flex gap-1">
                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">Subtopics</h4>
              {isMentor && (
                <CreateSubtopicForm
                  topicId={topic._id}
                  subtopicsCount={subtopics?.length || 0}
                />
              )}
            </div>

            {!subtopics || subtopics.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-muted-foreground text-sm">
                  {isMentor
                    ? 'No subtopics yet. Create one to get started!'
                    : 'No subtopics available.'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {subtopics.map((subtopic) => (
                  <SubtopicCard
                    key={subtopic._id}
                    subtopic={subtopic}
                    isMentor={isMentor}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
