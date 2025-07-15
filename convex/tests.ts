import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getTest = query({
  args: { id: v.id('tests') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    return await ctx.db.get(args.id);
  },
});

export const getTestsBySubtopic = query({
  args: { subtopicId: v.id('subtopics') },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    return await ctx.db
      .query('tests')
      .withIndex('by_subtopic', (q) => q.eq('subtopicId', args.subtopicId))
      .collect();
  },
});

export const createTest = mutation({
  args: {
    subtopicId: v.id('subtopics'),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(
      v.object({
        question: v.string(),
        type: v.union(v.literal('multiple_choice'), v.literal('text')),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.optional(v.number()),
        explanation: v.optional(v.string()),
      })
    ),
    timeLimit: v.optional(v.number()),
    passingScore: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    // Verify subtopic exists
    const subtopic = await ctx.db.get(args.subtopicId);
    if (!subtopic) {
      throw new Error('Subtopic not found');
    }

    // Validate questions
    if (args.questions.length === 0) {
      throw new Error('Test must have at least one question');
    }

    for (const question of args.questions) {
      if (question.type === 'multiple_choice') {
        if (!question.options || question.options.length < 2) {
          throw new Error('Multiple choice questions must have at least 2 options');
        }
        if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error('Invalid correct answer index for multiple choice question');
        }
      } else if (question.type === 'text') {
        // Text questions don't need options or correctAnswer validation
        // They will be graded manually or by AI
      }
    }

    // Validate passing score
    if (args.passingScore < 0 || args.passingScore > 100) {
      throw new Error('Passing score must be between 0 and 100');
    }

    const testId = await ctx.db.insert('tests', {
      subtopicId: args.subtopicId,
      title: args.title,
      description: args.description,
      questions: args.questions,
      timeLimit: args.timeLimit,
      passingScore: args.passingScore,
      status: args.status,
      createdBy: user_id,
    });

    return testId;
  },
});

export const updateTest = mutation({
  args: {
    id: v.id('tests'),
    title: v.string(),
    description: v.optional(v.string()),
    questions: v.array(
      v.object({
        question: v.string(),
        type: v.union(v.literal('multiple_choice'), v.literal('text')),
        options: v.optional(v.array(v.string())),
        correctAnswer: v.optional(v.number()),
        explanation: v.optional(v.string()),
      })
    ),
    timeLimit: v.optional(v.number()),
    passingScore: v.number(),
    status: v.union(v.literal('draft'), v.literal('published')),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    // Verify test exists and user has permission
    const existingTest = await ctx.db.get(args.id);
    if (!existingTest) {
      throw new Error('Test not found');
    }

    if (existingTest.createdBy !== user_id) {
      throw new Error('Unauthorized: Only the test creator can edit this test');
    }

    // Validate questions
    if (args.questions.length === 0) {
      throw new Error('Test must have at least one question');
    }

    for (const question of args.questions) {
      if (question.type === 'multiple_choice') {
        if (!question.options || question.options.length < 2) {
          throw new Error('Multiple choice questions must have at least 2 options');
        }
        if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          throw new Error('Invalid correct answer index for multiple choice question');
        }
      } else if (question.type === 'text') {
        // Text questions don't need options or correctAnswer validation
        // They will be graded manually or by AI
      }
    }

    // Validate passing score
    if (args.passingScore < 0 || args.passingScore > 100) {
      throw new Error('Passing score must be between 0 and 100');
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      questions: args.questions,
      timeLimit: args.timeLimit,
      passingScore: args.passingScore,
      status: args.status,
    });
  },
});

export const deleteTest = mutation({
  args: {
    id: v.id('tests'),
  },
  handler: async (ctx, args) => {
    const user_id = await getAuthUserId(ctx);
    if (!user_id) {
      throw new Error('User not authenticated');
    }

    // Verify test exists and user has permission
    const existingTest = await ctx.db.get(args.id);
    if (!existingTest) {
      throw new Error('Test not found');
    }

    if (existingTest.createdBy !== user_id) {
      throw new Error('Unauthorized: Only the test creator can delete this test');
    }

    // Check if test has any results
    const testResults = await ctx.db
      .query('testResults')
      .withIndex('by_test', (q) => q.eq('testId', args.id))
      .first();

    if (testResults) {
      throw new Error('Cannot delete test with existing results. Consider unpublishing instead.');
    }

    await ctx.db.delete(args.id);
  },
});