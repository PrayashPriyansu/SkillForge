'use client';

import { useQuery } from 'convex/react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useTestManagement(subtopicId: Id<'subtopics'> | undefined) {
  // Get existing tests for this subtopic
  const tests = useQuery(
    api.tests.getTestsBySubtopic, 
    subtopicId ? { subtopicId } : 'skip'
  );
  const existingTest = tests?.[0] || null; // Assuming one test per subtopic for now

  return {
    existingTest,
    hasExistingTest: !!existingTest,
  };
}