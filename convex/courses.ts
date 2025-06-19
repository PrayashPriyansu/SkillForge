import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published')),
    totalXp: v.number(),
    groupId: v.id('groups'),
  },

  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) throw new Error('User not authenticated');

    const courseId = await ctx.db.insert('courses', {
      title: args.title,
      description: args.description,
      status: args.status,
      totalXp: args.totalXp,
      createdBy: user_id,
      isPublic: false,
    });

    await ctx.db.insert('groupCourses', {
      groupId: args.groupId,
      courseId,
      addedAt: Date.now(),
    });

    return courseId;
  },
});

export const getGroupCourses = query({
  args: {
    groupId: v.id('groups'),
  },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query('groupCourses')
      .withIndex('by_group', (q) => q.eq('groupId', args.groupId))
      .collect();

    const courseIds = links.map((link) => link.courseId);
    const courses = await Promise.all(courseIds.map((id) => ctx.db.get(id)));

    return courses.filter(Boolean);
  },
});

export const updateCourse = mutation({
  args: {
    id: v.id('courses'),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) throw new Error('Not authenticated');

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
    });
  },
});
