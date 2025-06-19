import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getLessons = query({
  args: { courseId: v.id('courses') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);

    if (!user_id) {
      throw new Error('User not authenticated');
    }
    return await ctx.db
      .query('lessons')
      .withIndex('by_course', (q) => q.eq('courseId', args.courseId))
      .order('asc')
      .collect();
  },
});

export const createLesson = mutation({
  args: {
    courseId: v.id('courses'),
    title: v.string(),
    description: v.string(), // Description is now required as per form
    order: v.number(),
    xp: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('Unauthorized: User not found in database.');
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error('Course not found.');
    }
    if (course.createdBy !== user_id) {
      throw new Error('Unauthorized: Only the course creator can add lessons.');
    }

    const lessonId = await ctx.db.insert('lessons', {
      courseId: args.courseId,
      title: args.title,
      description: args.description,
      order: args.order,
      xp: args.xp,
      status: args.status,
    });

    return lessonId;
  },
});

export const updateLesson = mutation({
  args: {
    id: v.id('lessons'),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    xp: v.number(),
    status: v.optional(v.union(v.literal('published'), v.literal('draft'))),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      order: args.order,
      xp: args.xp,
      status: args.status,
    });
  },
});

export const deleteLesson = mutation({
  args: {
    id: v.id('lessons'),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    await ctx.db.delete(args.id);
  },
});
