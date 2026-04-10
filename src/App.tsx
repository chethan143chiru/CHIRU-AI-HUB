/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AGENTS } from "./constants";
import { AgentGrid } from "@/components/AgentGrid";
import { QuizSystem } from "@/components/QuizSystem";
import { Leaderboard } from "@/components/Leaderboard";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "quizzes" | "leaderboard">("agents");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30">
      <Navbar 
        user={user} 
        onLogin={signInWithGoogle} 
        onLogout={logout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "agents" && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  MULTI-AGENT CONTROLLER
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Welcome to CHIRU AI. Manage and interact with 14 specialized AI agents 
                  designed for research, automation, and learning.
                </p>
              </div>
              <AgentGrid agents={AGENTS} />
            </motion.div>
          )}

          {activeTab === "quizzes" && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizSystem user={user} onLogin={signInWithGoogle} />
            </motion.div>
          )}

          {activeTab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

