import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getSubtopics = query({
  args: { topicId: v.id('topics') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('subtopics')
      .withIndex('by_topic', (q) => q.eq('topicId', args.topicId))
      .order('asc')
      .collect();
  },
});

export const getSubtopic = query({
  args: { id: v.id('subtopics') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    return await ctx.db.get(args.id);
  },
});

export const createSubtopic = mutation({
  args: {
    topicId: v.id('topics'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    estimatedTime: v.optional(v.number()),
    order: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const topic = await ctx.db.get(args.topicId);
    if (!topic) {
      throw new Error('Topic not found');
    }

    const subtopicId = await ctx.db.insert('subtopics', {
      topicId: args.topicId,
      title: args.title,
      description: args.description,
      content: args.content,
      estimatedTime: args.estimatedTime,
      order: args.order,
      status: args.status,
      createdBy: user_id,
    });

    return subtopicId;
  },
});

export const updateSubtopic = mutation({
  args: {
    id: v.id('subtopics'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    estimatedTime: v.optional(v.number()),
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
      content: args.content,
      estimatedTime: args.estimatedTime,
      status: args.status,
    });
  },
});

export const deleteSubtopic = mutation({
  args: {
    id: v.id('subtopics'),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    await ctx.db.delete(args.id);
  },
});
