'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface QuestionData {
    question: string;
    type: 'multiple_choice' | 'text';
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

interface QuestionEditorProps {
    question: QuestionData;
    questionIndex: number;
    onUpdate: (questionIndex: number, updatedQuestion: QuestionData) => void;
    onDelete: (questionIndex: number) => void;
    canDelete: boolean;
}

export function QuestionEditor({
    question,
    questionIndex,
    onUpdate,
    onDelete,
    canDelete,
}: QuestionEditorProps) {
    const [localQuestion, setLocalQuestion] = useState<QuestionData>(question);

    const updateQuestion = (updates: Partial<QuestionData>) => {
        const updated = { ...localQuestion, ...updates };
        setLocalQuestion(updated);
        onUpdate(questionIndex, updated);
    };

    const addOption = () => {
        const newOptions = [...localQuestion.options, ''];
        updateQuestion({ options: newOptions });
    };

    const updateOption = (optionIndex: number, value: string) => {
        const newOptions = [...localQuestion.options];
        newOptions[optionIndex] = value;
        updateQuestion({ options: newOptions });
    };

    const removeOption = (optionIndex: number) => {
        if (localQuestion.options.length <= 2) return; // Minimum 2 options required

        const newOptions = localQuestion.options.filter((_, index) => index !== optionIndex);
        let newCorrectAnswer = localQuestion.correctAnswer;

        // Adjust correct answer index if needed
        if (optionIndex === localQuestion.correctAnswer) {
            newCorrectAnswer = 0; // Reset to first option
        } else if (optionIndex < localQuestion.correctAnswer) {
            newCorrectAnswer = localQuestion.correctAnswer - 1;
        }

        updateQuestion({
            options: newOptions,
            correctAnswer: newCorrectAnswer
        });
    };

    return (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">Question {questionIndex + 1}</h4>
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(questionIndex)}
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor={`question-type-${questionIndex}`}>Question Type</Label>
                <Select
                    value={localQuestion.type}
                    onValueChange={(value: 'multiple_choice' | 'text') => {
                        if (value === 'text') {
                            // Reset options and correctAnswer for text questions
                            updateQuestion({
                                type: value,
                                options: [],
                                correctAnswer: 0
                            });
                        } else {
                            // Ensure we have at least 2 options for multiple choice
                            updateQuestion({
                                type: value,
                                options: localQuestion.options.length < 2 ? ['', ''] : localQuestion.options
                            });
                        }
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="text">Text Answer</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                <Textarea
                    id={`question-${questionIndex}`}
                    value={localQuestion.question}
                    onChange={(e) => updateQuestion({ question: e.target.value })}
                    placeholder="Enter your question..."
                    className="min-h-20"
                />
            </div>

            {localQuestion.type === 'multiple_choice' && (
                <div className="space-y-3">
                    <Label>Answer Options</Label>
                    <RadioGroup
                        value={localQuestion.correctAnswer.toString()}
                        onValueChange={(value) => updateQuestion({ correctAnswer: parseInt(value) })}
                    >
                        {localQuestion.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={optionIndex.toString()}
                                    id={`option-${questionIndex}-${optionIndex}`}
                                />
                                <Input
                                    value={option}
                                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1"
                                />
                                {localQuestion.options.length > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(optionIndex)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </RadioGroup>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                        className="w-full"
                    >
                        <Plus className="h-4 w-4" />
                        Add Option
                    </Button>
                </div>
            )}

            {localQuestion.type === 'text' && (
                <div className="space-y-2">
                    <Label>Expected Answer Format</Label>
                    <p className="text-sm text-muted-foreground">
                        This is a text-based question. Students will provide written answers that can be reviewed manually.
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor={`explanation-${questionIndex}`}>
                    Explanation (Optional)
                </Label>
                <Textarea
                    id={`explanation-${questionIndex}`}
                    value={localQuestion.explanation || ''}
                    onChange={(e) => updateQuestion({ explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer..."
                    className="min-h-16"
                />
            </div>
        </div>
    );
}