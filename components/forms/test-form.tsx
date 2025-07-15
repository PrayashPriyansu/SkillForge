'use client';

import { Plus, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TestPreview } from '@/components/pages/test-preview';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { QuestionEditor, type QuestionData } from './question-editor';

export interface TestFormData {
    title: string;
    description: string;
    timeLimit: number | null;
    passingScore: number;
    status: 'draft' | 'published';
    questions: QuestionData[];
}

interface TestFormProps {
    initialData?: Partial<TestFormData>;
    onSubmit: (data: TestFormData) => void;
    onCancel: () => void;
    onDelete?: () => void;
    isLoading?: boolean;
    submitLabel?: string;
    showDeleteButton?: boolean;
}

const defaultQuestion: QuestionData = {
    question: '',
    type: 'multiple_choice',
    options: ['', ''],
    correctAnswer: 0,
    explanation: '',
};

export function TestForm({
    initialData,
    onSubmit,
    onCancel,
    onDelete,
    isLoading = false,
    submitLabel = 'Save Test',
    showDeleteButton = false,
}: TestFormProps) {
    const [formData, setFormData] = useState<TestFormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        timeLimit: initialData?.timeLimit || null,
        passingScore: initialData?.passingScore || 70,
        status: initialData?.status || 'draft',
        questions: initialData?.questions || [{ ...defaultQuestion }],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPreview, setShowPreview] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.passingScore < 0 || formData.passingScore > 100) {
            newErrors.passingScore = 'Passing score must be between 0 and 100';
        }

        if (formData.timeLimit !== null && formData.timeLimit <= 0) {
            newErrors.timeLimit = 'Time limit must be a positive number';
        }

        if (formData.questions.length === 0) {
            newErrors.questions = 'At least one question is required';
        }

        // Validate each question
        formData.questions.forEach((question, index) => {
            if (!question.question.trim()) {
                newErrors[`question-${index}`] = `Question ${index + 1} text is required`;
            }

            if (question.type === 'multiple_choice') {
                if (question.options.length < 2) {
                    newErrors[`question-${index}-options`] = `Question ${index + 1} must have at least 2 options`;
                }

                const hasEmptyOptions = question.options.some(option => !option.trim());
                if (hasEmptyOptions) {
                    newErrors[`question-${index}-empty`] = `Question ${index + 1} has empty options`;
                }

                if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
                    newErrors[`question-${index}-correct`] = `Question ${index + 1} has invalid correct answer`;
                }
            }
            // Text questions don't need options validation
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handlePreview = () => {
        if (validateForm()) {
            // For now, we'll keep the dialog preview since we need the test to be saved first
            // to navigate to a preview page. This could be enhanced later.
            setShowPreview(true);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            const confirmDelete = window.confirm(
                'Are you sure you want to delete this test? This action cannot be undone.'
            );
            if (confirmDelete) {
                onDelete();
            }
        }
    };

    const updateFormData = (updates: Partial<TestFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const addQuestion = () => {
        const newQuestions = [...formData.questions, { ...defaultQuestion }];
        updateFormData({ questions: newQuestions });
    };

    const updateQuestion = (questionIndex: number, updatedQuestion: QuestionData) => {
        const newQuestions = [...formData.questions];
        newQuestions[questionIndex] = updatedQuestion;
        updateFormData({ questions: newQuestions });
    };

    const deleteQuestion = (questionIndex: number) => {
        if (formData.questions.length <= 1) return; // Keep at least one question
        const newQuestions = formData.questions.filter((_, index) => index !== questionIndex);
        updateFormData({ questions: newQuestions });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Metadata */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Test Title</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
                        placeholder="Enter test title..."
                        aria-invalid={!!errors.title}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Describe what this test covers..."
                        className="min-h-20"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Input
                            id="timeLimit"
                            type="number"
                            value={formData.timeLimit || ''}
                            onChange={(e) => updateFormData({
                                timeLimit: e.target.value ? parseInt(e.target.value) : null
                            })}
                            placeholder="No limit"
                            min="1"
                            aria-invalid={!!errors.timeLimit}
                        />
                        {errors.timeLimit && (
                            <p className="text-sm text-destructive">{errors.timeLimit}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                            id="passingScore"
                            type="number"
                            value={formData.passingScore}
                            onChange={(e) => updateFormData({ passingScore: parseInt(e.target.value) || 0 })}
                            min="0"
                            max="100"
                            aria-invalid={!!errors.passingScore}
                        />
                        {errors.passingScore && (
                            <p className="text-sm text-destructive">{errors.passingScore}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: 'draft' | 'published') => updateFormData({ status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Questions</h3>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addQuestion}
                    >
                        <Plus className="h-4 w-4" />
                        Add Question
                    </Button>
                </div>

                {errors.questions && (
                    <p className="text-sm text-destructive">{errors.questions}</p>
                )}

                <div className="space-y-4">
                    {formData.questions.map((question, index) => (
                        <div key={index}>
                            <QuestionEditor
                                question={question}
                                questionIndex={index}
                                onUpdate={updateQuestion}
                                onDelete={deleteQuestion}
                                canDelete={formData.questions.length > 1}
                            />
                            {Object.keys(errors).some(key => key.startsWith(`question-${index}`)) && (
                                <div className="mt-2 space-y-1">
                                    {Object.entries(errors)
                                        .filter(([key]) => key.startsWith(`question-${index}`))
                                        .map(([key, error]) => (
                                            <p key={key} className="text-sm text-destructive">{error}</p>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreview}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <Eye className="h-4 w-4" />
                        Preview Test
                    </Button>

                    {showDeleteButton && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Test
                        </Button>
                    )}
                </div>

                <div className="flex space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : submitLabel}
                    </Button>
                </div>
            </div>

            {/* Test Preview Dialog */}
            <TestPreview
                testData={{
                    title: formData.title,
                    description: formData.description,
                    questions: formData.questions,
                    timeLimit: formData.timeLimit || undefined,
                    passingScore: formData.passingScore,
                }}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </form>
    );
}