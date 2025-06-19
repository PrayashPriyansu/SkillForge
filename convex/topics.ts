import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getTopics = query({
  args: { lessonId: v.id('lessons') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('topics')
      .withIndex('by_lesson', (q) => q.eq('lessonId', args.lessonId))
      .order('asc')
      .collect();
  },
});

export const createTopic = mutation({
  args: {
    lessonId: v.id('lessons'),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const topicId = await ctx.db.insert('topics', {
      lessonId: args.lessonId,
      title: args.title,
      description: args.description,
      order: args.order,
      status: args.status,
      createdBy: user_id,
    });

    return topicId;
  },
});

export const updateTopic = mutation({
  args: {
    id: v.id('topics'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      status: args.status,
    });
  },
});

export const deleteTopic = mutation({
  args: {
    id: v.id('topics'),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    await ctx.db.delete(args.id);
  },
});
