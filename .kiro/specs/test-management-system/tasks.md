# Implementation Plan

- [x] 1. Create Convex functions for test management



  - Implement CRUD operations following existing patterns from subtopics.ts and lessons.ts
  - Add proper authentication and authorization checks using getAuthUserId
  - Create query functions: getTest, getTestsBySubtopic with proper indexing
  - Create mutation functions: createTest, updateTest, deleteTest with validation



  - _Requirements: 1.1, 1.2, 1.3, 2.3, 3.1, 3.2, 3.3, 8.1, 8.2, 8.3, 8.4_

- [ ] 2. Build core test form components
  - Create reusable TestForm component with title, description, timeLimit, and passingScore fields
  - Implement QuestionEditor component for individual question management
  - Add dynamic question list functionality with add/remove capabilities
  - Integrate form validation using existing patterns and Zod schemas
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

- [x] 3. Implement test management interface




  - Create TestManagementInterface component as main container for create/edit modes
  - Build modal/dialog integration using existing Radix UI Dialog patterns
  - Add form submission handling with proper error states and loading indicators
  - Implement save/cancel functionality with proper state management
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3_



- [ ] 4. Add test preview functionality
  - Create TestPreview component showing read-only test display
  - Implement mentee-perspective rendering of questions and options
  - Add preview modal integration accessible from test editing interface
  - Display test metadata (time limit, XP reward) in preview mode

  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 5. Integrate test indicators in subtopic UI
  - Create TestIndicator component for subtopic cards and detail pages
  - Add conditional rendering for "Create Test" vs "Edit Test" buttons based on test existence
  - Implement "Take Test" button display for mentees with published tests


  - Add test metadata display (estimated time, XP reward) for mentee view
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 6. Implement test deletion functionality
  - Add delete confirmation dialog using existing UI patterns

  - Implement soft delete or hard delete based on test attempt history
  - Add proper error handling and user feedback for deletion operations
  - Update UI state after successful deletion
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Add role-based access control

  - Implement mentor/mentee role checking in test management components
  - Add proper permission validation in Convex functions
  - Hide test creation/editing interfaces from mentees
  - Show appropriate error messages for unauthorized access attempts
  - _Requirements: 7.1, 7.2, 7.3, 8.1_


- [ ] 8. Create comprehensive form validation
  - Implement client-side validation for all test form fields
  - Add server-side validation in Convex mutation functions
  - Create proper error messaging for validation failures
  - Add real-time validation feedback during form completion
  - _Requirements: 2.2, 2.3, 4.2, 4.3_


- [ ] 9. Implement test status management
  - Add draft/published status toggle in test editing interface
  - Implement status-based visibility rules for mentees
  - Add confirmation dialog for publishing tests with existing attempts
  - Create status indicators in test management UI
  - _Requirements: 3.4, 4.4, 7.3_

- [ ] 10. Add comprehensive error handling and user feedback
  - Implement toast notifications for all test operations using existing Sonner integration
  - Add proper loading states during async operations
  - Create error boundaries for test management components
  - Add retry mechanisms for failed operations


  - _Requirements: 1.3, 2.3, 3.3, 6.3_

- [ ] 11. Write unit tests for test management functionality
  - Create tests for all Convex functions with mock data
  - Test form validation logic and edge cases
  - Write component tests for TestForm and QuestionEditor
  - Test role-based access control and permission validation
  - _Requirements: 2.2, 2.3, 4.2, 4.3, 8.3_

- [ ] 12. Integrate test management with existing subtopic pages
  - Update subtopic detail pages to include test management interfaces
  - Add test indicators to subtopic list views
  - Ensure proper navigation flow between subtopics and test management
  - Test integration with existing routing and state management
  - _Requirements: 1.1, 3.1, 5.1, 7.1, 7.4_