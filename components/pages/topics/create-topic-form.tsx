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

type TopicFormValues = {
  title: string;
  description: string;
  status: 'draft' | 'published';
};

interface CreateTopicFormProps {
  lessonId: Id<'lessons'>;
  topicsCount: number;
  onTopicCreated?: () => void;
}

export default function CreateTopicForm({
  lessonId,
  topicsCount,
  onTopicCreated,
}: CreateTopicFormProps) {
  const createTopic = useMutation(api.topics.createTopic);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'draft' as const,
    } as TopicFormValues,
    onSubmit: async ({ value }) => {
      try {
        await createTopic({
          lessonId,
          title: value.title,
          description: value.description,
          order: topicsCount + 1,
          status: value.status,
        });

        setIsOpen(false);
        form.reset();
        onTopicCreated?.();
      } catch (error) {
        console.error('Failed to create topic:', error);
      }
    },
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Topic
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-3">
        <SheetHeader>
          <SheetTitle>Create a New Topic</SheetTitle>
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
                <Label htmlFor={field.name}>Topic Title</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Introduction to Variables"
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
                  placeholder="Brief description of what this topic covers"
                  className="min-h-[80px]"
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
              {form.state.isSubmitting ? 'Creating Topic...' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
