"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Milk, Moon, ChevronDown, ChevronRight, Edit } from "lucide-react"

interface FeedingLog {
  id: string
  timestamp: Date
  type: "breast" | "bottle" | "solid"
  amount?: number
  duration?: number
  notes?: string
}

interface SleepLog {
  id: string
  startTime: Date
  endTime?: Date
  notes?: string
}

interface DiaperLog {
  id: string
  timestamp: Date
  type: "wet" | "dirty" | "both"
  notes?: string
}

interface HistoryViewProps {
  feedingLogs: FeedingLog[]
  sleepLogs: SleepLog[]
  diaperLogs: DiaperLog[]
  onBack: () => void
  formatTime: (date: Date | undefined) => string
  formatDuration: (start: Date, end: Date) => string
  onEditFeeding: (feeding: FeedingLog) => void
  onEditSleep: (sleep: SleepLog) => void
  onEditDiaper: (diaper: DiaperLog) => void
}

export function HistoryView({
  feedingLogs,
  sleepLogs,
  diaperLogs,
  onBack,
  formatTime,
  formatDuration,
  onEditFeeding,
  onEditSleep,
  onEditDiaper,
}: HistoryViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  // Group logs by date
  const groupLogsByDate = () => {
    const groups: { [key: string]: { feedings: FeedingLog[]; sleeps: SleepLog[]; diapers: DiaperLog[] } } = {}

    feedingLogs.forEach((log) => {
      const dateKey = log.timestamp.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] }
      }
      groups[dateKey].feedings.push(log)
    })

    sleepLogs.forEach((log) => {
      const dateKey = log.startTime.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] }
      }
      groups[dateKey].sleeps.push(log)
    })

    diaperLogs.forEach((log) => {
      const dateKey = log.timestamp.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] }
      }
      groups[dateKey].diapers.push(log)
    })

    // Sort by date (newest first)
    return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
  }

  const groupedLogs = groupLogsByDate()

  const toggleDay = (dateKey: string) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey)
    } else {
      newExpanded.add(dateKey)
    }
    setExpandedDays(newExpanded)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  const getDayStats = (feedings: FeedingLog[], sleeps: SleepLog[], diapers: DiaperLog[]) => {
    const totalFeedings = feedings.length
    const totalDiapers = diapers.length
    const totalSleep = sleeps.reduce((total, log) => {
      if (log.endTime) {
        return total + (log.endTime.getTime() - log.startTime.getTime())
      }
      return total
    }, 0)
    const totalSleepHours = Math.round((totalSleep / (1000 * 60 * 60)) * 10) / 10

    return { totalFeedings, totalSleepHours, totalDiapers }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h1 className="text-lg font-bold text-gray-800">History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {groupedLogs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No history yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start logging feeds and sleep to see your history here! 📊</p>
            </CardContent>
          </Card>
        ) : (
          groupedLogs.map(([dateKey, { feedings, sleeps, diapers }]) => {
            const isExpanded = expandedDays.has(dateKey)
            const { totalFeedings, totalSleepHours, totalDiapers } = getDayStats(feedings, sleeps, diapers)

            // Combine and sort activities for the day
            const dayActivities = [
              ...feedings.map((log) => ({ ...log, logType: "feeding" as const })),
              ...sleeps.map((log) => ({ ...log, logType: "sleep" as const })),
              ...diapers.map((log) => ({ ...log, logType: "diaper" as const })),
            ].sort((a, b) => {
              const timeA = a.logType === "feeding" ? a.timestamp : a.logType === "diaper" ? a.timestamp : a.startTime
              const timeB = b.logType === "feeding" ? b.timestamp : b.logType === "diaper" ? b.timestamp : b.startTime
              return timeB.getTime() - timeA.getTime()
            })

            return (
              <Card key={dateKey}>
                <CardHeader className="cursor-pointer" onClick={() => toggleDay(dateKey)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{formatDate(dateKey)}</CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Milk className="w-4 h-4" />
                          <span>{totalFeedings} feeds</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Moon className="w-4 h-4" />
                          <span>{totalSleepHours}h sleep</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <span className="text-sm">💩</span>
                          <span>{totalDiapers} diapers</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-3">
                    {dayActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group">
                        {activity.logType === "feeding" ? (
                          <>
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Milk className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800 text-sm">Feeding</span>
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600">
                                {formatTime(activity.timestamp)}
                                {activity.amount && ` • ${activity.amount}oz`}
                                {activity.duration && ` • ${activity.duration}min`}
                              </div>
                              {activity.notes && <div className="text-xs text-gray-500 mt-1">{activity.notes}</div>}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditFeeding(activity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </>
                        ) : activity.logType === "sleep" ? (
                          <>
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Moon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800 text-sm">Sleep</span>
                                {!activity.endTime && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs">Active</Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                {formatTime(activity.startTime)}
                                {activity.endTime && (
                                  <>
                                    {" - "}
                                    {formatTime(activity.endTime)}
                                    {" • "}
                                    {formatDuration(activity.startTime, activity.endTime)}
                                  </>
                                )}
                              </div>
                              {activity.notes && <div className="text-xs text-gray-500 mt-1">{activity.notes}</div>}
                            </div>
                            {activity.endTime && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditSleep(activity)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">💩</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800 text-sm">Diaper</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600">{formatTime(activity.timestamp)}</div>
                              {activity.notes && <div className="text-xs text-gray-500 mt-1">{activity.notes}</div>}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditDiaper(activity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
