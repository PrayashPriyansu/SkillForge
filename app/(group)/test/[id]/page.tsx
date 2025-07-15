'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { ArrowLeft, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Answer {
    questionIndex: number;
    answer: number | string; // number for multiple choice, string for text
}

export default function TestTakingPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as Id<'tests'>;

    // Fetch test data
    const test = useQuery(api.tests.getTest, { id: testId });

    // State management
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Timer effect
    useEffect(() => {
        if (test?.timeLimit && timeRemaining === null) {
            setTimeRemaining(test.timeLimit * 60); // Convert minutes to seconds
        }
    }, [test?.timeLimit, timeRemaining]);

    useEffect(() => {
        if (timeRemaining !== null && timeRemaining > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev && prev <= 1) {
                        handleSubmitTest();
                        return 0;
                    }
                    return prev ? prev - 1 : 0;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, isSubmitted]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = (answer: number | string) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.questionIndex === currentQuestionIndex);
            if (existing) {
                return prev.map(a =>
                    a.questionIndex === currentQuestionIndex
                        ? { ...a, answer }
                        : a
                );
            } else {
                return [...prev, { questionIndex: currentQuestionIndex, answer }];
            }
        });
    };

    const getCurrentAnswer = () => {
        return answers.find(a => a.questionIndex === currentQuestionIndex)?.answer;
    };

    const handleNext = () => {
        if (test && currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitTest = () => {
        setIsSubmitted(true);
        setShowResults(true);
        // Here you would typically submit to the backend
        // const submitTest = useMutation(api.tests.submitTest);
        // await submitTest({ testId, answers });
    };

    const calculateScore = () => {
        if (!test) return 0;

        let correct = 0;
        test.questions.forEach((question, index) => {
            const userAnswer = answers.find(a => a.questionIndex === index)?.answer;

            if (question.type === 'multiple_choice') {
                if (userAnswer === question.correctAnswer) {
                    correct++;
                }
            }
            // For text questions, we'd need backend evaluation
        });

        return Math.round((correct / test.questions.length) * 100);
    };

    if (!test) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading test...</p>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        const passed = score >= test.passingScore;

        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-2xl mx-auto">
                    <Card className={`border-2 ${passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center">
                                    {passed ? (
                                        <CheckCircle className="h-16 w-16 text-green-600" />
                                    ) : (
                                        <XCircle className="h-16 w-16 text-red-600" />
                                    )}
                                </div>

                                <div>
                                    <h1 className="text-4xl font-bold mb-2">{score}%</h1>
                                    <p className="text-xl font-medium mb-2">
                                        {passed ? '🎉 Congratulations! You passed!' : '❌ Test not passed'}
                                    </p>
                                    <p className="text-muted-foreground">
                                        You answered {answers.length} out of {test.questions.length} questions
                                    </p>
                                    <p className="text-muted-foreground">
                                        Passing score: {test.passingScore}%
                                    </p>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button onClick={() => router.back()}>
                                        Back to Subtopic
                                    </Button>
                                    {!passed && (
                                        <Button variant="outline" onClick={() => window.location.reload()}>
                                            Retake Test
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
    const currentAnswer = getCurrentAnswer();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Exit Test
                            </Button>
                            <div>
                                <h1 className="font-semibold">{test.title}</h1>
                                <p className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {test.questions.length}
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
                                {Math.round(progress)}% Complete
                            </Badge>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl leading-relaxed">
                            {currentQuestion.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {currentQuestion.type === 'multiple_choice' ? (
                            <RadioGroup
                                value={currentAnswer?.toString() || ''}
                                onValueChange={(value) => handleAnswerChange(parseInt(value))}
                            >
                                {currentQuestion.options?.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <RadioGroupItem
                                            value={index.toString()}
                                            id={`option-${index}`}
                                        />
                                        <Label
                                            htmlFor={`option-${index}`}
                                            className="flex-1 cursor-pointer text-base"
                                        >
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="text-answer" className="text-base">
                                    Your Answer:
                                </Label>
                                <Textarea
                                    id="text-answer"
                                    value={currentAnswer?.toString() || ''}
                                    onChange={(e) => handleAnswerChange(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="min-h-32 text-base"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    <div className="text-sm text-muted-foreground">
                        Question {currentQuestionIndex + 1} of {test.questions.length}
                    </div>

                    {isLastQuestion ? (
                        <Button
                            onClick={handleSubmitTest}
                            disabled={!currentAnswer}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Submit Test
                            <CheckCircle className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!currentAnswer}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}