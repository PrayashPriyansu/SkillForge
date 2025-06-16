import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // 1. USERS TABLE
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    status: v.optional(
      v.union(v.literal('active'), v.literal('inactive'), v.literal('banned'))
    ),
  }).index('email', ['email']),
  // 2. GROUP TABLE
  group: defineTable({
    name: v.string(),
    description: v.string(),
    createdBy: v.id('users'),
    menteeCount: v.number(),
    mentorCount: v.number(),
    averageProgress: v.number(), // Avg of mentees’ progress
    totalXP: v.number(),
    isComplete: v.boolean(),
    status: v.union(
      v.literal('active'),
      v.literal('archived'),
      v.literal('deleted')
    ),
  }),

  // 3. GROUP MEMBERSHIPS (JOIN TABLE)
  groupMemberships: defineTable({
    userId: v.id('users'),
    groupId: v.id('group'),

    role: v.union(v.literal('mentor'), v.literal('mentee')),

    status: v.union(
      v.literal('active'),
      v.literal('removed'), // Kicked out
      v.literal('left'), // Left voluntarily
      v.literal('pending') // Requested to join, awaiting approval
    ),

    // Only relevant for mentees
    xp: v.optional(v.number()),
    progress: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_group', ['groupId']),
});
