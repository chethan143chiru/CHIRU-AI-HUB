import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Score } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scoreData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Score));
      setScores(scoreData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching scores:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
        ))}
      </div>
    );
  }

  const topThree = scores.slice(0, 3);
  const rest = scores.slice(3);

  return (
    <div className="space-y-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Global Leaderboard</h2>
        <p className="text-gray-400">Top performers across all quizzes in the CHIRU AI network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {topThree.map((score, index) => (
          <motion.div
            key={score.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden border-2 ${
              index === 0 ? "border-yellow-500/50 bg-yellow-500/5" :
              index === 1 ? "border-gray-400/50 bg-gray-400/5" :
              "border-orange-600/50 bg-orange-600/5"
            }`}>
              <div className="absolute top-4 right-4 opacity-20">
                {index === 0 ? <Trophy className="w-12 h-12 text-yellow-500" /> :
                 index === 1 ? <Medal className="w-12 h-12 text-gray-400" /> :
                 <Star className="w-12 h-12 text-orange-600" />}
              </div>
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <img 
                    src={score.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${score.userId}`} 
                    alt={score.userName}
                    className="w-full h-full rounded-full border-4 border-black/50"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-black ${
                    index === 0 ? "bg-yellow-500" :
                    index === 1 ? "bg-gray-400" :
                    "bg-orange-600"
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <CardTitle className="text-xl">{score.userName}</CardTitle>
                <p className="text-sm text-gray-500 truncate px-4">{score.quizTitle}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold mb-1">{score.score}/{score.totalQuestions}</div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-white/20">
                  {Math.round((score.score / score.totalQuestions) * 100)}% Accuracy
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold">Recent Rankings</h3>
        </div>
        <div className="divide-y divide-white/10">
          {rest.map((score, index) => (
            <div key={score.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-gray-500 font-mono w-6 text-center">{index + 4}</span>
                <img 
                  src={score.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${score.userId}`} 
                  alt={score.userName}
                  className="w-10 h-10 rounded-full border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-medium">{score.userName}</div>
                  <div className="text-xs text-gray-500">{score.quizTitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-500">{score.score}/{score.totalQuestions}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-tighter">
                  {new Date(score.createdAt?.toDate()).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {rest.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No more rankings yet. Be the first to take a quiz!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
