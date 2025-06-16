import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// Return the last 100 tasks in a given task list.
export const getGroups = query({
  args: {},
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);

    if (!user_id) {
      throw new Error('User not authenticated');
    }

    const groups = await ctx.db.query('group').order('desc').take(10);
    // .take(100);
    // .filter((q) => q.eq(q.field('taskListId'), args.taskListId))
    return groups;
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

    const group = await ctx.db.insert('group', {
      name: args.name,
      description: args.description,
      createdBy: user_id,
      menteeCount: 0,
      mentorCount: 1,
      averageProgress: 0,
      totalXP: 0,
      isComplete: false,
      status: 'active',
    });

    return group;
  },
});
