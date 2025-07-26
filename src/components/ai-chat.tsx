"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";
import { getWeekAgo, getNow, generateId } from "lib/dayjs";
import dayjs from "lib/dayjs";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface FeedingLog {
  id: string;
  timestamp: Date;
  type: "breast" | "bottle" | "solid";
  amount?: number;
  duration?: number;
  notes?: string;
}

interface SleepLog {
  id: string;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

interface DiaperLog {
  id: string;
  timestamp: Date;
  type: "wet" | "dirty" | "both";
  notes?: string;
}

interface AIChatProps {
  feedingLogs: FeedingLog[];
  sleepLogs: SleepLog[];
  diaperLogs: DiaperLog[];
  babyName: string;
  birthDate: string;
}

export function AIChat({
  feedingLogs,
  sleepLogs,
  diaperLogs,
  babyName,
  birthDate,
}: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "ai",
      content: `Hi! I'm your AI baby care assistant! 👶✨ I can help you with general baby questions or analyze ${babyName}'s feeding, sleep, and diaper patterns. What would you like to know?`,
      timestamp: getNow().toDate(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Analyze user's data for personalized responses
    const totalFeedings = feedingLogs.length;
    const totalSleep = sleepLogs.length;
    const totalDiapers = diaperLogs.length;

    // Get recent patterns (last 7 days)
    const weekAgo = getWeekAgo();
    const recentFeedings = feedingLogs.filter((log) =>
      dayjs(log.timestamp).isAfter(weekAgo)
    );
    const recentSleep = sleepLogs.filter((log) =>
      dayjs(log.startTime).isAfter(weekAgo)
    );
    const recentDiapers = diaperLogs.filter((log) =>
      dayjs(log.timestamp).isAfter(weekAgo)
    );

    // Calculate average daily patterns
    const avgFeedingsPerDay = Math.round((recentFeedings.length / 7) * 10) / 10;
    const avgDiapersPerDay = Math.round((recentDiapers.length / 7) * 10) / 10;

    // Calculate average sleep duration
    const completedSleeps = recentSleep.filter((log) => log.endTime);
    const avgSleepDuration =
      completedSleeps.length > 0
        ? completedSleeps.reduce((total, log) => {
            if (log.endTime) {
              return (
                total + dayjs(log.endTime).diff(dayjs(log.startTime), "hour")
              );
            }
            return total;
          }, 0) / completedSleeps.length
        : 0;

    // Pattern analysis responses
    if (
      message.includes("pattern") ||
      message.includes("trend") ||
      message.includes("analysis")
    ) {
      return `📊 Here's ${babyName}'s recent patterns:

**Feeding Patterns (Last 7 days):**
• Average: ${avgFeedingsPerDay} feedings per day
• Total logged: ${recentFeedings.length} feedings
• Most common type: ${getMostCommonFeedingType(recentFeedings)}

**Sleep Patterns:**
• Average sleep duration: ${
        Math.round(avgSleepDuration * 10) / 10
      } hours per session
• Total sleep sessions: ${recentSleep.length}

**Diaper Changes:**
• Average: ${avgDiapersPerDay} changes per day
• Total: ${recentDiapers.length} changes this week

${getPatternInsights(avgFeedingsPerDay, avgSleepDuration, avgDiapersPerDay)}`;
    }

    // Feeding-related questions
    if (
      message.includes("feed") ||
      message.includes("milk") ||
      message.includes("bottle") ||
      message.includes("breast")
    ) {
      if (message.includes("how often") || message.includes("frequency")) {
        return `🍼 Based on ${babyName}'s data, they're averaging ${avgFeedingsPerDay} feedings per day. 

**General Guidelines:**
• Newborns (0-2 months): 8-12 times per day
• 2-4 months: 6-8 times per day  
• 4-6 months: 5-6 times per day

${babyName}'s current pattern looks ${
          avgFeedingsPerDay >= 6
            ? "great! This is within normal range."
            : "like it might need attention. Consider consulting your pediatrician if you're concerned."
        }`;
      }

      if (message.includes("amount") || message.includes("how much")) {
        const bottleFeedings = recentFeedings.filter(
          (f) => f.type === "bottle" && f.amount
        );
        const avgAmount =
          bottleFeedings.length > 0
            ? bottleFeedings.reduce((sum, f) => sum + (f.amount || 0), 0) /
              bottleFeedings.length
            : 0;

        return `🍼 ${babyName}'s average bottle feeding: ${
          Math.round(avgAmount * 10) / 10
        }oz

**General Guidelines by Age:**
• 0-1 month: 1-3oz per feeding
• 1-2 months: 2-4oz per feeding
• 2-4 months: 3-5oz per feeding
• 4-6 months: 4-6oz per feeding

Remember: Every baby is different! Follow ${babyName}'s hunger cues. 👶`;
      }

      return `🍼 Great question about feeding! ${babyName} has ${totalFeedings} feedings logged. 

**Quick Tips:**
• Watch for hunger cues: rooting, sucking motions, fussiness
• Burp baby halfway through and after feeding
• Track wet diapers (6+ per day is good!)
• Growth spurts may increase appetite

What specific feeding question can I help with?`;
    }

    // Sleep-related questions
    if (
      message.includes("sleep") ||
      message.includes("sleep") ||
      message.includes("bedtime")
    ) {
      if (message.includes("how long") || message.includes("duration")) {
        return `😴 ${babyName}'s average sleep session: ${
          Math.round(avgSleepDuration * 10) / 10
        } hours

**Typical Sleep Needs by Age:**
• Newborn (0-3 months): 14-17 hours total per day
• 4-11 months: 12-15 hours total per day
• Sleep sessions vary: 30 minutes to 4+ hours

${
  avgSleepDuration >= 2
    ? "That's a good duration!"
    : "Short naps are normal for young babies."
} 

**Sleep Tips:**
• Create a consistent bedtime routine
• Watch for sleep cues: yawning, rubbing eyes
• Safe sleep: back sleeping, firm mattress`;
      }

      return `😴 ${babyName} has ${totalSleep} sleep sessions logged!

**Sleep Success Tips:**
• Consistent routine helps signal bedtime
• Room temperature: 68-70°F (20-21°C)
• White noise can be soothing
• Swaddling may help newborns feel secure

What specific sleep challenge can I help with?`;
    }

    // Diaper-related questions
    if (
      message.includes("diaper") ||
      message.includes("poop") ||
      message.includes("wet")
    ) {
      return `💩 ${babyName} has ${totalDiapers} diaper changes logged!

**Healthy Diaper Patterns:**
• Newborns: 6+ wet diapers per day
• Breastfed babies: 3+ poopy diapers daily (first month)
• Formula-fed: 1-4 poopy diapers daily
• After 6 weeks: patterns vary widely

**Your Recent Pattern:** ${avgDiapersPerDay} changes per day

**When to Check with Doctor:**
• No wet diapers for 6+ hours
• Hard, pellet-like stools
• Blood in stool
• Signs of diaper rash that won't heal

${
  avgDiapersPerDay >= 6
    ? "Your diaper change frequency looks healthy! 👍"
    : "Consider tracking more closely if you're concerned about frequency."
}`;
    }

    // General baby care questions
    if (
      message.includes("cry") ||
      message.includes("fussy") ||
      message.includes("calm")
    ) {
      return `😢 Crying is baby's way of communicating! Here's a checklist:

**Common Reasons & Solutions:**
• **Hungry** → Try feeding (even if recent)
• **Tired** → Swaddle, dim lights, gentle rocking
• **Dirty diaper** → Check and change
• **Too hot/cold** → Adjust clothing/room temp
• **Overstimulated** → Quiet, calm environment
• **Gas/tummy trouble** → Bicycle legs, tummy massage
• **Need comfort** → Skin-to-skin, gentle shushing

**The 5 S's for Soothing:**
1. Swaddle
2. Side/stomach position (while awake & supervised)
3. Shush (white noise)
4. Swing (gentle motion)
5. Suck (pacifier or clean finger)

Trust your instincts - you know ${babyName} best! 💕`;
    }

    if (
      message.includes("growth") ||
      message.includes("milestone") ||
      message.includes("development")
    ) {
      const babyAge = birthDate ? calculateAge(birthDate) : "unknown age";

      return `📈 ${babyName} is ${babyAge}! Here are key milestones to watch for:

**0-3 Months:**
• Lifts head during tummy time
• Follows objects with eyes
• Begins to smile socially
• Makes cooing sounds

**3-6 Months:**
• Rolls over
• Sits with support
• Reaches for toys
• Laughs and babbles

**6-12 Months:**
• Sits without support
• Crawls or scoots
• Says first words
• Pulls to standing

Remember: Every baby develops at their own pace! Regular pediatric checkups track growth and development. 👶✨`;
    }

    // Default responses for general questions
    const generalResponses = [
      `I'm here to help with ${babyName}'s care! You can ask me about:
      
🍼 **Feeding:** patterns, amounts, schedules
😴 **Sleep:** duration, routines, tips  
💩 **Diapers:** frequency, what's normal
📊 **Patterns:** analyze ${babyName}'s trends
👶 **General Care:** crying, development, milestones

What would you like to know?`,

      `Based on your logs, ${babyName} seems to be doing well! Here are some general tips:

✨ **Daily Care Reminders:**
• Follow baby's cues for feeding and sleep
• Tummy time when awake and supervised
• Talk and sing to promote development
• Take care of yourself too - you're doing great!

What specific question can I help with?`,

      `Hi! I can help you understand ${babyName}'s patterns or answer general baby care questions. 

Some things I can help with:
• Interpreting feeding/sleep patterns
• Age-appropriate milestones
• Common baby care challenges
• When to contact your pediatrician

What's on your mind today?`,
    ];

    return generalResponses[
      Math.floor(Math.random() * generalResponses.length)
    ];
  };

  const getMostCommonFeedingType = (feedings: FeedingLog[]): string => {
    if (feedings.length === 0) return "No data";

    const counts = feedings.reduce((acc, feeding) => {
      acc[feeding.type] = (acc[feeding.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(counts).reduce((a, b) =>
      counts[a[0]] > counts[b[0]] ? a : b
    )[0];

    const typeNames = {
      breast: "Breastfeeding",
      bottle: "Bottle feeding",
      solid: "Solid food",
    };

    return typeNames[mostCommon as keyof typeof typeNames] || mostCommon;
  };

  const getPatternInsights = (
    avgFeedings: number,
    avgSleep: number,
    avgDiapers: number
  ): string => {
    const insights = [];

    if (avgFeedings < 6) {
      insights.push(
        "• Consider tracking feedings more closely - newborns typically need 8-12 feeds per day"
      );
    } else if (avgFeedings > 12) {
      insights.push(
        "• High feeding frequency - this could indicate growth spurts or cluster feeding"
      );
    } else {
      insights.push("• Feeding frequency looks healthy! 👍");
    }

    if (avgSleep < 1) {
      insights.push(
        "• Short sleep sessions are normal for newborns, but ensure total daily sleep is adequate"
      );
    } else if (avgSleep > 4) {
      insights.push(
        "• Great sleep duration! Longer stretches are developing well"
      );
    }

    if (avgDiapers < 6) {
      insights.push(
        "• Monitor hydration - babies typically need 6+ wet diapers per day"
      );
    } else {
      insights.push("• Diaper frequency indicates good hydration! 💧");
    }

    return insights.length > 0 ? `\n**Insights:**\n${insights.join("\n")}` : "";
  };

  const calculateAge = (birthDate: string): string => {
    if (!birthDate) return "unknown age";

    const birth = dayjs(birthDate);
    const now = getNow();
    const diffDays = now.diff(birth, "day");

    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} old`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? "" : "s"} old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? "" : "s"} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years === 1 ? "" : "s"}${
        remainingMonths > 0
          ? ` and ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`
          : ""
      } old`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      type: "user",
      content: inputValue.trim(),
      timestamp: getNow().toDate(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        type: "ai",
        content: generateAIResponse(userMessage.content),
        timestamp: getNow().toDate(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // 1-2.5 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Analyze my baby's patterns",
    "How often should I feed?",
    "Sleep tips for newborns",
    "Is my baby's diaper frequency normal?",
    "Why is my baby crying?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[calc(100vw-2rem)] max-w-96 h-[70vh] max-h-[500px] md:w-96 md:h-[500px] shadow-2xl z-50 flex flex-col bg-white border-2 border-purple-200">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
                AI Baby Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 text-xs md:text-sm opacity-90">
              <Sparkles className="w-3 h-3" />
              <span>Powered by AI • Analyzing {babyName}'s data</span>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 md:gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "ai" && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs md:text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 opacity-70 ${
                      message.type === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.type === "user" && (
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 md:gap-3 justify-start">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-2 md:p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 font-medium">
                  Quick questions:
                </div>
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputValue(question);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className="w-full text-left justify-start text-xs h-auto py-2 px-2 md:px-3 bg-white hover:bg-purple-50 border-purple-200"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-3 md:p-4 border-t bg-white rounded-b-lg">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${babyName}'s care...`}
                className="flex-1 border-purple-200 focus:border-purple-400 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              AI responses are for informational purposes. Always consult your
              pediatrician for medical advice.
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
