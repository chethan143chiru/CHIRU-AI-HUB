import { User } from "firebase/auth";
import { Button } from "./ui/button";
import { LogIn, LogOut, LayoutGrid, GraduationCap, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export function Navbar({ user, onLogin, onLogout, activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-black">
              C
            </div>
            <span className="font-bold text-xl tracking-tighter">CHIRU AI</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavButton 
              active={activeTab === "agents"} 
              onClick={() => setActiveTab("agents")}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Agents"
            />
            <NavButton 
              active={activeTab === "quizzes"} 
              onClick={() => setActiveTab("quizzes")}
              icon={<GraduationCap className="w-4 h-4" />}
              label="Quizzes"
            />
            <NavButton 
              active={activeTab === "leaderboard"} 
              onClick={() => setActiveTab("leaderboard")}
              icon={<Trophy className="w-4 h-4" />}
              label="Leaderboard"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">{user.displayName}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-white/20"
                referrerPolicy="no-referrer"
              />
              <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-400 hover:text-white">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onLogin}
              className="bg-white text-black hover:bg-gray-200 font-semibold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active 
          ? "bg-white/10 text-white" 
          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-white/10 rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}
