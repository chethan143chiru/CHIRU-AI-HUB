import { useState } from "react";
import { Agent } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { getAgentResponse } from "../lib/gemini";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Send, Bot, User as UserIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AgentGridProps {
  agents: Agent[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AgentGrid({ agents }: AgentGridProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages([
      { 
        role: "assistant", 
        content: `Hello! I am the **${agent.name}**. ${agent.description} How can I help you today?` 
      }
    ]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await getAgentResponse(selectedAgent.name, userMessage, selectedAgent.instructions);
      setMessages(prev => [...prev, { role: "assistant", content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Error getting agent response:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Error: Failed to connect to the agent. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => {
          const IconComponent = (Icons as any)[agent.icon];
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleAgentClick(agent)}
            >
            <Card className="bg-white/5 border-white/10 hover:border-orange-500/50 transition-all group cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-white/20 text-gray-400">
                    Agent {agent.id.toString().padStart(2, '0')}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">{agent.name}</CardTitle>
                <CardDescription className="text-gray-400 line-clamp-2">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {agent.tasks.slice(0, 2).map((task, i) => (
                    <span key={i} className="text-[10px] text-gray-500 border border-white/10 px-2 py-1 rounded">
                      {task}
                    </span>
                  ))}
                  {agent.tasks.length > 2 && (
                    <span className="text-[10px] text-gray-500 border border-white/10 px-2 py-1 rounded">
                      +{agent.tasks.length - 2} more
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>

      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col bg-[#0a0a0a] border-white/10 text-white p-0 overflow-hidden">
          {selectedAgent && (
            <>
              <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                    {(() => {
                      const Icon = (Icons as any)[selectedAgent.icon];
                      return Icon ? <Icon className="w-5 h-5" /> : null;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedAgent.name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedAgent.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === "assistant" ? "bg-orange-500/20 text-orange-500" : "bg-white/10 text-white"
                      }`}>
                        {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "assistant" 
                          ? "bg-white/5 border border-white/10 text-gray-200" 
                          : "bg-orange-500 text-black font-medium"
                      }`}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center animate-pulse">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-white/10 bg-white/5">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2"
                >
                  <Input 
                    placeholder={`Message ${selectedAgent.name}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-black/50 border-white/10 focus:border-orange-500"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading || !input.trim()} className="bg-orange-500 hover:bg-orange-600 text-black">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
