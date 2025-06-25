import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Return the last 100 tasks in a given task list.
export const getGroups = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);

    if (!user_id) {
      throw new Error('User not authenticated');
    }
    if (args.limit === undefined) {
      args.limit = 100;
    }

    const groups = await ctx.db.query('groups').order('desc').take(args.limit);
    return groups;
  },
});

export const getGroup = query({
  args: {
    _id: v.id('groups'),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);

    console.log(user_id);

    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const group = await ctx.db
      .query('groups')
      .withIndex('by_id', (q) => q.eq('_id', args._id))
      .collect();
    return group;
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },

  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);

    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const group = await ctx.db.insert('groups', {
      name: args.name,
      description: args.description,
      createdBy: user_id,
      progress: 0,
      isComplete: false,
      status: 'active',
    });

    return group;
  },
});

export const getRole = query({
  args: {
    groupId: v.id('groups'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const membership = await ctx.db
      .query('groupMemberships')
      .withIndex('by_user_group', (q) =>
        q.eq('userId', userId).eq('groupId', args.groupId)
      )
      .unique();

    if (!membership) {
      return null;
    }
    return membership.role;
  },
});
