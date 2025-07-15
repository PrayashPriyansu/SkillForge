'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { TestForm, type TestFormData } from '@/components/forms/test-form';

export default function CreateTestPage() {
    const params = useParams();
    const router = useRouter();
    const subtopicId = params.id as Id<'subtopics'>;

    const createTest = useMutation(api.tests.createTest);

    const handleSubmit = async (formData: TestFormData) => {
        try {
            await createTest({
                subtopicId,
                title: formData.title,
                description: formData.description || undefined,
                questions: formData.questions,
                timeLimit: formData.timeLimit || undefined,
                passingScore: formData.passingScore,
                status: formData.status,
            });

            toast.success('Test created successfully!');
            router.push(`/subtopic/${subtopicId}`);
        } catch (error) {
            console.error('Error creating test:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create test. Please try again.'
            );
        }
    };

    const handleCancel = () => {
        router.push(`/subtopic/${subtopicId}`);
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
                            <h1 className="text-2xl font-bold">Create New Test</h1>
                            <p className="text-muted-foreground">
                                Create a new test to assess understanding of this subtopic
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <TestForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitLabel="Create Test"
                />
            </div>
        </div>
    );
}