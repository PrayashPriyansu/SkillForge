'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

interface Question {
    question: string;
    type: 'multiple_choice' | 'text';
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

interface TestData {
    title: string;
    description?: string;
    questions: Question[];
    timeLimit?: number;
    passingScore: number;
}

interface TestPreviewProps {
    testData: TestData;
    isOpen: boolean;
    onClose: () => void;
}

export function TestPreview({ testData, isOpen, onClose }: TestPreviewProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswerChange = (questionIndex: number, answer: number | string) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const handleSubmitPreview = () => {
        setShowResults(true);
    };

    const handleResetPreview = () => {
        setSelectedAnswers({});
        setShowResults(false);
    };

    const calculateScore = () => {
        let correct = 0;
        testData.questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / testData.questions.length) * 100);
    };

    const score = showResults ? calculateScore() : 0;
    const passed = score >= testData.passingScore;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        📋 Test Preview: {testData.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Test Header */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{testData.title}</CardTitle>
                            {testData.description && (
                                <p className="text-muted-foreground">{testData.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span>❓ {testData.questions.length} questions</span>
                                </div>
                                {testData.timeLimit && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{testData.timeLimit} minutes</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <span>🎯 {testData.passingScore}% to pass</span>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Results Summary (if showing results) */}
                    {showResults && (
                        <Card className={`border-2 ${passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        {passed ? (
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        ) : (
                                            <XCircle className="h-8 w-8 text-red-600" />
                                        )}
                                        <h3 className="text-2xl font-bold">
                                            {score}%
                                        </h3>
                                    </div>
                                    <p className="text-lg font-medium">
                                        {passed ? '🎉 Passed!' : '❌ Failed'}
                                    </p>
                                    <p className="text-muted-foreground">
                                        You got {Object.values(selectedAnswers).filter((answer, index) =>
                                            answer === testData.questions[index]?.correctAnswer
                                        ).length} out of {testData.questions.length} questions correct
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Questions */}
                    <div className="space-y-6">
                        {testData.questions.map((question, questionIndex) => {
                            const selectedAnswer = selectedAnswers[questionIndex];
                            const isCorrect = showResults && selectedAnswer === question.correctAnswer;
                            const isIncorrect = showResults && selectedAnswer !== undefined && selectedAnswer !== question.correctAnswer;

                            return (
                                <Card key={questionIndex} className={`${showResults
                                    ? isCorrect
                                        ? 'border-green-200 bg-green-50'
                                        : isIncorrect
                                            ? 'border-red-200 bg-red-50'
                                            : ''
                                    : ''
                                    }`}>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-start gap-2">
                                            <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                                {questionIndex + 1}
                                            </span>
                                            <span>{question.question}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {question.type === 'multiple_choice' ? (
                                            <RadioGroup
                                                value={selectedAnswer?.toString() || ''}
                                                onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
                                                disabled={showResults}
                                            >
                                                {question.options.map((option, optionIndex) => {
                                                    const isThisCorrect = showResults && optionIndex === question.correctAnswer;
                                                    const isThisSelected = selectedAnswer === optionIndex;

                                                    return (
                                                        <div key={optionIndex} className={`flex items-center space-x-2 p-2 rounded ${showResults
                                                            ? isThisCorrect
                                                                ? 'bg-green-100 border border-green-300'
                                                                : isThisSelected && !isThisCorrect
                                                                    ? 'bg-red-100 border border-red-300'
                                                                    : ''
                                                            : 'hover:bg-muted/50'
                                                            }`}>
                                                            <RadioGroupItem
                                                                value={optionIndex.toString()}
                                                                id={`q${questionIndex}-option${optionIndex}`}
                                                            />
                                                            <Label
                                                                htmlFor={`q${questionIndex}-option${optionIndex}`}
                                                                className="flex-1 cursor-pointer"
                                                            >
                                                                {option}
                                                                {showResults && isThisCorrect && (
                                                                    <Badge variant="outline" className="ml-2 text-green-700 border-green-300">
                                                                        ✓ Correct
                                                                    </Badge>
                                                                )}
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </RadioGroup>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label htmlFor={`text-answer-${questionIndex}`}>
                                                    Your Answer:
                                                </Label>
                                                <Textarea
                                                    id={`text-answer-${questionIndex}`}
                                                    value={selectedAnswer?.toString() || ''}
                                                    onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                                                    placeholder="Type your answer here..."
                                                    className="min-h-24"
                                                    disabled={showResults}
                                                />
                                                {showResults && (
                                                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                                        <p className="text-sm text-blue-700">
                                                            <strong>Note:</strong> Text answers require manual review by instructors.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Show explanation after results */}
                                        {showResults && question.explanation && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                                <p className="text-sm">
                                                    <strong>Explanation:</strong> {question.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                            {showResults ? (
                                <span>Preview completed - this is how results will appear to mentees</span>
                            ) : (
                                <span>This is how the test will appear to mentees</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {showResults ? (
                                <Button onClick={handleResetPreview} variant="outline">
                                    Reset Preview
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmitPreview}
                                    disabled={Object.keys(selectedAnswers).length !== testData.questions.length}
                                >
                                    Submit Preview
                                </Button>
                            )}
                            <Button onClick={onClose} variant="outline">
                                Close Preview
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}