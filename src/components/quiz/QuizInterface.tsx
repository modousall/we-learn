
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, Star, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface QuizInterfaceProps {
  courseId: string;
  questions: Question[];
  onComplete: (score: number, totalPoints: number) => void;
}

export const QuizInterface = ({ courseId, questions, onComplete }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setShowResult(true);
    toast({
      title: "Temps écoulé !",
      description: "Passons à la question suivante.",
      variant: "destructive"
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowResult(true);

    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setTotalPoints(totalPoints + currentQ.points);
      toast({
        title: "Bravo ! 🎉",
        description: `+${currentQ.points} points !`,
      });
    } else {
      toast({
        title: "Pas tout à fait...",
        description: "Ne vous découragez pas, continuez !",
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      onComplete(score, totalPoints);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline">
              Question {currentQuestion + 1} / {questions.length}
            </Badge>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="mb-4" />
          
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{currentQ.points} points</span>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  showResult
                    ? index === currentQ.correctAnswer
                      ? "default"
                      : selectedAnswer === index
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className={`w-full text-left justify-start h-auto p-4 ${
                  selectedAnswer === index && !showResult ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <div className="flex items-center space-x-3">
                  {showResult && (
                    <>
                      {index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {selectedAnswer === index && index !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </>
                  )}
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Explication :</p>
              <p className="text-sm text-gray-700">{currentQ.explanation}</p>
              
              <Button 
                onClick={handleNextQuestion} 
                className="mt-4 w-full"
              >
                {currentQuestion + 1 < questions.length ? 'Question suivante' : 'Terminer le quiz'}
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>Score: {score}/{questions.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{totalPoints} points</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
