export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  topic: string;
  creatorId: string;
  creatorName: string;
  createdAt: any;
  questions: Question[];
}

export interface Score {
  id?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  createdAt: any;
}

export interface Agent {
  id: number;
  name: string;
  icon: string;
  description: string;
  tasks: string[];
  instructions: string;
}
