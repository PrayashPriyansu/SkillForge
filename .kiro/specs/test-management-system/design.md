# Design Document

## Overview

The Test Creation & Management System integrates seamlessly with SkillForge's existing hierarchical learning structure, extending the current Convex-based architecture to support comprehensive test management. The system leverages the existing database schema where tests are already defined and linked to subtopics, building upon established patterns for CRUD operations, authentication, and role-based access control.

The design maintains the platform's clean separation between mentor creation tools and mentee consumption interfaces, utilizing the existing UI component library (Radix UI + Tailwind CSS) and following established patterns for forms, dialogs, and data management.

## Architecture

### Database Layer
The system utilizes the existing Convex database schema with the `tests` table already properly defined:

```typescript
tests: defineTable({
  subtopicId: v.id('subtopics'),
  title: v.string(),
  description: v.optional(v.string()),
  questions: v.array(v.object({
    question: v.string(),
    options: v.array(v.string()),
    correctAnswer: v.number(),
    explanation: v.optional(v.string()),
  })),
  timeLimit: v.optional(v.number()),
  passingScore: v.number(),
  status: v.union(v.literal('draft'), v.literal('published')),
  createdBy: v.id('users'),
}).index('by_subtopic', ['subtopicId'])
```

### API Layer (Convex Functions)
Following the established pattern from `subtopics.ts` and `lessons.ts`, the system will implement:

- **Query Functions**: `getTest`, `getTestsBySubtopic`
- **Mutation Functions**: `createTest`, `updateTest`, `deleteTest`
- **Authentication**: Consistent use of `getAuthUserId` for all operations
- **Authorization**: Role-based access control using existing group membership patterns

### Frontend Architecture
The system extends the existing Next.js 15 + React 19 architecture:

- **Pages**: Subtopic detail pages enhanced with test management interfaces
- **Components**: Reusable test creation/editing forms and preview components
- **State Management**: Zustand for local state, Convex for server state
- **UI Components**: Leveraging existing Radix UI components (Dialog, Form, Button, etc.)

## Components and Interfaces

### Core Components

#### TestManagementInterface
**Location**: `components/pages/test-management-interface.tsx`
**Purpose**: Main container component for test creation/editing
**Props**:
```typescript
interface TestManagementInterfaceProps {
  subtopicId: string;
  existingTest?: Test | null;
  mode: 'create' | 'edit';
  onSave: (test: Test) => void;
  onCancel: () => void;
}
```

#### TestForm
**Location**: `components/forms/test-form.tsx`
**Purpose**: Form component for test metadata and question management
**Features**:
- Test title, description, time limit, XP reward fields
- Dynamic question list management
- Validation using existing form patterns
- Integration with `@tanstack/react-form`

#### QuestionEditor
**Location**: `components/forms/question-editor.tsx`
**Purpose**: Individual question creation/editing component
**Features**:
- Multiple choice question support
- Dynamic answer option management
- Correct answer selection
- Optional explanation field

#### TestPreview
**Location**: `components/pages/test-preview.tsx`
**Purpose**: Preview component showing test from mentee perspective
**Features**:
- Read-only test display
- Question and answer rendering
- Time limit and XP display
- Modal/dialog presentation

#### TestIndicator
**Location**: `components/ui/test-indicator.tsx`
**Purpose**: UI component showing test availability on subtopic cards
**Features**:
- "Take Test" button for mentees
- "Create Test" / "Edit Test" buttons for mentors
- Test metadata display (time, XP)
- Status indicators (draft/published)

### Data Interfaces

#### Test Type Definition
```typescript
interface Test {
  _id: Id<'tests'>;
  subtopicId: Id<'subtopics'>;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  status: 'draft' | 'published';
  createdBy: Id<'users'>;
  _creationTime: number;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}
```

#### Form Data Types
```typescript
interface TestFormData {
  title: string;
  description: string;
  timeLimit: number | null;
  passingScore: number;
  questions: QuestionFormData[];
}

interface QuestionFormData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
```

## Data Models

### Test Management Flow
1. **Test Creation**: Mentor navigates to subtopic → clicks "Create Test" → fills form → saves as draft
2. **Test Editing**: Mentor views existing test → clicks "Edit Test" → modifies content → saves changes
3. **Test Publishing**: Mentor sets status to "published" → test becomes visible to mentees
4. **Test Preview**: Available during creation/editing → shows mentee view without saving

### Question Management
- **Dynamic Addition**: Questions can be added/removed during test creation
- **Validation**: Minimum 2 options per question, exactly 1 correct answer
- **Ordering**: Questions maintain order through array index
- **Flexibility**: Support for explanations and varying option counts

### Role-Based Access
- **Mentors**: Full CRUD access to tests in their groups
- **Mentees**: Read-only access to published tests only
- **Authorization**: Leverages existing group membership and role checking

## Error Handling

### Validation Errors
- **Client-Side**: Form validation using Zod schemas
- **Server-Side**: Convex function parameter validation
- **User Feedback**: Toast notifications using existing Sonner integration

### Data Integrity
- **Foreign Key Constraints**: Proper subtopic relationship validation
- **Orphaned Data**: Cascade handling when subtopics are deleted
- **Concurrent Editing**: Optimistic updates with error recovery

### Permission Errors
- **Authentication**: Consistent error handling for unauthenticated users
- **Authorization**: Clear messaging for insufficient permissions
- **Role Validation**: Group membership verification for all operations

## Testing Strategy

### Unit Testing
- **Form Validation**: Test all validation rules and edge cases
- **Component Rendering**: Verify correct UI state for different props
- **Data Transformation**: Test form data to database model conversion

### Integration Testing
- **Convex Functions**: Test CRUD operations with mock data
- **Authentication Flow**: Verify role-based access control
- **Database Operations**: Test foreign key relationships and constraints

### End-to-End Testing
- **Test Creation Flow**: Complete mentor workflow from creation to publishing
- **Test Editing Flow**: Modification and update scenarios
- **Permission Boundaries**: Verify mentee cannot access mentor functions

### Manual Testing Scenarios
- **Cross-Browser Compatibility**: Test form interactions across browsers
- **Mobile Responsiveness**: Verify test management on mobile devices
- **Performance**: Test with large numbers of questions and options
- **Edge Cases**: Empty states, network failures, concurrent access

## Implementation Considerations

### Performance Optimization
- **Lazy Loading**: Test data loaded only when needed
- **Optimistic Updates**: Immediate UI feedback with server sync
- **Caching**: Leverage Convex's built-in caching for test data

### User Experience
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile-First**: Responsive design following existing patterns

### Security
- **Input Sanitization**: All user input properly validated and sanitized
- **XSS Prevention**: Safe rendering of user-generated content
- **CSRF Protection**: Leveraging Convex's built-in security features

### Scalability
- **Database Indexing**: Efficient queries using existing indexes
- **Component Reusability**: Modular design for future question types
- **Extension Points**: Architecture supports additional test features