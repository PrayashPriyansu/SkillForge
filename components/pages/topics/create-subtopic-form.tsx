'use client';

import { useState } from 'react';

import { Label } from '@radix-ui/react-label';
import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type SubtopicFormValues = {
  title: string;
  description: string;
  content: string;
  estimatedTime: number;
  status: 'draft' | 'published';
};

interface CreateSubtopicFormProps {
  topicId: Id<'topics'>;
  subtopicsCount: number;
  onSubtopicCreated?: () => void;
}

export default function CreateSubtopicForm({
  topicId,
  subtopicsCount,
  onSubtopicCreated,
}: CreateSubtopicFormProps) {
  const createSubtopic = useMutation(api.subtopics.createSubtopic);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      estimatedTime: 15,
      status: 'draft' as const,
    } as SubtopicFormValues,
    onSubmit: async ({ value }) => {
      try {
        await createSubtopic({
          topicId,
          title: value.title,
          description: value.description,
          content: value.content,
          estimatedTime: value.estimatedTime,
          order: subtopicsCount + 1,
          status: value.status,
        });

        setIsOpen(false);
        form.reset();
        onSubtopicCreated?.();
      } catch (error) {
        console.error('Failed to create subtopic:', error);
      }
    },
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Plus className="h-3 w-3" />
          Add Subtopic
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-3">
        <SheetHeader>
          <SheetTitle>Create a New Subtopic</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-2 flex flex-1 flex-col gap-5"
        >
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Subtopic Title</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Declaring Variables"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description (Optional)</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Brief description of this subtopic"
                  className="min-h-[60px]"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="content">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Content</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Main content for this subtopic (Markdown supported)"
                  className="min-h-[120px]"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="estimatedTime">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Estimated Time (minutes)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min="1"
                  max="180"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="15"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as 'draft' | 'published')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex-1"></div>
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting
                ? 'Creating Subtopic...'
                : 'Create Subtopic'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
