import { Badge } from "@/components/ui/badge"

interface Schedule {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  session_type: string
  course?: {
    name: string
    code: string
  }
  instructor?: {
    name: string
  }
  room?: {
    name: string
  }
}

interface RecentSchedulesProps {
  schedules: Schedule[]
}

const dayNames = {
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
  7: "Sun",
}

export function RecentSchedules({ schedules }: RecentSchedulesProps) {
  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds from HH:MM:SS
  }

  if (schedules.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No schedules found</div>
  }

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div className="space-y-1">
            <p className="font-medium text-sm">{schedule.course?.name}</p>
            <p className="text-xs text-muted-foreground">
              {schedule.instructor?.name} • {schedule.room?.name}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {dayNames[schedule.day_of_week as keyof typeof dayNames]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTime(schedule.start_time)}-{formatTime(schedule.end_time)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
