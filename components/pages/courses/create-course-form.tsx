'use client';

// Make sure these imports are correct for your project
import { useState } from 'react';

// Import Id type
import { Label } from '@radix-ui/react-label';
// This might be @/components/ui/label in shadcn
import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
// Assuming you have toast setup
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// To manage sheet open state

// Define the type for lesson form values
type CourseFormValues = {
  title: string;
  description: string;
  order: number; // For ordering lessons within a course
  xp: number; // XP points for completing this lesson
};

// Define props for the component, including courseId
interface CreateCourseFormProps {
  groupId?: Id<'groups'>; // The ID of the course this lesson belongs to
  onCourseCreated?: () => void; // Optional callback after successful creation
  // You might want to pass the last order number to suggest the next one
  // lastCourseOrder?: number;
}

export default function CreateCourseForm({
  groupId,
  onCourseCreated,
}: CreateCourseFormProps) {
  const createCourse = useMutation(api.courses.createCourse);

  const [isOpen, setIsOpen] = useState(false); // State to control sheet open/close

  // Using @tanstack/react-form
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      order: 0, // Default order, you might want to fetch the next available order for the course
      xp: 100, // Default XP, can be adjusted
    } as CourseFormValues,
    onSubmit: async ({ value }) => {
      // Mark onSubmit as async
      try {
        const newCourseId = await createCourse({
          status: 'draft',
          title: value.title,
          description: value.description,
          totalXp: 0,
          groupId: groupId as Id<'groups'>,
        });

        setIsOpen(false); // Close the sheet on success
        form.reset(); // Reset form fields
        onCourseCreated?.(); // Call the optional callback
      } catch (error) {
        console.error('Failed to create lesson:', error);
      }
    },
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>+ Add New Course</Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-3">
        <SheetHeader>
          <SheetTitle>Create a New Course</SheetTitle>{' '}
          {/* Updated Sheet Title */}
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop propagation to prevent sheet from closing prematurely
            form.handleSubmit();
          }}
          className="mt-2 flex flex-1 flex-col gap-5"
        >
          {/* Course Title Field */}
          <form.Field name="title">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Course Title</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur} // Add onBlur for validation triggering
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Introduction to React"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          {/* Description Field */}
          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Brief description of the lesson content"
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          {/* Submit Button */}
          <div className="flex-1"></div> {/* Pushes button to bottom */}
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
