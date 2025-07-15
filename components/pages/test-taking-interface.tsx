'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Question {
    question: string;
    type: 'multiple_choice' | 'text';
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
}

interface TestData {
    _id: string;
    title: string;
    description?: string;
    questions: Question[];
    timeLimit?: number;
    passingScore: number;
}

interface TestTakingInterfaceProps {
    testData: TestData;
    onSubmit: (answers: (number | string)[]) => void;
    onExit: () => void;
}

export function TestTakingInterface({ testData, onSubmit, onExit }: TestTakingInterfaceProps) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | string)[]>(
        new Array(testData.questions.length).fill('')
    );
    const [timeRemaining, setTimeRemaining] = useState<number | null>(
        testData.timeLimit ? testData.timeLimit * 60 : null
    );
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Timer effect
    useEffect(() => {
        if (timeRemaining === null) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 1) {
                    // Auto-submit when time runs out
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const currentQuestion = testData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === testData.questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;
    const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100;

    const handleAnswerChange = (answer: number | string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        onSubmit(answers);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getAnsweredCount = () => {
        return answers.filter(answer =>
            answer !== '' && answer !== undefined && answer !== null
        ).length;
    };

    const isCurrentAnswered = () => {
        const currentAnswer = answers[currentQuestionIndex];
        return currentAnswer !== '' && currentAnswer !== undefined && currentAnswer !== null;
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="border-b bg-card shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={onExit}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Exit Test
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold">{testData.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {testData.questions.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {timeRemaining !== null && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>
                            )}

                            <Badge variant="outline">
                                {getAnsweredCount()} / {testData.questions.length} answered
                            </Badge>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {currentQuestionIndex + 1}
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-xl leading-relaxed">
                                    {currentQuestion.question}
                                </CardTitle>
                                {currentQuestion.type === 'text' && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Please provide your answer in the text area below.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Answer Options */}
                        {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
                            <RadioGroup
                                value={answers[currentQuestionIndex]?.toString() || ''}
                                onValueChange={(value) => handleAnswerChange(parseInt(value))}
                                className="space-y-3"
                            >
                                {currentQuestion.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem
                                            value={optionIndex.toString()}
                                            id={`option-${optionIndex}`}
                                        />
                                        <Label
                                            htmlFor={`option-${optionIndex}`}
                                            className="flex-1 cursor-pointer text-base"
                                        >
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="text-answer" className="text-base font-medium">
                                    Your Answer:
                                </Label>
                                <Textarea
                                    id="text-answer"
                                    value={answers[currentQuestionIndex]?.toString() || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="min-h-32 text-base"
                                />
                            </div>
                        )}

                        {/* Answer Status */}
                        {isCurrentAnswered() && (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">Answer recorded</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Footer Navigation */}
            <div className="border-t bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstQuestion}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-2">
                            {isLastQuestion ? (
                                <Button
                                    onClick={() => setShowSubmitConfirm(true)}
                                    className="flex items-center gap-2"
                                    size="lg"
                                >
                                    Submit Test
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle>Submit Test?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <p>You have answered {getAnsweredCount()} out of {testData.questions.length} questions.</p>
                                {getAnsweredCount() < testData.questions.length && (
                                    <p className="text-amber-600">
                                        ⚠️ You have {testData.questions.length - getAnsweredCount()} unanswered questions.
                                    </p>
                                )}
                                <p>Once submitted, you cannot change your answers.</p>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSubmitConfirm(false)}
                                >
                                    Review Answers
                                </Button>
                                <Button onClick={handleSubmit}>
                                    Submit Test
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}