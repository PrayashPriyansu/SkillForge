'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { TestPreview } from '@/components/pages/test-preview';

export default function TestPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const subtopicId = params.id as Id<'subtopics'>;
    const testId = params.testId as Id<'tests'>;

    // Fetch test data
    const test = useQuery(api.tests.getTest, { id: testId });

    const handleClose = () => {
        router.push(`/subtopic/${subtopicId}/test/${testId}/edit`);
    };

    if (test === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading test data...</p>
                </div>
            </div>
        );
    }

    if (test === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
                    <p className="text-muted-foreground mb-4">
                        The test you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.push(`/subtopic/${subtopicId}`)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Subtopic
                    </Button>
                </div>
            </div>
        );
    }

    const testData = {
        title: test.title,
        description: test.description,
        questions: test.questions.map(q => ({
            question: q.question,
            type: q.type,
            options: q.options || [],
            correctAnswer: q.correctAnswer || 0,
            explanation: q.explanation,
        })),
        timeLimit: test.timeLimit,
        passingScore: test.passingScore,
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={handleClose}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Edit
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Test Preview</h1>
                            <p className="text-muted-foreground">
                                Preview how this test will appear to mentees
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <TestPreview
                    testData={testData}
                    isOpen={true}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
}