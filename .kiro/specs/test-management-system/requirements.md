# Requirements Document

## Introduction

The Test Creation & Management System enables mentors to create, edit, and link tests to subtopics within the SkillForge learning platform. This system provides mentors with comprehensive tools to assess mentee understanding through various question types while maintaining a clean separation between mentor creation tools and mentee consumption interfaces. The feature integrates seamlessly with the existing hierarchical course structure (Course → Lessons → Topics → Subtopics → Tests) and supports the platform's gamification elements through XP rewards and progress tracking.

## Requirements

### Requirement 1

**User Story:** As a mentor, I want to create tests for subtopics, so that I can assess mentee understanding of specific learning content.

#### Acceptance Criteria

1. WHEN a mentor views a subtopic details page THEN the system SHALL display a "Create Test" button if no test exists
2. WHEN a mentor clicks "Create Test" THEN the system SHALL open a test creation form with fields for title, description, and question management
3. WHEN a mentor saves a new test THEN the system SHALL link the test to the current subtopic and display success confirmation
4. IF a mentor creates a test THEN the system SHALL automatically set the test status to "draft" by default

### Requirement 2

**User Story:** As a mentor, I want to add different types of questions to my tests, so that I can create comprehensive assessments.

#### Acceptance Criteria

1. WHEN a mentor is creating or editing a test THEN the system SHALL provide options to add multiple choice questions
2. WHEN a mentor adds a multiple choice question THEN the system SHALL require a question text, at least 2 answer options, and one correct answer selection
3. WHEN a mentor saves question changes THEN the system SHALL validate that all required fields are completed before saving
4. IF a mentor attempts to save incomplete questions THEN the system SHALL display specific validation error messages

### Requirement 3

**User Story:** As a mentor, I want to edit existing tests, so that I can improve and update assessments based on feedback or content changes.

#### Acceptance Criteria

1. WHEN a mentor views a subtopic with an existing test THEN the system SHALL display an "Edit Test" button instead of "Create Test"
2. WHEN a mentor clicks "Edit Test" THEN the system SHALL open the test editing form pre-populated with existing test data
3. WHEN a mentor modifies test content THEN the system SHALL save changes and maintain the test's link to the subtopic
4. WHEN a mentor updates a published test THEN the system SHALL prompt for confirmation about affecting active mentee attempts

### Requirement 4

**User Story:** As a mentor, I want to manage test settings and metadata, so that I can control how tests are presented and scored.

#### Acceptance Criteria

1. WHEN a mentor creates or edits a test THEN the system SHALL provide fields for test title, description, time limit, and XP reward
2. WHEN a mentor sets a time limit THEN the system SHALL accept values in minutes and validate positive numbers only
3. WHEN a mentor assigns XP rewards THEN the system SHALL validate that XP values are positive integers
4. WHEN a mentor publishes a test THEN the system SHALL change the test status from "draft" to "published"

### Requirement 5

**User Story:** As a mentor, I want to preview tests before publishing, so that I can ensure the test experience is correct for mentees.

#### Acceptance Criteria

1. WHEN a mentor is editing a test THEN the system SHALL provide a "Preview" button
2. WHEN a mentor clicks "Preview" THEN the system SHALL display the test in mentee view mode without saving capabilities
3. WHEN a mentor previews a test THEN the system SHALL show how questions will appear to mentees including answer options
4. WHEN a mentor closes the preview THEN the system SHALL return to the test editing interface

### Requirement 6

**User Story:** As a mentor, I want to delete tests when they are no longer needed, so that I can maintain clean course content.

#### Acceptance Criteria

1. WHEN a mentor views a test editing interface THEN the system SHALL provide a "Delete Test" option
2. WHEN a mentor clicks "Delete Test" THEN the system SHALL display a confirmation dialog warning about permanent deletion
3. WHEN a mentor confirms test deletion THEN the system SHALL remove the test and unlink it from the subtopic
4. IF a test has mentee attempts THEN the system SHALL warn the mentor before allowing deletion

### Requirement 7

**User Story:** As a mentee, I want to see when tests are available for subtopics, so that I can assess my understanding of the content.

#### Acceptance Criteria

1. WHEN a mentee views a subtopic with a published test THEN the system SHALL display a "Take Test" button or indicator
2. WHEN a mentee views a subtopic without a test THEN the system SHALL NOT display any test-related interface elements
3. WHEN a mentee views a subtopic with a draft test THEN the system SHALL NOT display the test to the mentee
4. IF a subtopic has a test THEN the system SHALL show test metadata like estimated time and XP reward to mentees

### Requirement 8

**User Story:** As a system administrator, I want test data to be properly stored and linked, so that the platform maintains data integrity across the course hierarchy.

#### Acceptance Criteria

1. WHEN a test is created THEN the system SHALL store the test with proper foreign key relationships to the subtopic
2. WHEN a subtopic is deleted THEN the system SHALL handle associated test cleanup appropriately
3. WHEN test data is saved THEN the system SHALL validate data types and constraints before database storage
4. WHEN retrieving test data THEN the system SHALL efficiently load test information with subtopic context