'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { TestForm, type TestFormData } from '@/components/forms/test-form';

export default function EditTestPage() {
    const params = useParams();
    const router = useRouter();
    const subtopicId = params.id as Id<'subtopics'>;
    const testId = params.testId as Id<'tests'>;

    // Fetch existing test data
    const existingTest = useQuery(api.tests.getTest, { id: testId });

    // Mutations
    const updateTest = useMutation(api.tests.updateTest);
    const deleteTest = useMutation(api.tests.deleteTest);

    const handleSubmit = async (formData: TestFormData) => {
        try {
            await updateTest({
                id: testId,
                title: formData.title,
                description: formData.description || undefined,
                questions: formData.questions,
                timeLimit: formData.timeLimit || undefined,
                passingScore: formData.passingScore,
                status: formData.status,
            });

            toast.success('Test updated successfully!');
            router.push(`/subtopic/${subtopicId}`);
        } catch (error) {
            console.error('Error updating test:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update test. Please try again.'
            );
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTest({ id: testId });
            toast.success('Test deleted successfully!');
            router.push(`/subtopic/${subtopicId}`);
        } catch (error) {
            console.error('Error deleting test:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete test. Please try again.'
            );
        }
    };

    const handleCancel = () => {
        router.push(`/subtopic/${subtopicId}`);
    };

    if (existingTest === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading test data...</p>
                </div>
            </div>
        );
    }

    if (existingTest === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
                    <p className="text-muted-foreground mb-4">
                        The test you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subtopic
                    </Button>
                </div>
            </div>
        );
    }

    // Prepare initial data for the form
    const initialData: Partial<TestFormData> = {
        title: existingTest.title,
        description: existingTest.description || '',
        timeLimit: existingTest.timeLimit || null,
        passingScore: existingTest.passingScore,
        status: existingTest.status,
        questions: existingTest.questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer || 0,
            explanation: q.explanation || '',
        })),
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleCancel}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Subtopic
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Test</h1>
                            <p className="text-muted-foreground">
                                Modify the test content and settings
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <TestForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                    submitLabel="Update Test"
                    showDeleteButton={true}
                />
            </div>
        </div>
    );
}