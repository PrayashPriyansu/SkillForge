// convex/schema.ts
import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
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

  // 2. GROUPS
  groups: defineTable({
    name: v.string(),
    description: v.string(),
    createdBy: v.id('users'),
    progress: v.number(),
    isComplete: v.boolean(),
    status: v.union(
      v.literal('active'),
      v.literal('archived'),
      v.literal('deleted')
    ),
  }),

  // 3. GROUP MEMBERSHIPS
  groupMemberships: defineTable({
    userId: v.id('users'),
    groupId: v.id('groups'),
    role: v.union(v.literal('mentor'), v.literal('mentee')),
    status: v.union(
      v.literal('active'),
      v.literal('removed'),
      v.literal('left'),
      v.literal('pending')
    ),
  })
    .index('by_group', ['groupId'])
    .index('by_user_group', ['userId', 'groupId']),

  // 4. Learning Content: Courses (Reusable Curricula)
  courses: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    totalXp: v.number(),
    createdBy: v.id('users'),
    status: v.union(v.literal('draft'), v.literal('published')),
    isPublic: v.boolean(), // future-proof for Browse catalog
  }),

  // 5. Learning Content: Lessons (Units within Courses)
  lessons: defineTable({
    courseId: v.id('courses'),
    title: v.string(),
    description: v.string(),
    status: v.optional(v.union(v.literal('published'), v.literal('draft'))),
    order: v.number(), // Order within the course
    xp: v.number(), // XP earned for completing this lesson
  }).index('by_course', ['courseId']),

  // 6. Topics (within lessons)
  topics: defineTable({
    lessonId: v.id('lessons'),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
    createdBy: v.id('users'),
  }).index('by_lesson', ['lessonId']),

  // 7. Subtopics (within topics)
  subtopics: defineTable({
    topicId: v.id('topics'),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    estimatedTime: v.optional(v.number()), // in minutes
    order: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
    createdBy: v.id('users'),
  }).index('by_topic', ['topicId']),

  // 8. Tests (linked to subtopics)
  tests: defineTable({
    subtopicId: v.id('subtopics'),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(
      v.object({
        question: v.string(),
        type: v.optional(v.union(v.literal('multiple_choice'), v.literal('text'))),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.optional(v.number()),
        explanation: v.optional(v.string()),
      })
    ),
    timeLimit: v.optional(v.number()), // in minutes
    passingScore: v.number(), // percentage
    status: v.union(v.literal('draft'), v.literal('published')),
    createdBy: v.id('users'),
  }).index('by_subtopic', ['subtopicId']),

  // 9. Test Results
  testResults: defineTable({
    testId: v.id('tests'),
    userId: v.id('users'),
    groupId: v.id('groups'),
    score: v.number(),
    answers: v.array(v.union(v.number(), v.string())), // Support both multiple choice (number) and text (string) answers
    completedAt: v.number(),
    passed: v.boolean(),
  })
    .index('by_test', ['testId'])
    .index('by_user', ['userId']),

  // 10. USER PROGRESS (1 per lesson per user per group)
  userProgress: defineTable({
    userId: v.id('users'),
    groupId: v.id('groups'),
    lessonId: v.id('lessons'),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('completed')
    ),
    completedAt: v.optional(v.number()),
    xpEarned: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_group', ['groupId'])
    .index('by_lesson', ['lessonId']),

  groupCourses: defineTable({
    groupId: v.id('groups'),
    courseId: v.id('courses'),
    addedAt: v.number(),
  }).index('by_group', ['groupId']),
});
