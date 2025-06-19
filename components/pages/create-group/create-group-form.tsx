'use client';

import { Label } from '@radix-ui/react-label';
import { useForm } from '@tanstack/react-form';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';

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
import { api } from '@/convex/_generated/api';

type GroupFormValues = {
  name: string;
  description: string;
};

export default function CreateGroupForm() {
  // const user_id = useGlobalStore((state) => state.user._id);

  const createGroup = useMutation(api.group.createGroup);

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    } as GroupFormValues,
    onSubmit: ({ value }) => {
      createGroup({
        name: value.name,
        description: value.description,
      });
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-muted text-muted-foreground hover:border-primary hover:text-primary col-span-12 flex h-[180px] items-center justify-center gap-2 rounded-md border border-dashed md:col-span-6"
        >
          <Plus className="border-primary size-20 flex-1 border-r" />
          <span className="flex-1 text-2xl font-medium">Add Group</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-3">
        <SheetHeader>
          <SheetTitle>Create a New Group</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="mt-2 flex flex-1 flex-col gap-5"
        >
          {/* Group Name Field */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Group Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Web Development Club"
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Brief description of the group"
                />
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <div className="flex-1"></div>
          <div className="mt-4">
            <Button type="submit" className="w-full">
              Create Group
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
