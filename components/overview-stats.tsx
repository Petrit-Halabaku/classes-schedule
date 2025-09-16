import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, MapPin, Calendar } from "lucide-react"

interface OverviewStatsProps {
  coursesCount: number
  instructorsCount: number
  roomsCount: number
  schedulesCount: number
}

export function OverviewStats({ coursesCount, instructorsCount, roomsCount, schedulesCount }: OverviewStatsProps) {
  const stats = [
    {
      title: "Total Courses",
      value: coursesCount,
      icon: BookOpen,
      description: "Active courses",
    },
    {
      title: "Instructors",
      value: instructorsCount,
      icon: Users,
      description: "Teaching staff",
    },
    {
      title: "Rooms",
      value: roomsCount,
      icon: MapPin,
      description: "Available rooms",
    },
    {
      title: "Schedules",
      value: schedulesCount,
      icon: Calendar,
      description: "Total schedules",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
