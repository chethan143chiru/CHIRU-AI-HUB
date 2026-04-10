import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { generateQuiz } from "@/lib/gemini";
import { Quiz, Question, Score } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Play, Share2, CheckCircle2, XCircle, ArrowRight, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface QuizSystemProps {
  user: User | null;
  onLogin: () => void;
}

export function QuizSystem({ user, onLogin }: QuizSystemProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const quizData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
      setQuizzes(quizData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching quizzes:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateQuiz = async () => {
    if (!user) {
      onLogin();
      return;
    }
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setGenerating(true);
    try {
      const quizData = await generateQuiz(topic);
      const newQuiz: Quiz = {
        ...quizData,
        topic,
        creatorId: user.uid,
        creatorName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "quizzes"), newQuiz);
      setTopic("");
      toast.success("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const correct = answer === activeQuiz!.questions[currentQuestionIndex].correctAnswer;
    setIsAnswerCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setShowResults(true);
      if (user) {
        try {
          await addDoc(collection(db, "scores"), {
            userId: user.uid,
            userName: user.displayName || "Anonymous",
            userPhoto: user.photoURL,
            quizId: activeQuiz!.id,
            quizTitle: activeQuiz!.title,
            score: score + (isAnswerCorrect ? 1 : 0),
            totalQuestions: activeQuiz!.questions.length,
            createdAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    }
  };

  const shareQuiz = (quiz: Quiz) => {
    const url = window.location.href;
    navigator.clipboard.writeText(`Check out this quiz on ${quiz.topic}: ${url}`);
    toast.success("Link copied to clipboard!");
  };

  if (activeQuiz) {
    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => setActiveQuiz(null)} className="mb-6 text-gray-400">
          ← Back to Quizzes
        </Button>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz-taking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-orange-500 border-orange-500/30">
                      Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      Score: {score}
                    </div>
                  </div>
                  <CardTitle className="text-2xl leading-tight">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={!!selectedAnswer}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        selectedAnswer === option
                          ? isAnswerCorrect 
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-red-500/20 border-red-500 text-red-400"
                          : selectedAnswer && option === currentQuestion.correctAnswer
                            ? "bg-green-500/10 border-green-500/50 text-green-400"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === option && (
                        isAnswerCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                      )}
                      {selectedAnswer && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                        <CheckCircle2 className="w-5 h-5 opacity-50" />
                      )}
                    </button>
                  ))}

                  {selectedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <p className="text-sm text-gray-400 leading-relaxed">
                        <span className="font-bold text-white block mb-1">Explanation:</span>
                        {currentQuestion.explanation}
                      </p>
                      <Button onClick={nextQuestion} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-black font-bold">
                        {currentQuestionIndex === activeQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500">
                  <Trophy className="w-12 h-12 text-orange-500" />
                </div>
                <h2 className="text-4xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-gray-400">Great job on finishing the {activeQuiz.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="text-3xl font-bold text-orange-500">{score}/{activeQuiz.questions.length}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Final Score</div>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="text-3xl font-bold text-orange-500">{Math.round((score / activeQuiz.questions.length) * 100)}%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Accuracy</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setActiveQuiz(null)} variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                  Back to Home
                </Button>
                <Button onClick={() => startQuiz(activeQuiz)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold">
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create a Custom Quiz</h2>
            <p className="text-gray-400 mb-8 max-w-lg">
              Enter any topic and our Learning Assistant Agent will generate a 
              personalized quiz for you using Gemini AI.
            </p>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <BrainCircuit className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <Input 
                  placeholder="e.g. Quantum Physics, 90s Pop Music, React Hooks..." 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="pl-10 h-12 bg-black/50 border-white/10 focus:border-orange-500 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateQuiz()}
                />
              </div>
              <Button 
                onClick={handleCreateQuiz} 
                disabled={generating}
                className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-black font-bold"
              >
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                Generate
              </Button>
            </div>
          </div>
          <div className="hidden md:block w-64 h-64 bg-orange-500/10 rounded-full blur-3xl absolute -right-20 -top-20" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Community Quizzes</h3>
          <span className="text-sm text-gray-500">{quizzes.length} available</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-all group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
                      {quiz.topic}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => shareQuiz(quiz)} className="h-8 w-8 text-gray-500 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl line-clamp-1">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px]">
                        {quiz.creatorName[0]}
                      </div>
                      <span className="text-xs text-gray-500">by {quiz.creatorName}</span>
                    </div>
                    <Button onClick={() => startQuiz(quiz)} size="sm" className="bg-white text-black hover:bg-gray-200">
                      <Play className="w-3 h-3 mr-2 fill-current" />
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
