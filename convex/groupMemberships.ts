import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { query } from './_generated/server';

export const getUserGroupMemberships = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Get all active group memberships for the user
    const memberships = await ctx.db
      .query('groupMemberships')
      .withIndex('by_user_group', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('status'), 'active'))
      .collect();

    // Get the group details for each membership
    const membershipsWithGroups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId);
        return {
          ...membership,
          group,
        };
      })
    );

    return membershipsWithGroups.filter((m) => m.group !== null);
  },
});

export const getUserRoleInGroup = query({
  args: { groupId: v.id('groups') },
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
      .filter((q) => q.eq(q.field('status'), 'active'))
      .first();

    return membership?.role || null;
  },
});